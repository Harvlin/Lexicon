package com.project.Lexicon.mapper;

import com.project.Lexicon.domain.dto.UserDto;
import com.project.Lexicon.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    @Mapping(source = "joinedAt", target = "joined")
    UserDto toDto(User user);

    @Mapping(source = "joined", target = "joinedAt")
    User toEntity(UserDto userDto);
}
