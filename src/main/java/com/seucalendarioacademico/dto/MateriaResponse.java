package com.seucalendarioacademico.dto;

public record MateriaResponse (
    Long id,
    String nome,
    String professor,
    String salaNome
){}
