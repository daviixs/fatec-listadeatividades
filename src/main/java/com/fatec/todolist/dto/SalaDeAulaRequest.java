package com.fatec.todolist.dto;

import jakarta.validation.constraints.NotBlank;

public record SalaDeAulaRequest (
    @NotBlank String nome,
    @NotBlank String semestre,
    @NotBlank String segredoLider
) {}
