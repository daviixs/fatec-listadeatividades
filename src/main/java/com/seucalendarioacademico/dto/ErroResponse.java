package com.seucalendarioacademico.dto;

import java.time.LocalDateTime;

public record ErroResponse(
        LocalDateTime timestamp,
        int status,
        String codigo,
        String mensagem,
        String detalhes
) {
    public static ErroResponse criar(int status, String codigo, String mensagem, String detalhes) {
        return new ErroResponse(LocalDateTime.now(), status, codigo, mensagem, detalhes);
    }
}
