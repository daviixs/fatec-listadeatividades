package com.fatec.todolist.dto;

import java.util.List;

public record CursoResponse(
    String nome,
    String nomeCompleto,
    List<SemestreResponse> semestres
) {
}