package com.seucalendarioacademico.dto;

public record AlunoResponse(
        Long id,
        String rm,
        String nome,
        String salaNome
) {
}
