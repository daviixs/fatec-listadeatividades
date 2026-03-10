package com.fatec.todolist.dto;

import com.fatec.todolist.entity.OpcaoVoto;
import jakarta.validation.constraints.NotNull;

public record VotoRequest(
        @NotNull OpcaoVoto opcao
) {
}
