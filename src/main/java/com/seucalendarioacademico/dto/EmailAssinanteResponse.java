package com.seucalendarioacademico.dto;

import java.time.LocalDateTime;

public record EmailAssinanteResponse(
        Long id,
        String email,
        Boolean ativo,
        LocalDateTime dataCadastro,
        LocalDateTime ultimoEnvio
) {}
