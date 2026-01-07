package com.project.Lexicon.controller;

import com.project.Lexicon.domain.dto.UserDto;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.mapper.UserMapper;
import com.project.Lexicon.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PatchMapping("/{name}")
    public ResponseEntity<UserDto> updateUserInfo(@PathVariable("name") String name, @RequestBody UserDto updateDto) {
        User user = userMapper.toEntity(updateDto);
        User updatedUser = userService.editPersonalInfo(name, user);
        UserDto responseDto = userMapper.toDto(updatedUser);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PatchMapping("/me/avatar")
    public ResponseEntity<?> updateAvatar(@RequestBody Map<String, String> payload) {
        String avatarUrl = payload.get("avatarUrl");
        if (avatarUrl == null || avatarUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "avatarUrl is required"));
        }
        
        User updatedUser = userService.updateAvatar(avatarUrl);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Avatar updated successfully",
            "avatarUrl", updatedUser.getAvatarUrl()
        ));
    }
}
