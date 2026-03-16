# Design: Lembretes por Email com Resend (12h)

**Data:** 2026-03-15  
**Status:** Aprovado

## Contexto

Objetivo: enviar um unico email consolidado para cada pessoa inscrita, com todas as atividades pendentes das salas/semestres selecionados.

Decisoes validadas:
1. Sem implementacao de frontend por enquanto.
2. Envio consolidado (um email por pessoa por janela).
3. Regra de pendencia: atividade `ATIVA` com `prazo >= hoje`.
4. Se nao houver pendencias: nao enviar.
5. Janela global fixa a cada 12h: `09:00` e `21:00` (`America/Sao_Paulo`).

## Abordagens avaliadas

### Opcao 1: `@Scheduled` + envio direto
- Pro: mais simples e rapido.
- Contra: pouca resiliencia e rastreabilidade.

### Opcao 2: `@Scheduled` + outbox no banco (recomendada)
- Pro: robusta, com idempotencia, retry e auditoria.
- Contra: mais tabelas e servicos.

### Opcao 3: scheduler externo chamando endpoint interno
- Pro: agenda desacoplada da aplicacao.
- Contra: mais infra e mais pontos de falha.

**Recomendacao final:** Opcao 2.

## Arquitetura recomendada

1. Scheduler Spring dispara em `09:00` e `21:00`.
2. Cada disparo cria/assume um `job` por janela (`slot`).
3. Para cada assinante ativo:
   - carrega salas selecionadas;
   - busca pendencias (`ATIVA` + `prazo >= hoje`);
   - envia 1 email consolidado via Resend;
   - grava status por destinatario.
4. Persistencia de job e item garante:
   - idempotencia;
   - retries;
   - auditoria operacional.

## Modelo de dados

### Novas tabelas

1. `lembrete_assinante`
- Um registro por email.
- Campos: email, ativo, data_cadastro, ultimo_envio.

2. `lembrete_assinante_sala`
- Preferencias de salas por assinante.
- Unico por par `(assinante, sala)`.

3. `lembrete_envio_job`
- Controle do lote da janela.
- Unico por `slot_inicio`.

4. `lembrete_envio_item`
- Resultado por assinante no lote.
- Unico por `(job, assinante)`.

### Status

`JobStatus`: `PENDING`, `RUNNING`, `DONE`, `PARTIAL`, `FAILED`  
`ItemStatus`: `PENDING`, `SENT`, `FAILED`, `SKIPPED_NO_PENDING`

## API backend (sem frontend)

1. `POST /api/lembretes/assinantes`
- Cria/atualiza email e preferencias de salas.

2. `GET /api/lembretes/assinantes/{email}`
- Retorna preferencias atuais.

3. `DELETE /api/lembretes/assinantes/{email}`
- Desativa assinatura.

4. `POST /api/admin/lembretes/disparar-agora` (operacional)
- Dispara lote manualmente para suporte.

## Fluxo detalhado

1. Scheduler abre janela (`slot_inicio` / `slot_fim`).
2. Cria job se nao existir.
3. Busca assinantes ativos.
4. Para cada assinante:
   - garante item unico do job;
   - busca salas ativas do assinante;
   - busca atividades pendentes nessas salas;
   - sem pendencia -> `SKIPPED_NO_PENDING`;
   - com pendencia -> monta HTML, envia, marca `SENT`.
5. Falhas ficam em `FAILED` com erro e tentativas.
6. Job finaliza como:
   - `DONE` se nenhum item falhar;
   - `PARTIAL` se houver mistura de `SENT/SKIPPED` e `FAILED`;
   - `FAILED` se o lote quebrar antes de processar.

## Erros, seguranca e observabilidade

1. Timeout no cliente Resend e retry por item (max tentativas configuravel).
2. Chave Resend somente em env var (`resend.api-key`).
3. Logs estruturados com `jobId`, `itemId`, `subscriberId`, `slot`.
4. Metricas minimas:
   - `jobs_total`,
   - `items_sent_total`,
   - `items_failed_total`,
   - `items_skipped_total`.
5. Endpoint admin deve ser protegido (hoje `SecurityConfig` esta permissivo para `/api/admin/**`).

## Testes e aceite

### Unitarios
1. Filtro de pendencia por regra.
2. Montagem de email consolidado.
3. Resolucao de status de job.

### Integracao
1. Nao duplica job no mesmo slot.
2. Nao duplica item por assinante no job.
3. Atualiza `ultimo_envio` quando `SENT`.

### Criterios de aceite
1. Envia 1 email por assinante por janela.
2. Nao envia quando nao houver pendencias.
3. Mantem rastreabilidade completa por job/item.

---

## Blueprint de codigo completo (nao aplicado no projeto)

> Os blocos abaixo sao o codigo completo proposto para implementacao backend.  
> Nao foi aplicado em `src/` nesta etapa.

### 1) Migration SQL

Arquivo proposto: `src/main/resources/db/migration/V3__create_lembrete_dispatch_tables.sql`

```sql
CREATE TABLE lembrete_assinante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_envio TIMESTAMP NULL
);

CREATE TABLE lembrete_assinante_sala (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assinante_id BIGINT NOT NULL,
    sala_id INTEGER NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_las_assinante FOREIGN KEY (assinante_id) REFERENCES lembrete_assinante(id) ON DELETE CASCADE,
    CONSTRAINT fk_las_sala FOREIGN KEY (sala_id) REFERENCES sala_de_aula(id) ON DELETE CASCADE,
    CONSTRAINT uk_las_assinante_sala UNIQUE (assinante_id, sala_id)
);

CREATE TABLE lembrete_envio_job (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_inicio TIMESTAMP NOT NULL,
    slot_fim TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP NULL,
    erro TEXT NULL,
    CONSTRAINT uk_lej_slot UNIQUE (slot_inicio)
);

CREATE TABLE lembrete_envio_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    assinante_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    tentativas INT NOT NULL DEFAULT 0,
    provedor_message_id VARCHAR(255) NULL,
    erro TEXT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL,
    CONSTRAINT fk_lei_job FOREIGN KEY (job_id) REFERENCES lembrete_envio_job(id) ON DELETE CASCADE,
    CONSTRAINT fk_lei_assinante FOREIGN KEY (assinante_id) REFERENCES lembrete_assinante(id) ON DELETE CASCADE,
    CONSTRAINT uk_lei_job_assinante UNIQUE (job_id, assinante_id)
);
```

### 2) Enums de status

Arquivo proposto: `src/main/java/com/fatec/todolist/entity/LembreteJobStatus.java`

```java
package com.fatec.todolist.entity;

public enum LembreteJobStatus {
    PENDING,
    RUNNING,
    DONE,
    PARTIAL,
    FAILED
}
```

Arquivo proposto: `src/main/java/com/fatec/todolist/entity/LembreteItemStatus.java`

```java
package com.fatec.todolist.entity;

public enum LembreteItemStatus {
    PENDING,
    SENT,
    FAILED,
    SKIPPED_NO_PENDING
}
```

### 3) Entidades de assinatura

Arquivo proposto: `src/main/java/com/fatec/todolist/entity/LembreteAssinante.java`

```java
package com.fatec.todolist.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "lembrete_assinante")
public class LembreteAssinante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "data_cadastro", nullable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "ultimo_envio")
    private LocalDateTime ultimoEnvio;

    @PrePersist
    void onCreate() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
    }
}
```

Arquivo proposto: `src/main/java/com/fatec/todolist/entity/LembreteAssinanteSala.java`

```java
package com.fatec.todolist.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "lembrete_assinante_sala")
public class LembreteAssinanteSala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assinante_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_las_assinante"))
    private LembreteAssinante assinante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sala_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_las_sala"))
    private SalaDeAula sala;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "data_cadastro", nullable = false)
    private LocalDateTime dataCadastro;

    @PrePersist
    void onCreate() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
    }
}
```

### 4) Entidades de dispatch

Arquivo proposto: `src/main/java/com/fatec/todolist/entity/LembreteEnvioJob.java`

```java
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
```

Arquivo proposto: `src/main/java/com/fatec/todolist/entity/LembreteEnvioItem.java`

```java
package com.fatec.todolist.entity;

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
```

### 5) Repositories

Arquivo proposto: `src/main/java/com/fatec/todolist/repository/LembreteAssinanteRepository.java`

```java
package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteAssinante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LembreteAssinanteRepository extends JpaRepository<LembreteAssinante, Long> {
    Optional<LembreteAssinante> findByEmail(String email);
    List<LembreteAssinante> findByAtivoTrue();
}
```

Arquivo proposto: `src/main/java/com/fatec/todolist/repository/LembreteAssinanteSalaRepository.java`

```java
package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteAssinanteSala;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LembreteAssinanteSalaRepository extends JpaRepository<LembreteAssinanteSala, Long> {
    List<LembreteAssinanteSala> findByAssinanteIdAndAtivoTrue(Long assinanteId);
    void deleteByAssinanteId(Long assinanteId);
}
```

Arquivo proposto: `src/main/java/com/fatec/todolist/repository/LembreteEnvioJobRepository.java`

```java
package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteEnvioJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface LembreteEnvioJobRepository extends JpaRepository<LembreteEnvioJob, Long> {
    Optional<LembreteEnvioJob> findBySlotInicio(LocalDateTime slotInicio);
}
```

Arquivo proposto: `src/main/java/com/fatec/todolist/repository/LembreteEnvioItemRepository.java`

```java
package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteEnvioItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LembreteEnvioItemRepository extends JpaRepository<LembreteEnvioItem, Long> {
    Optional<LembreteEnvioItem> findByJobIdAndAssinanteId(Long jobId, Long assinanteId);
}
```

### 6) Atualizacao do repository de atividades

Arquivo proposto: `src/main/java/com/fatec/todolist/repository/AtividadeRepository.java` (adicionar metodo)

```java
package com.fatec.todolist.repository;

import com.fatec.todolist.entity.Atividade;
import com.fatec.todolist.entity.StatusAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    List<Atividade> findByPrazoBetween(LocalDate inicio, LocalDate fim);
    List<Atividade> findByMateriaId(Long materiaId);

    @Query("""
        select a
        from Atividade a
        join fetch a.materia m
        join fetch m.sala s
        where s.id in :salaIds
          and a.status = :status
          and a.prazo >= :hoje
        order by a.prazo asc
    """)
    List<Atividade> findPendentesBySalaIds(
            @Param("salaIds") List<Integer> salaIds,
            @Param("status") StatusAtividade status,
            @Param("hoje") LocalDate hoje
    );
}
```

### 7) DTOs de entrada/saida

Arquivo proposto: `src/main/java/com/fatec/todolist/dto/LembretePreferenciasRequest.java`

```java
package com.fatec.todolist.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record LembretePreferenciasRequest(
        @NotBlank(message = "Email obrigatorio")
        @Email(message = "Email invalido")
        String email,
        @NotEmpty(message = "Informe ao menos uma sala")
        List<Integer> salaIds
) {
}
```

Arquivo proposto: `src/main/java/com/fatec/todolist/dto/LembretePreferenciasResponse.java`

```java
package com.fatec.todolist.dto;

import java.time.LocalDateTime;
import java.util.List;

public record LembretePreferenciasResponse(
        Long assinanteId,
        String email,
        Boolean ativo,
        List<Integer> salaIds,
        LocalDateTime ultimoEnvio
) {
}
```

### 8) Cliente Resend

Arquivo proposto: `src/main/java/com/fatec/todolist/service/ResendClient.java`

```java
package com.fatec.todolist.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class ResendClient {

    private final RestClient restClient;

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from}")
    private String from;

    public ResendClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://api.resend.com").build();
    }

    public String enviar(String para, String assunto, String html) {
        ResendSendRequest body = new ResendSendRequest(from, List.of(para), assunto, html);

        ResendSendResponse response = restClient.post()
                .uri("/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(ResendSendResponse.class);

        if (response == null || response.id() == null) {
            throw new IllegalStateException("Resend sem id de mensagem");
        }
        return response.id();
    }

    private record ResendSendRequest(
            String from,
            List<String> to,
            String subject,
            String html
    ) {}

    private record ResendSendResponse(String id) {}
}
```

### 9) Servico de preferencias

Arquivo proposto: `src/main/java/com/fatec/todolist/service/LembretePreferenciaService.java`

```java
package com.fatec.todolist.service;

import com.fatec.todolist.dto.LembretePreferenciasRequest;
import com.fatec.todolist.dto.LembretePreferenciasResponse;
import com.fatec.todolist.entity.LembreteAssinante;
import com.fatec.todolist.entity.LembreteAssinanteSala;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.LembreteAssinanteRepository;
import com.fatec.todolist.repository.LembreteAssinanteSalaRepository;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LembretePreferenciaService {

    private final LembreteAssinanteRepository assinanteRepository;
    private final LembreteAssinanteSalaRepository assinanteSalaRepository;
    private final SalaDeAulaRepository salaRepository;

    public LembretePreferenciaService(
            LembreteAssinanteRepository assinanteRepository,
            LembreteAssinanteSalaRepository assinanteSalaRepository,
            SalaDeAulaRepository salaRepository
    ) {
        this.assinanteRepository = assinanteRepository;
        this.assinanteSalaRepository = assinanteSalaRepository;
        this.salaRepository = salaRepository;
    }

    @Transactional
    public LembretePreferenciasResponse salvar(LembretePreferenciasRequest request) {
        LembreteAssinante assinante = assinanteRepository.findByEmail(request.email())
                .orElseGet(() -> {
                    LembreteAssinante novo = new LembreteAssinante();
                    novo.setEmail(request.email());
                    novo.setAtivo(true);
                    return assinanteRepository.save(novo);
                });

        List<SalaDeAula> salas = salaRepository.findAllById(request.salaIds());
        if (salas.size() != request.salaIds().size()) {
            throw new RecursoNaoEncontradoException("Uma ou mais salas nao existem");
        }

        assinante.setAtivo(true);
        assinanteRepository.save(assinante);

        assinanteSalaRepository.deleteByAssinanteId(assinante.getId());
        for (SalaDeAula sala : salas) {
            LembreteAssinanteSala pref = new LembreteAssinanteSala();
            pref.setAssinante(assinante);
            pref.setSala(sala);
            pref.setAtivo(true);
            assinanteSalaRepository.save(pref);
        }

        return buscarPorEmail(assinante.getEmail());
    }

    public LembretePreferenciasResponse buscarPorEmail(String email) {
        LembreteAssinante assinante = assinanteRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Assinante nao encontrado"));

        Set<Integer> salaIds = assinanteSalaRepository.findByAssinanteIdAndAtivoTrue(assinante.getId())
                .stream()
                .map(p -> p.getSala().getId())
                .collect(Collectors.toSet());

        return new LembretePreferenciasResponse(
                assinante.getId(),
                assinante.getEmail(),
                assinante.getAtivo(),
                salaIds.stream().sorted().toList(),
                assinante.getUltimoEnvio()
        );
    }

    @Transactional
    public void desativar(String email) {
        LembreteAssinante assinante = assinanteRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Assinante nao encontrado"));
        assinante.setAtivo(false);
        assinanteRepository.save(assinante);
    }
}
```

### 10) Servico de dispatch (core)

Arquivo proposto: `src/main/java/com/fatec/todolist/service/LembreteDispatchService.java`

```java
package com.fatec.todolist.service;

import com.fatec.todolist.entity.*;
import com.fatec.todolist.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LembreteDispatchService {

    private final LembreteAssinanteRepository assinanteRepository;
    private final LembreteAssinanteSalaRepository assinanteSalaRepository;
    private final LembreteEnvioJobRepository jobRepository;
    private final LembreteEnvioItemRepository itemRepository;
    private final AtividadeRepository atividadeRepository;
    private final ResendClient resendClient;

    public LembreteDispatchService(
            LembreteAssinanteRepository assinanteRepository,
            LembreteAssinanteSalaRepository assinanteSalaRepository,
            LembreteEnvioJobRepository jobRepository,
            LembreteEnvioItemRepository itemRepository,
            AtividadeRepository atividadeRepository,
            ResendClient resendClient
    ) {
        this.assinanteRepository = assinanteRepository;
        this.assinanteSalaRepository = assinanteSalaRepository;
        this.jobRepository = jobRepository;
        this.itemRepository = itemRepository;
        this.atividadeRepository = atividadeRepository;
        this.resendClient = resendClient;
    }

    @Transactional
    public void processarJanelaAtual() {
        LocalDateTime agora = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));
        LocalDateTime slotInicio = agora.withMinute(0).withSecond(0).withNano(0);
        LocalDateTime slotFim = slotInicio.plusHours(12);

        LembreteEnvioJob job = jobRepository.findBySlotInicio(slotInicio)
                .orElseGet(() -> {
                    LembreteEnvioJob novo = new LembreteEnvioJob();
                    novo.setSlotInicio(slotInicio);
                    novo.setSlotFim(slotFim);
                    novo.setStatus(LembreteJobStatus.PENDING);
                    return jobRepository.save(novo);
                });

        if (job.getStatus() == LembreteJobStatus.DONE || job.getStatus() == LembreteJobStatus.RUNNING) {
            return;
        }

        job.setStatus(LembreteJobStatus.RUNNING);
        jobRepository.save(job);

        boolean houveFalha = false;

        for (LembreteAssinante assinante : assinanteRepository.findByAtivoTrue()) {
            try {
                processarAssinante(job, assinante);
            } catch (Exception e) {
                houveFalha = true;
            }
        }

        job.setStatus(houveFalha ? LembreteJobStatus.PARTIAL : LembreteJobStatus.DONE);
        job.setDataFim(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
        jobRepository.save(job);
    }

    private void processarAssinante(LembreteEnvioJob job, LembreteAssinante assinante) {
        LembreteEnvioItem item = itemRepository.findByJobIdAndAssinanteId(job.getId(), assinante.getId())
                .orElseGet(() -> {
                    LembreteEnvioItem novo = new LembreteEnvioItem();
                    novo.setJob(job);
                    novo.setAssinante(assinante);
                    novo.setStatus(LembreteItemStatus.PENDING);
                    return itemRepository.save(novo);
                });

        if (item.getStatus() == LembreteItemStatus.SENT || item.getStatus() == LembreteItemStatus.SKIPPED_NO_PENDING) {
            return;
        }

        List<Integer> salaIds = assinanteSalaRepository.findByAssinanteIdAndAtivoTrue(assinante.getId())
                .stream()
                .map(pref -> pref.getSala().getId())
                .toList();

        if (salaIds.isEmpty()) {
            item.setStatus(LembreteItemStatus.SKIPPED_NO_PENDING);
            itemRepository.save(item);
            return;
        }

        List<Atividade> pendentes = atividadeRepository.findPendentesBySalaIds(
                salaIds,
                StatusAtividade.ATIVA,
                LocalDate.now(ZoneId.of("America/Sao_Paulo"))
        );

        if (pendentes.isEmpty()) {
            item.setStatus(LembreteItemStatus.SKIPPED_NO_PENDING);
            itemRepository.save(item);
            return;
        }

        String html = montarHtmlConsolidado(pendentes);
        String subject = "Resumo de atividades pendentes";
        String messageId = resendClient.enviar(assinante.getEmail(), subject, html);

        item.setStatus(LembreteItemStatus.SENT);
        item.setProvedorMessageId(messageId);
        item.setErro(null);
        itemRepository.save(item);

        assinante.setUltimoEnvio(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
        assinanteRepository.save(assinante);
    }

    private String montarHtmlConsolidado(List<Atividade> pendentes) {
        Map<String, List<Atividade>> porSala = pendentes.stream()
                .collect(Collectors.groupingBy(a -> a.getMateria().getSala().getNome()));

        StringBuilder sb = new StringBuilder();
        sb.append("<h2>Atividades pendentes</h2>");
        sb.append("<p>Resumo consolidado das suas salas selecionadas.</p>");

        for (Map.Entry<String, List<Atividade>> entry : porSala.entrySet()) {
            sb.append("<h3>").append(entry.getKey()).append("</h3><ul>");
            for (Atividade a : entry.getValue()) {
                sb.append("<li>")
                        .append(a.getMateria().getNome())
                        .append(" - ")
                        .append(a.getTitulo())
                        .append(" (prazo: ")
                        .append(a.getPrazo())
                        .append(")")
                        .append("</li>");
            }
            sb.append("</ul>");
        }

        return sb.toString();
    }
}
```

### 11) Scheduler

Arquivo proposto: `src/main/java/com/fatec/todolist/config/SchedulingConfig.java`

```java
package com.fatec.todolist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulingConfig {
}
```

Arquivo proposto: `src/main/java/com/fatec/todolist/service/LembreteSchedulerService.java`

```java
package com.fatec.todolist.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class LembreteSchedulerService {

    private final LembreteDispatchService dispatchService;

    public LembreteSchedulerService(LembreteDispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @Scheduled(cron = "${app.lembrete.cron}", zone = "${app.lembrete.zone}")
    public void executarJanela() {
        dispatchService.processarJanelaAtual();
    }
}
```

### 12) Controller de preferencia e operacao

Arquivo proposto: `src/main/java/com/fatec/todolist/controller/LembretePreferenciaController.java`

```java
package com.fatec.todolist.controller;

import com.fatec.todolist.dto.LembretePreferenciasRequest;
import com.fatec.todolist.dto.LembretePreferenciasResponse;
import com.fatec.todolist.service.LembreteDispatchService;
import com.fatec.todolist.service.LembretePreferenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lembretes")
public class LembretePreferenciaController {

    private final LembretePreferenciaService preferenciaService;
    private final LembreteDispatchService dispatchService;

    public LembretePreferenciaController(
            LembretePreferenciaService preferenciaService,
            LembreteDispatchService dispatchService
    ) {
        this.preferenciaService = preferenciaService;
        this.dispatchService = dispatchService;
    }

    @PostMapping("/assinantes")
    public ResponseEntity<LembretePreferenciasResponse> salvar(@Valid @RequestBody LembretePreferenciasRequest request) {
        LembretePreferenciasResponse response = preferenciaService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/assinantes/{email}")
    public ResponseEntity<LembretePreferenciasResponse> buscar(@PathVariable String email) {
        return ResponseEntity.ok(preferenciaService.buscarPorEmail(email));
    }

    @DeleteMapping("/assinantes/{email}")
    public ResponseEntity<Void> desativar(@PathVariable String email) {
        preferenciaService.desativar(email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/disparar-agora")
    public ResponseEntity<Void> dispararAgora() {
        dispatchService.processarJanelaAtual();
        return ResponseEntity.accepted().build();
    }
}
```

### 13) Propriedades de configuracao

Arquivo proposto: `src/main/resources/application.properties` (adicoes)

```properties
# Scheduler 12h fixo: 09:00 e 21:00
app.lembrete.cron=0 0 9,21 * * *
app.lembrete.zone=America/Sao_Paulo

# Resend
resend.api-key=${RESEND_API_KEY:}
resend.from=${RESEND_FROM:no-reply@seudominio.com}
```

### 14) Ajuste de seguranca recomendado

Arquivo proposto: `src/main/java/com/fatec/todolist/config/SecurityConfig.java` (trecho)

```java
.requestMatchers("/api/admin/lembretes/**").authenticated()
```

Se ainda nao houver auth pronta, usar header secreto temporario (`X-Admin-Secret`) em filtro dedicado.

---

## Plano de implementacao resumido

1. Criar migration `V3` com tabelas e constraints.
2. Subir entidades/enums/repositories.
3. Expor endpoints de preferencia sem frontend.
4. Implementar cliente Resend e dispatcher.
5. Ativar scheduler (`09:00` e `21:00`).
6. Adicionar logs + testes unitarios/integracao.
7. Endurecer seguranca de endpoint admin.

## Nota sobre skills

O proximo passo ideal seria invocar a skill `writing-plans` para quebrar em tarefas de execucao.  
Essa skill nao esta disponivel na lista atual do ambiente, entao este documento ja inclui o plano de implementacao como fallback.

