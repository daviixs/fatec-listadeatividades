package com.fatec.todolist.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "app.cache")
public class AppCacheProperties {

    private Duration salasTtl = Duration.ofMinutes(30);
    private Duration materiasTtl = Duration.ofMinutes(15);
    private Duration calendarioTtl = Duration.ofMinutes(5);

    public Duration getSalasTtl() {
        return salasTtl;
    }

    public void setSalasTtl(Duration salasTtl) {
        this.salasTtl = salasTtl;
    }

    public Duration getMateriasTtl() {
        return materiasTtl;
    }

    public void setMateriasTtl(Duration materiasTtl) {
        this.materiasTtl = materiasTtl;
    }

    public Duration getCalendarioTtl() {
        return calendarioTtl;
    }

    public void setCalendarioTtl(Duration calendarioTtl) {
        this.calendarioTtl = calendarioTtl;
    }
}
