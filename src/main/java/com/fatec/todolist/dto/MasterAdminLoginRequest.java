package com.fatec.todolist.dto;

import jakarta.validation.constraints.NotBlank;

public record MasterAdminLoginRequest(
        @NotBlank(message = "Usuário é obrigatório")
        String username,

        @NotBlank(message = "Senha é obrigatória")
        String password
) {}
