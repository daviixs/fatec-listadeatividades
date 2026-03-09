package com.fatec.todolist.dto;


import java.time.LocalDate;

public record AtividadeResponse (
    Long Id,
    String Titulo,
    String Descricao,
    Enum tipo_entrega,
    String link_entrega,
    String regras,
    LocalDate prazo,
    String materia
){}