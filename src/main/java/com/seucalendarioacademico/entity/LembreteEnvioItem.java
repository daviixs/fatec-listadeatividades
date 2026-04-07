package com.seucalendarioacademico.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "lembrete_envio_item")
public class LembreteEnvioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_lei_job"))
    private LembreteEnvioJob job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assinante_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_lei_assinante"))
    private LembreteAssinante assinante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LembreteItemStatus status = LembreteItemStatus.PENDING;

    @Column(nullable = false)
    private Integer tentativas = 0;

    @Column(name = "provedor_message_id")
    private String provedorMessageId;

    @Column(columnDefinition = "TEXT")
    private String erro;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    void onCreate() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }

    @PreUpdate
    void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}
