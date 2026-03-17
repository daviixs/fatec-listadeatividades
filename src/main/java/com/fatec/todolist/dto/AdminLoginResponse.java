package com.fatec.todolist.dto;

public record AdminLoginResponse(
        Integer salaId,
        String nomeSala,
        String semestre,
        boolean autenticado
) {}
