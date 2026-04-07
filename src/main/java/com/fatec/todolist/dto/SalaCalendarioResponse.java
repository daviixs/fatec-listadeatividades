package com.fatec.todolist.dto;

import java.util.List;

public record SalaCalendarioResponse(
        SalaDeAulaResponse sala,
        List<MateriaResponse> materias,
        List<AtividadeCalendarioResponse> atividades
) {
}
