package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.TranscriptionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.*;
import java.nio.ByteBuffer;
import java.util.concurrent.CompletableFuture;

@Service
public class TranscriptionServiceImpl implements TranscriptionService {

    @Value("${vosk.websocket.url}")
    private String voskUrl;

    @Override
    public String transcribeFromYouTube(String videoUrl) {
        try {
            File audioFile = new File("audio.wav");
            ProcessBuilder pb = new ProcessBuilder("yt-dlp", "-x", "--audio-format", "wav",
                    "-o", audioFile.getAbsolutePath(), videoUrl);
            pb.redirectErrorStream(true);
            pb.start().waitFor();

            return transcribeFile(audioFile);
        } catch (Exception e) {
            throw new RuntimeException("Transcription failed", e);
        }
    }

    private String transcribeFile(File audioFile) throws Exception {
        CompletableFuture<String> resultFuture = new CompletableFuture<>();
        StandardWebSocketClient client = new StandardWebSocketClient();

        client.execute(new AbstractWebSocketHandler() {
            @Override
            public void handleTextMessage(WebSocketSession session, TextMessage message) {
                resultFuture.complete(message.getPayload());
                try { session.close(); } catch (Exception ignored) {}
            }

            @Override
            public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                try (InputStream input = new FileInputStream(audioFile)) {
                    byte[] buffer = new byte[8000];
                    int bytesRead;
                    while ((bytesRead = input.read(buffer)) != -1) {
                        session.sendMessage(new BinaryMessage(ByteBuffer.wrap(buffer, 0, bytesRead)));
                    }
                    session.sendMessage(new TextMessage("{\"eof\":1}"));
                }
            }
        }, voskUrl).get();

        return resultFuture.get();
    }
}