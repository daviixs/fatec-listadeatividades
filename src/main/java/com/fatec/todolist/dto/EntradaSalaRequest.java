package com.fatec.todolist.dto;

import jakarta.validation.constraints.NotBlank;

public record EntradaSalaRequest(
        @NotBlank String codigo,
        @NotBlank String rm,
        @NotBlank String nome
) {
}
