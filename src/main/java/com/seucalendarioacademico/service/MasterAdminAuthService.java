package com.seucalendarioacademico.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class MasterAdminAuthService {

    @Value("${app.master-admin.username}")
    private String configuredUsername;

    @Value("${app.master-admin.password}")
    private String configuredPassword;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, LocalDateTime> activeTokens = new HashMap<>();

    private static final long TOKEN_EXPIRY_HOURS = 24;

    public String authenticate(String username, String password) {
        if (!configuredUsername.equals(username) || !configuredPassword.equals(password)) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        String token = generateToken();
        activeTokens.put(token, LocalDateTime.now());
        return token;
    }

    public boolean validateToken(String token) {
        if (token == null || !activeTokens.containsKey(token)) {
            return false;
        }

        LocalDateTime issuedAt = activeTokens.get(token);
        LocalDateTime expiresAt = issuedAt.plusHours(TOKEN_EXPIRY_HOURS);

        if (LocalDateTime.now().isAfter(expiresAt)) {
            activeTokens.remove(token);
            return false;
        }

        return true;
    }

    public void invalidateToken(String token) {
        activeTokens.remove(token);
    }

    private String generateToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }
}
