package com.project.Lexicon.mapper;

import com.project.Lexicon.domain.dto.LessonDto;
import com.project.Lexicon.domain.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface LessonMapper {
    LessonDto toDto(Lesson lesson);
    Lesson toEntity(LessonDto lessonDto);
}
