package com.fatec.todolist.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "lembrete_envio_job")
public class LembreteEnvioJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_inicio", nullable = false, unique = true)
    private LocalDateTime slotInicio;

    @Column(name = "slot_fim", nullable = false)
    private LocalDateTime slotFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LembreteJobStatus status = LembreteJobStatus.PENDING;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;

    @Column(columnDefinition = "TEXT")
    private String erro;

    @PrePersist
    void onCreate() {
        if (dataInicio == null) {
            dataInicio = LocalDateTime.now();
        }
    }
}
