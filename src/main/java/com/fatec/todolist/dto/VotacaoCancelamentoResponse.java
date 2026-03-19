package com.fatec.todolist.dto;

import java.time.LocalDateTime;

public record VotacaoCancelamentoResponse(
        Long id,
        Long atividadeId,
        String atividadeTitulo,
        String atividadeStatus,
        LocalDateTime iniciadaEm,
        LocalDateTime encerraEm,
        String status,
        long votosSim,
        long votosNao,
        long totalAlunos,
        long metaCancelamento,
        boolean cancelado,
        boolean jaVotou
) {
}
