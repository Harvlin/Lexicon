package com.project.Lexicon.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Lexicon.domain.dto.OnboardingProfileDto;
import com.project.Lexicon.domain.entity.OnboardingProfile;
import java.util.Collections;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface OnboardingMapper {

    ObjectMapper M = new ObjectMapper();


    @Mapping(target = "goals", source = "goalsJson", qualifiedByName = "jsonToList")
    @Mapping(target = "skills", source = "skillsJson", qualifiedByName = "jsonToList")
    @Mapping(target = "daysOfWeek", source = "daysOfWeekJson", qualifiedByName = "jsonToList")


    OnboardingProfileDto toDto(OnboardingProfile entity);

    // DTO -> Entity (arrays -> JSON strings)
    @Mapping(target = "goalsJson", source = "goals", qualifiedByName = "listToJson")
    @Mapping(target = "skillsJson", source = "skills", qualifiedByName = "listToJson")
    @Mapping(target = "daysOfWeekJson", source = "daysOfWeek", qualifiedByName = "listToJson")
    @Mapping(target = "user", ignore = true) // set in service via current user
    OnboardingProfile toEntity(OnboardingProfileDto dto);

    @Named("jsonToList")
    static List<String> jsonToList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try { return M.readValue(json, new TypeReference<List<String>>(){}); }
        catch (Exception e) { return Collections.emptyList(); }
    }

    @Named("listToJson")
    static String listToJson(List<String> list) {
        try { return list == null ? "[]" : M.writeValueAsString(list); }
        catch (Exception e) { return "[]"; }
    }
}
