package com.fatec.todolist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Swagger / OpenAPI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/actuator/health",
                                "/actuator/info",
                                "/actuator/caches/**",
                                "/actuator/metrics/**"
                        ).permitAll()
                        // Endpoints publicos (aluno)
                        .requestMatchers("/api/salas", "/api/salas/**").permitAll()
                        .requestMatchers("/api/materias", "/api/materias/**").permitAll()
                        .requestMatchers("/api/atividades", "/api/atividades/**").permitAll()
                        .requestMatchers("/api/lembretes", "/api/lembretes/**").permitAll()
                        .requestMatchers("/api/entrada-sala", "/api/entrada-sala/**").permitAll()
                        .requestMatchers("/api/votacao", "/api/votacao/**").permitAll()
                        // Endpoints do lider (protegidos futuramente)
                        .requestMatchers("/api/admin", "/api/admin/**").permitAll()
                        // Endpoints do master admin
                        .requestMatchers("/api/master-admin", "/api/master-admin/**").permitAll()
                        // Qualquer outra rota precisa estar autenticada
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "https://*.vercel.app",
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
