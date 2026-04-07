package com.seucalendarioacademico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MateriaRequest (
        @NotBlank String nome,
        @NotBlank String professor,
        @NotNull Long salaId
){}