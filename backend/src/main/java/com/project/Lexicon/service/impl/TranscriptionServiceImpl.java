package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.TranscriptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.vosk.Model;
import org.vosk.Recognizer;

import java.io.*;

@Service
@Slf4j
public class TranscriptionServiceImpl implements TranscriptionService {

    public String transcribeFromYoutube(String youtubeUrl) {
        try {
            String audioPath = "/tmp/audio.mp3";
            ProcessBuilder ytDlp = new ProcessBuilder(
                    "yt-dlp", "-f", "bestaudio",
                    "--extract-audio", "--audio-format", "mp3",
                    "-o", audioPath, youtubeUrl
            );
            ytDlp.inheritIO().start().waitFor();

            String wavPath = "/tmp/audio.wav";
            ProcessBuilder ffmpeg = new ProcessBuilder(
                    "ffmpeg", "-y", "-i", audioPath,
                    "-ac", "1", "-ar", "16000", wavPath
            );
            ffmpeg.inheritIO().start().waitFor();

            return transcribeWithVosk(wavPath);

        } catch (Exception e) {
            log.error("Transcription failed", e);
            throw new RuntimeException("Transcription failed: " + e.getMessage(), e);
        }
    }

    private String transcribeWithVosk(String wavPath) throws IOException {
        File wavFile = new File(wavPath);
        if (!wavFile.exists()) throw new FileNotFoundException("Audio file not found: " + wavPath);

        String modelPath = "vosk-model-small-en-us-0.15"; // sudah dicopy ke /app/
        try (Model model = new Model(modelPath);
             Recognizer recognizer = new Recognizer(model, 16000.0f);
             InputStream ais = new FileInputStream(wavFile)) {

            byte[] buffer = new byte[4096];
            while (true) {
                int nbytes = ais.read(buffer);
                if (nbytes < 0) break;
                recognizer.acceptWaveForm(buffer, nbytes);
            }
            return recognizer.getFinalResult();
        }
    }
}
