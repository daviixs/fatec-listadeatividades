package com.seucalendarioacademico.dto;

import com.seucalendarioacademico.entity.TipoAtividade;
import com.seucalendarioacademico.entity.TipoEntrega;
import com.seucalendarioacademico.entity.StatusAtividade;
import com.seucalendarioacademico.entity.StatusAprovacao;
import java.time.LocalDate;

public record AtividadeResponse (
    Long id,
    String titulo,
    String descricao,
    TipoEntrega tipoEntrega,
    String linkEntrega,
    String regras,
    LocalDate prazo,
    StatusAtividade status,
    String materiaNome,
    TipoAtividade tipo,
    StatusAprovacao statusAprovacao,
    Long criadoPorAlunoId
){}
