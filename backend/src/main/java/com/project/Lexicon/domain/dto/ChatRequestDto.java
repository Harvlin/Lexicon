package com.project.Lexicon.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequestDto {
    private String prompt;
    private String lessonId;
    private List<MessageDto> history;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MessageDto {
        private String role;
        private String content;
    }
}
