package com.seucalendarioacademico.dto;

import com.seucalendarioacademico.entity.OpcaoVoto;
import jakarta.validation.constraints.NotNull;

public record VotoRequest(
        @NotNull OpcaoVoto opcao
) {
}
