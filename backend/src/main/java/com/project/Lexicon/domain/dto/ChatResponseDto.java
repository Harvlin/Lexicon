package com.project.Lexicon.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponseDto {
    private String id;
    private String role;
    private String content;
    private String timestamp;
}
