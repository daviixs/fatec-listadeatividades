package com.seucalendarioacademico.dto;

import java.time.LocalDateTime;

public record EntradaSalaResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        String alunoRm,
        String status,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
