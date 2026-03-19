package com.fatec.todolist.service;

import com.fatec.todolist.entity.SalaDeAula;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class LembreteBoasVindasTemplateRenderer {

    private final Resource template;
    private String cached;

    public LembreteBoasVindasTemplateRenderer(@Value("classpath:templates/lembrete-boas-vindas.html") Resource template) {
        this.template = template;
    }

    public String render(List<SalaDeAula> salas) {
        String base = loadTemplate();
        String salasString = buildSalasString(salas);
        return base.replace("{{SALAS}}", salasString);
    }

    private String buildSalasString(List<SalaDeAula> salas) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < salas.size(); i++) {
            SalaDeAula sala = salas.get(i);
            sb.append(escape(sala.getNome()));
            if (i < salas.size() - 1) {
                sb.append(" • ");
            }
        }
        return sb.toString();
    }

    private String loadTemplate() {
        if (cached != null) {
            return cached;
        }
        try {
            try (InputStream is = template.getInputStream()) {
                cached = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                return cached;
            }
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível carregar template de boas-vindas", e);
        }
    }

    private String escape(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
