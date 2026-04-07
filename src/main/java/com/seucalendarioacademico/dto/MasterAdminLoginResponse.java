package com.seucalendarioacademico.dto;

public record MasterAdminLoginResponse(
        String token,
        String username,
        long expiresIn
) {}
