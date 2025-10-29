package com.project.Lexicon.service;

import java.io.File;

public interface WhisperService {
    String transcribeAudio(File audioFile);
}
