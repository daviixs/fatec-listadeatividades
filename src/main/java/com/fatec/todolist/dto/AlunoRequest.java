package com.fatec.todolist.dto;

import jakarta.validation.constraints.NotBlank;

public record AlunoRequest(
        @NotBlank String rm,
        @NotBlank String nome
) {
}
