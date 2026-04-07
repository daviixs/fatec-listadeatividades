package com.seucalendarioacademico.service;

import com.seucalendarioacademico.config.CacheNames;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class CacheInvalidationService {

    private final CacheManager cacheManager;

    public CacheInvalidationService(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public void evictSalas() {
        clearCache(CacheNames.SALAS);
    }

    public void evictSalaRelacionada(Integer salaId) {
        if (salaId == null) {
            return;
        }

        evict(CacheNames.MATERIAS_POR_SALA, salaId);
        evict(CacheNames.CALENDARIO_SALA, salaId);
    }

    public void evictSalasESalasRelacionadas(Integer... salaIds) {
        evictSalas();
        Arrays.stream(salaIds)
                .distinct()
                .forEach(this::evictSalaRelacionada);
    }

    private void clearCache(String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
    }

    private void evict(String cacheName, Object key) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }
}
