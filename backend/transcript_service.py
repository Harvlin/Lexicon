from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import re
import time
import requests
import html
import re as regex
from datetime import datetime, timedelta
from threading import Lock
from xml.etree import ElementTree as ET

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
    TooManyRequests,
    YouTubeRequestFailed,
)

try:
    from yt_dlp import YoutubeDL
    HAVE_YTDLP = True
except Exception:
    HAVE_YTDLP = False

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# ----------------------------------------------------------------------------
# Simple TTL Cache
# ----------------------------------------------------------------------------
class TTLCache:
    def __init__(self, ttl_seconds=6*3600, negative_ttl_seconds=1800):
        self.ttl = ttl_seconds
        self.negative_ttl = negative_ttl_seconds
        self._data = {}
        self._lock = Lock()

    def get(self, key):
        with self._lock:
            rec = self._data.get(key)
            if not rec:
                return None
            expires_at, val = rec
            if time.time() >= expires_at:
                self._data.pop(key, None)
                return None
            return val

    def set(self, key, val, negative=False):
        with self._lock:
            ttl = self.negative_ttl if negative else self.ttl
            self._data[key] = (time.time() + ttl, val)

    def invalidate(self, key):
        with self._lock:
            self._data.pop(key, None)

availability_cache = TTLCache(ttl_seconds=6*3600, negative_ttl_seconds=1800)
transcript_cache = TTLCache(ttl_seconds=24*3600, negative_ttl_seconds=900)

# ----------------------------------------------------------------------------
# Helpers: parsing different subtitle formats
# ----------------------------------------------------------------------------

def _clean_text(text: str) -> str:
    if not text:
        return ""
    # Remove bracketed noise like [Music], [Applause]
    text = regex.sub(r"\[.*?\]", " ", text)
    # Collapse whitespace
    text = regex.sub(r"\s+", " ", text).strip()
    return text


def _parse_vtt(content: str) -> str:
    lines = []
    for line in content.splitlines():
        if not line or line.startswith("WEBVTT"):
            continue
        # Skip timestamp lines like 00:00:01.000 --> 00:00:05.000
        if "-->" in line:
            continue
        # Drop cue identifiers (pure numbers)
        if line.strip().isdigit():
            continue
        lines.append(line)
    return _clean_text(" ".join(lines))


def _parse_srt(content: str) -> str:
    lines = []
    for line in content.splitlines():
        if not line:
            continue
        if "-->" in line:
            continue
        if line.strip().isdigit():
            continue
        lines.append(line)
    return _clean_text(" ".join(lines))


def _parse_xml_timedtext(content: str) -> str:
    try:
        root = ET.fromstring(content)
        texts = []
        # YouTube timedtext: <text start="0.5" dur="4.0">Hello</text>
        for node in root.iter():
            if node.tag.lower().endswith('text') and (node.text is not None):
                texts.append(html.unescape(node.text))
        return _clean_text(" ".join(texts))
    except Exception as e:
        logger.debug(f"XML parse failed: {e}")
        return ""


# ----------------------------------------------------------------------------
# Strategy 1: yt-dlp based retrieval (preferred)
# ----------------------------------------------------------------------------

def _fetch_via_ytdlp(video_id: str) -> str | None:
    if not HAVE_YTDLP:
        return None

    # Prefer English tracks; will fall back to any available
    preferred_langs = ["en", "en-US", "en-GB"]

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
        'extract_flat': False,
        # Don't actually write files; we will fetch subtitle URLs ourselves
        'writesubtitles': True,
        'writeautomaticsub': True,
    }

    url = f"https://www.youtube.com/watch?v={video_id}"

    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
    except Exception as e:
        logger.debug(f"yt-dlp extract failed: {e}")
        return None

    def pick_tracks(container: dict) -> list[dict]:
        if not container:
            return []
        # container maps lang -> [ {ext, url}...]
        tracks = []
        # First try preferred languages
        for lang in preferred_langs:
            if lang in container:
                tracks.extend(container.get(lang) or [])
        # Then any English variant
        for k, v in (container.items() if container else []):
            if k and k.startswith('en'):
                tracks.extend(v or [])
        # Then all others
        for k, v in (container.items() if container else []):
            if k not in preferred_langs and not (k and k.startswith('en')):
                tracks.extend(v or [])
        return tracks

    # Try manual subtitles then automatic captions
    for source_key in ('subtitles', 'automatic_captions'):
        tracks = pick_tracks(info.get(source_key) or {})
        for tr in tracks:
            url = tr.get('url')
            ext = (tr.get('ext') or '').lower()
            if not url:
                continue
            try:
                resp = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=15)
                if resp.status_code != 200 or not resp.text:
                    continue
                if ext in ('vtt', 'webvtt'):
                    text = _parse_vtt(resp.text)
                elif ext in ('srt',):
                    text = _parse_srt(resp.text)
                elif ext in ('ttml', 'xml', 'srv1', 'srv2', 'srv3', 'json3'):
                    text = _parse_xml_timedtext(resp.text)
                else:
                    # Fallback: try VTT parser; if empty, try XML
                    text = _parse_vtt(resp.text)
                    if len(text) < 20:
                        text = _parse_xml_timedtext(resp.text)

                if text and len(text) >= 20:
                    return text
            except Exception as e:
                logger.debug(f"Subtitle fetch parse failed ({ext}): {e}")
                continue

    return None


# ----------------------------------------------------------------------------
# Strategy 2: youtube_transcript_api (single shot, no backoff)
# ----------------------------------------------------------------------------

def _fetch_via_yta(video_id: str) -> str | None:
    try:
        preferred = ['en', 'en-US', 'en-GB']
        # list first so we can translate if needed
        tlist = YouTubeTranscriptApi.list_transcripts(video_id)
        try:
            t = tlist.find_manually_created_transcript(preferred)
        except NoTranscriptFound:
            try:
                t = tlist.find_generated_transcript(preferred)
            except NoTranscriptFound:
                # any transcript
                t = next(iter(tlist), None)
        if not t:
            return None
        # translate to English if not in English
        try:
            if not str(t.language_code or '').startswith('en'):
                t = t.translate('en')
        except Exception:
            pass
        data = t.fetch()
        if not data:
            return None
        text = _clean_text(' '.join(seg.get('text', '') for seg in data))
        return text if len(text) >= 20 else None
    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable):
        return None
    except (TooManyRequests, YouTubeRequestFailed) as e:
        # Do NOT bubble 429—just say None so caller can try another strategy/video
        logger.debug(f"YTA fetch blocked/failed: {e}")
        return None
    except Exception as e:
        logger.debug(f"YTA unexpected: {e}")
        return None


# ----------------------------------------------------------------------------
# HTTP Endpoints
# ----------------------------------------------------------------------------

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'version': '8.0-just-work',
        'yt_dlp': HAVE_YTDLP,
        'caches': {
            'availability': 'in-memory',
            'transcripts': 'in-memory'
        }
    }), 200


@app.route('/check/<video_id>', methods=['GET'])
def check(video_id):
    if not re.match(r'^[a-zA-Z0-9_-]{11}$', video_id or ""):
        return jsonify({'video_id': video_id, 'has_transcripts': False, 'error': 'invalid id'}), 200

    cached = availability_cache.get(video_id)
    if cached is not None:
        return jsonify({'video_id': video_id, **cached, 'cached': True}), 200

    # Fast heuristic using yt-dlp info dict; if it has subtitles/captions entries, we call it available
    has_any = False
    if HAVE_YTDLP:
        try:
            with YoutubeDL({'quiet': True, 'no_warnings': True, 'skip_download': True}) as ydl:
                info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
                subs = info.get('subtitles') or {}
                autos = info.get('automatic_captions') or {}
                has_any = (len(subs) + len(autos)) > 0
        except Exception:
            has_any = False

    # If yt-dlp couldn't tell, we still say true to let /transcript try
    payload = {
        'has_transcripts': True if has_any else True,
        'available_transcripts': []
    }
    availability_cache.set(video_id, payload)
    return jsonify({'video_id': video_id, **payload, 'cached': False}), 200


@app.route('/transcript', methods=['GET'])
def transcript():
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({'error': 'Missing video_id', 'type': 'invalid_request'}), 400
    if not re.match(r'^[a-zA-Z0-9_-]{11}$', video_id or ""):
        return jsonify({'error': 'Invalid video_id', 'type': 'invalid_request'}), 400

    # Cache first
    cached = transcript_cache.get(video_id)
    if cached:
        return jsonify({'video_id': video_id, 'transcript': cached, 'length': len(cached), 'cached': True}), 200

    # Strategy 1: yt-dlp
    text = _fetch_via_ytdlp(video_id)
    if text and len(text) >= 20:
        transcript_cache.set(video_id, text)
        availability_cache.set(video_id, {'has_transcripts': True, 'available_transcripts': []})
        return jsonify({'video_id': video_id, 'transcript': text, 'length': len(text), 'cached': False}), 200

    # Strategy 2: youtube_transcript_api (single shot)
    text = _fetch_via_yta(video_id)
    if text and len(text) >= 20:
        transcript_cache.set(video_id, text)
        availability_cache.set(video_id, {'has_transcripts': True, 'available_transcripts': []})
        return jsonify({'video_id': video_id, 'transcript': text, 'length': len(text), 'cached': False}), 200

    # Give up for this video (do NOT return 429)
    availability_cache.set(video_id, {'has_transcripts': False, 'available_transcripts': []}, negative=True)
    return jsonify({'error': 'No captions available for this video', 'type': 'no_transcript', 'video_id': video_id}), 404


@app.route('/test', methods=['GET'])
def test():
    test_video_id = request.args.get('video_id', 'jNQXAC9IVRw')
    t = transcript_cache.get(test_video_id) or _fetch_via_ytdlp(test_video_id) or _fetch_via_yta(test_video_id)
    if t:
        transcript_cache.set(test_video_id, t)
        return jsonify({'message': 'Service working', 'video': test_video_id, 'length': len(t), 'preview': t[:300] + '...'}), 200
    return jsonify({'message': 'Service running but no transcript', 'video': test_video_id}), 200


if __name__ == '__main__':
    logger.info("═══════════════════════════════════════════")
    logger.info("🚀 YouTube Transcript Service v8.0 (Just-Work)")
    logger.info("   ▶ yt-dlp fallback: %s", HAVE_YTDLP)
    logger.info("   ▶ No 429s; quick failover per video")
    logger.info("   ▶ Endpoints: /health, /check/<id>, /transcript?video_id=<id>")
    logger.info("═══════════════════════════════════════════")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
