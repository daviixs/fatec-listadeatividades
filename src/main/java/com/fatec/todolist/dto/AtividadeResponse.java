package com.fatec.todolist.dto;

import com.fatec.todolist.entity.TipoAtividade;
import com.fatec.todolist.entity.TipoEntrega;
import com.fatec.todolist.entity.StatusAtividade;
import com.fatec.todolist.entity.StatusAprovacao;
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
