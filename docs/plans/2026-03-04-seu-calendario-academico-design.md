# Design: Seu Calendário Acadêmico - Sistema de Atividades Academicas

**Data:** 2026-03-04
**Status:** Aprovado

---

## 1. Visao Geral

Sistema web para a instituição onde alunos acessam atividades de cada materia, organizadas por sala e semestre. O sistema fornece links para entrega (plataformas externas como Teams) e regras de integridade academica (ex: "nao pode usar IA").

### Usuarios

- **Aluno**: acesso livre (sem login). Digita um codigo de convite para acessar uma sala e ver suas materias/atividades.
- **Lider da sala**: gerencia a sala (cria materias, atividades, gera codigos). Protegido por um endpoint com segredo (pergunta/resposta que so o lider sabe), validado via Spring Security.

### Caracteristicas principais

- Sem autenticacao para alunos (acesso anonimo via codigo de convite)
- Atividades com link externo para entrega ou indicacao de entrega manual
- Regras de integridade por atividade
- Prazo de entrega visivel

---

## 2. Stack Tecnologica

| Camada | Tecnologia |
|---|---|
| **Backend** | Spring Boot 3.4.x (Java 17 ou 21) |
| **Frontend** | React + Vite (projeto separado) |
| **Banco de dados** | PostgreSQL |
| **Build** | Maven |

---

## 3. Dependencias do Spring Boot Initializr

Configuracao no [start.spring.io](https://start.spring.io):

- **Project**: Maven
- **Language**: Java
- **Spring Boot**: 3.4.x (ultima estavel)
- **Group**: `com.seucalendarioacademico`
- **Artifact**: `seu-calendario-academico`
- **Packaging**: Jar
- **Java**: 17 ou 21

### Dependencias a selecionar no Initializr

| Dependencia | Para que serve |
|---|---|
| **Spring Web** | Criar endpoints REST (controllers, request mapping) |
| **Spring Data JPA** | ORM para acessar o PostgreSQL com JPA/Hibernate |
| **PostgreSQL Driver** | Driver JDBC para conectar ao PostgreSQL |
| **Spring Security** | Proteger endpoints do lider com filtro customizado |
| **Validation** | Validacao de dados com anotacoes (@NotNull, @Size, @Valid) |
| **Lombok** | Reduzir boilerplate (getters, setters, constructors) |
| **Spring Boot DevTools** | Hot reload durante desenvolvimento |

### Dependencia adicional (manual no pom.xml)

SpringDoc OpenAPI para documentacao Swagger automatica:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.4</version>
</dependency>
```

Apos adicionar, a documentacao interativa fica disponivel em: `http://localhost:8080/swagger-ui.html`

---

## 4. Modelo de Dados (Entidades)

### SALA

| Campo | Tipo | Descricao |
|---|---|---|
| id | Long (PK) | Identificador unico |
| nome | String | Ex: "ADS 3o Semestre - Manha" |
| semestre | String | Ex: "2026/1" |
| codigoConvite | String (unique) | Codigo que alunos usam para acessar |
| segredoLider | String | Resposta secreta que protege o endpoint do lider |
| criadoEm | LocalDateTime | Data de criacao |

### MATERIA

| Campo | Tipo | Descricao |
|---|---|---|
| id | Long (PK) | Identificador unico |
| nome | String | Ex: "Engenharia de Software" |
| professor | String | Nome do professor |
| sala_id | Long (FK -> SALA) | Sala a que pertence |

### ATIVIDADE

| Campo | Tipo | Descricao |
|---|---|---|
| id | Long (PK) | Identificador unico |
| titulo | String | Ex: "Trabalho Final - Diagrama UML" |
| descricao | String/Text | Detalhes da atividade |
| tipoEntrega | Enum | LINK_EXTERNO ou ENTREGA_MANUAL |
| linkEntrega | String (nullable) | URL para entrega (Teams, Forms, etc.) |
| regras | String/Text | Ex: "Nao pode usar IA. Entregar em PDF." |
| prazo | LocalDateTime | Data limite de entrega |
| materia_id | Long (FK -> MATERIA) | Materia a que pertence |
| criadoEm | LocalDateTime | Data de criacao |

### Relacionamentos

- Uma SALA tem muitas MATERIAS (1:N)
- Uma MATERIA tem muitas ATIVIDADES (1:N)

---

## 5. Endpoints da API

**Atualizacao:** 2026-03-10

### 5.1 Endpoints implementados no codigo (controllers atuais)

| Metodo | Rota | Origem |
|---|---|---|
| `GET` | `/api/salas` | `SalaDeAulaController` |
| `POST` | `/api/salas` | `SalaDeAulaController` |
| `POST` | `/api/salas/acessar` | `SalaDeAulaController` |
| `GET` | `/api/salas/{salaId}/materias` | `SalaDeAulaController` |
| `GET` | `/api/materias` | `MateriaController` |
| `GET` | `/api/materias/{id}` | `MateriaController` |
| `GET` | `/api/materias/sala/{salaId}` | `MateriaController` |
| `GET` | `/api/materias/{materiaId}/atividades` | `MateriaController` |
| `POST` | `/api/materias` | `MateriaController` |
| `PUT` | `/api/materias/{id}` | `MateriaController` |
| `DELETE` | `/api/materias/{id}` | `MateriaController` |
| `GET` | `/api/atividades` | `AtividadeController` |
| `GET` | `/api/atividades/{id}` | `AtividadeController` |
| `GET` | `/api/atividades/expirando?horas={24|48|72}` | `AtividadeController` |
| `POST` | `/api/atividades` | `AtividadeController` |
| `PUT` | `/api/atividades/{id}` | `AtividadeController` |
| `DELETE` | `/api/atividades/{id}` | `AtividadeController` |
| `POST` | `/api/salas/{salaId}/alunos` | `AlunoController` |
| `GET` | `/api/salas/{salaId}/alunos` | `AlunoController` |
| `POST` | `/api/salas/{salaId}/entradas` | `EntradaSalaController` |
| `GET` | `/api/salas/{salaId}/entradas` | `EntradaSalaController` |
| `PATCH` | `/api/salas/{salaId}/entradas/{id}/aprovar` | `EntradaSalaController` |
| `POST` | `/api/atividades/{atividadeId}/votacao` | `VotacaoController` |
| `GET` | `/api/atividades/{atividadeId}/votacao` | `VotacaoController` |
| `POST` | `/api/atividades/{atividadeId}/votacao/votos?alunoId={id}` | `VotacaoController` |
| `POST` | `/api/admin/salas` | `SalaAdminController` |
| `PUT` | `/api/admin/salas/{salaId}` | `SalaAdminController` |
| `DELETE` | `/api/admin/salas/{salaId}` | `SalaAdminController` |
| `POST` | `/api/admin/salas/{salaId}/materias` | `SalaAdminController` |
| `PUT` | `/api/admin/materias/{materiaId}` | `MateriaAdminController` |
| `DELETE` | `/api/admin/materias/{materiaId}` | `MateriaAdminController` |
| `POST` | `/api/admin/materias/{materiaId}/atividades` | `MateriaAdminController` |
| `PUT` | `/api/admin/atividades/{atividadeId}` | `AtividadeAdminController` |
| `DELETE` | `/api/admin/atividades/{atividadeId}` | `AtividadeAdminController` |

### 5.2 Endpoints planejados no design original: status atual

| Metodo | Rota do plano (2026-03-04) | Situacao atual |
|---|---|---|
| `POST` | `/api/salas/acessar` | ✅ Implementado |
| `GET` | `/api/salas` | ✅ Implementado |
| `GET` | `/api/salas/{salaId}/materias` | ✅ Implementado |
| `GET` | `/api/materias/{materiaId}/atividades` | ✅ Implementado |
| `GET` | `/api/atividades/{atividadeId}` | ✅ Implementado |
| `POST` | `/api/admin/salas` | ✅ Implementado |
| `PUT` | `/api/admin/salas/{salaId}` | ✅ Implementado |
| `DELETE` | `/api/admin/salas/{salaId}` | ✅ Implementado |
| `POST` | `/api/admin/salas/{salaId}/materias` | ✅ Implementado |
| `PUT` | `/api/admin/materias/{materiaId}` | ✅ Implementado |
| `DELETE` | `/api/admin/materias/{materiaId}` | ✅ Implementado |
| `POST` | `/api/admin/materias/{materiaId}/atividades` | ✅ Implementado |
| `PUT` | `/api/admin/atividades/{atividadeId}` | ✅ Implementado |
| `DELETE` | `/api/admin/atividades/{atividadeId}` | ✅ Implementado |

### 5.3 Observacao sobre seguranca (estado atual)

- As rotas `/api/admin/**` agora estao implementadas.
- Atualmente o `SecurityConfig` ainda usa `permitAll()` para `/api/admin/**`.
- Para aderir 100% ao desenho original, falta aplicar a validacao de segredo/autorizacao nessas rotas.

---

## 6. Estrutura de Pacotes

Organizado por dominio (feature-based), seguindo boas praticas Spring Boot:

```
src/main/java/com/seucalendarioacademico/
├── SeuCalendarioAcademicoApplication.java
├── config/
│   ├── SecurityConfig.java            # Config Spring Security (rotas publicas/protegidas)
│   ├── CorsConfig.java                # Config CORS para React
│   └── LiderSecretFilter.java         # Filtro que valida header X-Lider-Secret
├── sala/
│   ├── Sala.java                      # Entidade JPA
│   ├── SalaRepository.java            # Spring Data JPA repository
│   ├── SalaService.java               # Logica de negocio
│   ├── SalaController.java            # Endpoints publicos (aluno)
│   ├── SalaAdminController.java       # Endpoints protegidos (lider)
│   └── dto/
│       ├── SalaResponse.java          # DTO de resposta
│       ├── CriarSalaRequest.java      # DTO de criacao
│       └── AcessarSalaRequest.java    # DTO com codigoConvite
├── materia/
│   ├── Materia.java
│   ├── MateriaRepository.java
│   ├── MateriaService.java
│   ├── MateriaController.java
│   ├── MateriaAdminController.java
│   └── dto/
│       ├── MateriaResponse.java
│       └── CriarMateriaRequest.java
├── atividade/
│   ├── Atividade.java
│   ├── TipoEntrega.java               # Enum: LINK_EXTERNO, ENTREGA_MANUAL
│   ├── AtividadeRepository.java
│   ├── AtividadeService.java
│   ├── AtividadeController.java
│   ├── AtividadeAdminController.java
│   └── dto/
│       ├── AtividadeResponse.java
│       └── CriarAtividadeRequest.java
└── exception/
    ├── GlobalExceptionHandler.java     # @ControllerAdvice para erros consistentes
    ├── RecursoNaoEncontradoException.java
    └── AcessoNegadoException.java

src/main/resources/
├── application.yml                    # Config padrao
├── application-dev.yml                # Config desenvolvimento (PostgreSQL local)
└── application-prod.yml               # Config producao
```

---

## 7. Fluxo Principal

1. **Lider cria sala**: `POST /api/admin/salas` com header `X-Lider-Secret`. Retorna sala com `codigoConvite` gerado automaticamente.
2. **Lider adiciona materias**: `POST /api/admin/salas/{id}/materias` com nome e professor.
3. **Lider adiciona atividades**: `POST /api/admin/materias/{id}/atividades` com titulo, descricao, tipo de entrega, link, regras, prazo.
4. **Lider compartilha codigo**: envia o `codigoConvite` para os alunos (WhatsApp, email, etc.).
5. **Aluno acessa sala**: `POST /api/salas/acessar` com o codigo de convite. Recebe os dados da sala.
6. **Aluno navega**: ve materias -> ve atividades -> clica no link de entrega ou le as instrucoes de entrega manual.

---

## 8. Tratamento de Erros

O `GlobalExceptionHandler` (@ControllerAdvice) retorna respostas padronizadas:

```json
{
    "status": 404,
    "erro": "Sala nao encontrada",
    "timestamp": "2026-03-04T10:30:00"
}
```

Erros tratados:
- `404` - Recurso nao encontrado (sala, materia, atividade)
- `400` - Dados invalidos (validacao do @Valid)
- `403` - Segredo do lider incorreto
- `500` - Erro interno

---

## 9. Configuracao do application.yml (exemplo)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/seu_calendario_academico
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8080

# Segredo global para criar a primeira sala (depois cada sala tem seu proprio segredo)
app:
  lider:
    segredo-global: ${LIDER_SECRET:minha-resposta-secreta}
```

---

## 10. Decisoes de Design

| Decisao | Justificativa |
|---|---|
| Sem autenticacao de aluno | Requisito do projeto: acesso livre via codigo de convite |
| Spring Security minimal | Protege apenas endpoints `/api/admin/**` com filtro customizado |
| Organizacao por dominio | Melhor coesao e mais facil de navegar que organizacao por camada |
| DTOs separados de entidades | Nao expor entidades JPA diretamente na API (seguranca e flexibilidade) |
| PostgreSQL | Escolha do usuario; banco robusto e amplamente usado |
| SpringDoc OpenAPI | Documentacao automatica da API; util para desenvolvimento e apresentacao |
