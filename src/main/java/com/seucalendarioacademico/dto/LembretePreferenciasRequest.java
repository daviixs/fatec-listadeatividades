package com.seucalendarioacademico.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record LembretePreferenciasRequest(
        @NotBlank(message = "Email obrigatorio")
        @Email(message = "Email invalido")
        String email,
        @NotEmpty(message = "Informe ao menos uma sala")
        List<Integer> salaIds
) {
}
