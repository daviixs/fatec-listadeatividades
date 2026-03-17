package com.fatec.todolist.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminLoginRequest(
        @NotBlank(message = "Código da sala é obrigatório")
        String codigoSala,

        @NotBlank(message = "Senha é obrigatória")
        String senha
) {}
