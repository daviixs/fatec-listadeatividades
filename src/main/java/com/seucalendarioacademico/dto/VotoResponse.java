package com.seucalendarioacademico.dto;

import java.time.LocalDateTime;

public record VotoResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        String opcao,
        LocalDateTime votadoEm
) {
}
