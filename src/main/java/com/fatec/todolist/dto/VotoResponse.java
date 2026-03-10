package com.fatec.todolist.dto;

import java.time.LocalDateTime;

public record VotoResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        String opcao,
        LocalDateTime votadoEm
) {
}
