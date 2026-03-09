package com.fatec.todolist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AtividadeRequest (
        @NotBlank Long Id,
        @NotBlank String Titulo,
        @NotBlank String Descricao,
        @NotBlank Enum tipo_entrega,
        @NotBlank String link_entrega,
        @NotBlank String regras,
        @NotNull LocalDate prazo,
        @NotBlank String materia
){}
