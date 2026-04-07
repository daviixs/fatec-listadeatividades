package com.seucalendarioacademico.dto;

import com.seucalendarioacademico.entity.StatusAprovacao;
import com.seucalendarioacademico.entity.StatusAtividade;
import com.seucalendarioacademico.entity.TipoAtividade;
import com.seucalendarioacademico.entity.TipoEntrega;

import java.time.LocalDate;

public record AtividadeCalendarioResponse(
        Long id,
        String titulo,
        String descricao,
        TipoEntrega tipoEntrega,
        String linkEntrega,
        String regras,
        LocalDate prazo,
        StatusAtividade status,
        Long materiaId,
        String materiaNome,
        TipoAtividade tipo,
        StatusAprovacao statusAprovacao,
        Long criadoPorAlunoId
) {
}
