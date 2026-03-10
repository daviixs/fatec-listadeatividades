package com.fatec.todolist.dto;

import com.fatec.todolist.entity.TipoEntrega;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AtividadeRequest (
        @NotNull Long id,
        @NotBlank String titulo,
        @NotBlank String descricao,
        @NotNull TipoEntrega tipoEntrega,
        String linkEntrega,
        @NotBlank String regras,
        @NotNull LocalDate prazo,
        @NotNull Long materiaId
){}
