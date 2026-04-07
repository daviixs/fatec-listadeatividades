package com.seucalendarioacademico.dto;

public record AdminLoginResponse(
        Integer salaId,
        String nomeSala,
        String semestre,
        boolean autenticado
) {}
