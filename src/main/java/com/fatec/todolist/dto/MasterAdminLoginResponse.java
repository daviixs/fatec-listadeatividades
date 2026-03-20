package com.fatec.todolist.dto;

public record MasterAdminLoginResponse(
        String token,
        String username,
        long expiresIn
) {}
