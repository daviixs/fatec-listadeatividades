package com.seucalendarioacademico.dto;

import jakarta.validation.constraints.NotBlank;

public record SalaDeAulaRequest (
    @NotBlank String nome,
    @NotBlank String semestre,
    @NotBlank String segredoLider
) {}
