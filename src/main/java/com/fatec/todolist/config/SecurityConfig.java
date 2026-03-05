package com.fatec.todolist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Swagger / OpenAPI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs"
                        ).permitAll()
                        // Endpoints publicos (aluno)
                        .requestMatchers("/api/salas/**").permitAll()
                        .requestMatchers("/api/materias/**").permitAll()
                        .requestMatchers("/api/atividades/**").permitAll()
                        // Endpoints do lider (protegidos futuramente)
                        .requestMatchers("/api/admin/**").permitAll()
                        // Qualquer outra rota precisa estar autenticada
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
