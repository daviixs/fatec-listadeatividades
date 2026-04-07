package com.seucalendarioacademico.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.seucalendarioacademico.repository.SalaDeAulaRepository;
import com.seucalendarioacademico.exception.RecursoNaoEncontradoException;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(2)
public class SalaAdminSecurityFilter extends OncePerRequestFilter {

    private final SalaDeAulaRepository salaRepository;

    public SalaAdminSecurityFilter(SalaDeAulaRepository salaRepository) {
        this.salaRepository = salaRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String salaAdminPath = "/api/salas/";

        if (path.startsWith(salaAdminPath) && path.contains("/admin/")) {
            String providedSecret = request.getHeader("X-Sala-Admin-Secret");
            
            if (providedSecret == null || providedSecret.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Cabeçalho X-Sala-Admin-Secret não fornecido");
                return;
            }

            try {
                String salaIdStr = path.substring(salaAdminPath.length());
                int slashIndex = salaIdStr.indexOf('/');
                String salaIdStrClean = salaIdStr.substring(0, slashIndex);
                Integer salaId = Integer.parseInt(salaIdStrClean);

                var sala = salaRepository.findById(salaId)
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Sala não encontrada"));

                if (!providedSecret.equals(sala.getSegredoLider())) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Senha inválida");
                    return;
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("ID de sala inválido");
                return;
            } catch (RecursoNaoEncontradoException e) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write(e.getMessage());
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
