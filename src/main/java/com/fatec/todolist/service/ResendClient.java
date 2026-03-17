package com.fatec.todolist.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class ResendClient {

    private final RestClient restClient;

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from}")
    private String from;

    public ResendClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://api.resend.com").build();
    }

    public String enviar(String para, String assunto, String html) {
        ResendSendRequest body = new ResendSendRequest(from, List.of(para), assunto, html);

        ResendSendResponse response = restClient.post()
                .uri("/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(ResendSendResponse.class);

        if (response == null || response.id() == null) {
            throw new IllegalStateException("Resend sem id de mensagem");
        }
        return response.id();
    }

    private record ResendSendRequest(
            String from,
            List<String> to,
            String subject,
            String html
    ) {}

    private record ResendSendResponse(String id) {}
}
