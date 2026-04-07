package com.seucalendarioacademico.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class LembreteSchedulerService {

    private final LembreteDispatchService dispatchService;
    private final String zone;

    public LembreteSchedulerService(LembreteDispatchService dispatchService,
                                   @Value("${app.lembrete.zone}") String zone) {
        this.dispatchService = dispatchService;
        this.zone = zone;
    }

    @Scheduled(cron = "${app.lembrete.cron}", zone = "${app.lembrete.zone}")
    public void executarJanela() {
        dispatchService.processarJanelaAtual();
    }
}
