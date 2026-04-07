package com.seucalendarioacademico.dto;

import java.time.LocalDateTime;
import java.util.List;

public record LembretePreferenciasResponse(
        Long assinanteId,
        String email,
        Boolean ativo,
        List<Integer> salaIds,
        LocalDateTime ultimoEnvio
) {
}
