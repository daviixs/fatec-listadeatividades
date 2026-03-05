package com.fatec.todolist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MateriaRequst (
        @NotBlank String nome,
        @NotBlank String professor,
        @NotNull Long salaId
        ) {}
