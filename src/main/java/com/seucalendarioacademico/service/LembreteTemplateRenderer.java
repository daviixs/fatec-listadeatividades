package com.seucalendarioacademico.service;

import com.seucalendarioacademico.entity.Atividade;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
public class LembreteTemplateRenderer {

    private final Resource template;
    private String cached;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public LembreteTemplateRenderer(@Value("classpath:templates/lembrete-atividades.html") Resource template) {
        this.template = template;
    }

    public String render(Map<String, List<Atividade>> atividadesPorSala) {
        String base = loadTemplate();
        StringBuilder blocos = new StringBuilder();

        atividadesPorSala.forEach((sala, atividades) -> {
            blocos.append("<section class=\"sala\">")
                    .append("<h3>").append(escape(sala)).append("</h3>")
                    .append("<ul>");
            atividades.forEach(a -> blocos.append("<li>")
                    .append("<div class=\"materia\">").append(escape(a.getMateria().getNome())).append("</div>")
                    .append("<div class=\"titulo\">").append(escape(a.getTitulo())).append("</div>")
                    .append("<div class=\"prazo\">Prazo: ")
                    .append(a.getPrazo() != null ? DATE_FORMATTER.format(a.getPrazo()) : "-")
                    .append("</div>")
                    .append("</li>"));
            blocos.append("</ul></section>");
        });

        return base.replace("{{SALAS}}", blocos.toString());
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
            throw new IllegalStateException("Não foi possível carregar template de lembrete", e);
        }
    }

    private String escape(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
