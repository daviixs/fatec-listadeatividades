package com.fatec.todolist.dto;

public record AlunoResponse(
        Long id,
        String rm,
        String nome,
        String salaNome
) {
}
