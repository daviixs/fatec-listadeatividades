package com.seucalendarioacademico.dto;

import java.time.LocalDate;

public record AtividadeAdminResponse(
        Long id,
        String titulo,
        String descricao,
        String tipoEntrega,
        String linkEntrega,
        LocalDate prazo,
        String status,
        String materiaNome,
        String tipo,
        String statusAprovacao,
        Long materiaId,
        Long salaId
) {}
