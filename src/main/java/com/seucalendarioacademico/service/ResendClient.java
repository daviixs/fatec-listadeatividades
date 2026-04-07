package com.seucalendarioacademico.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

@Component
public class ResendClient {

    private static final Logger log = LoggerFactory.getLogger(ResendClient.class);

    private final RestClient restClient;

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from}")
    private String from;

    public ResendClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://api.resend.com").build();
    }

    public String enviar(String para, String assunto, String html) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY vazio ou nao configurado");
        }
        if (from == null || from.isBlank()) {
            throw new IllegalStateException("RESEND_FROM vazio ou nao configurado");
        }

        ResendSendRequest body = new ResendSendRequest(from, List.of(para), assunto, html);

        log.info("[Resend] Enviando email para {} com assunto '{}'", para, assunto);

        try {
            ResponseEntity<ResendSendResponse> response = restClient.post()
                    .uri("/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toEntity(ResendSendResponse.class);

            log.info("[Resend] Status {} para {}", response.getStatusCode(), para);

            if (response.getBody() == null || response.getBody().id() == null) {
                throw new IllegalStateException("Resend sem id de mensagem (body vazio)");
            }

            String messageId = response.getBody().id();
            log.debug("[Resend] messageId={} para {}", messageId, para);
            return messageId;
        } catch (RestClientResponseException e) {
            // logando sem expor token
            log.error("[Resend] Falha {} ao enviar para {}: {} | body={}", e.getStatusCode(), para, e.getMessage(), e.getResponseBodyAsString());
            throw e;
        }
    }

    private record ResendSendRequest(
            String from,
            List<String> to,
            String subject,
            String html
    ) {}

    private record ResendSendResponse(String id) {}
}
