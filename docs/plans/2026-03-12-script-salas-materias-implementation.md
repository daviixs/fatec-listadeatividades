# Implementation Plan: criar_salas_com_materias.sh

**Date:** 2026-03-12
**Based on:** 2026-03-12-script-salas-materias-design.md

---

## 1. TASK LIST

### Phase 1: Preparation
- [ ] Create project directory structure for scripts
- [ ] Verify system dependencies (bash, curl, jq)
- [ ] Set up development environment with API running
- [ ] Create backup of existing database (if any)

### Phase 2: Script Development
- [ ] Create criar_salas_com_materias.sh file
- [ ] Define script constants (BASE_URL, SEGREDO_PADRAO, PROFESSOR_PADRAO)
- [ ] Create helper functions (log, criar_sala, criar_materia)
- [ ] Implement subject arrays for all 4 courses (6 semesters each)
- [ ] Implement main execution loop for creating rooms
- [ ] Implement subject creation logic
- [ ] Add error handling and logging

### Phase 3: Testing
- [ ] Test script execution with dry-run mode
- [ ] Verify API connectivity
- [ ] Run full script execution
- [ ] Validate database records
- [ ] Test error recovery

### Phase 4: Documentation
- [ ] Create README for script usage
- [ ] Document installation steps for jq
- [ ] Create troubleshooting guide

---

## 2. COMPLETE SUBJECT LISTS

### ADS - Análise e Desenvolvimento de Sistemas

**1º Semestre:**
- Algoritmos e Lógica de Programação
- Arquitetura de Computadores
- Engenharia de Software I
- Fundamentos de Redes de Computadores
- Matemática para Computação
- Introdução à Programação

**2º Semestre:**
- Banco de Dados Relacional
- Engenharia de Software II
- Estrutura de Dados
- Programação Orientada a Objetos
- Sistemas Operacionais
- Linguagem de Programação

**3º Semestre:**
- Desenvolvimento Web I
- Engenharia de Software III
- Gestão de Projetos de Software
- Programação Mobile I
- Testes de Software
- Banco de Dados Não Relacional

**4º Semestre:**
- Desenvolvimento Web II
- Programação para Serviços
- Segurança da Informação
- Tópicos Especiais em ADS
- Interface Humano-Computador
- Programação Avançada

**5º Semestre:**
- Arquitetura de Software
- Computação em Nuvem
- DevOps
- Empreendedorismo e Inovação
- Estágio Supervisionado I
- Legislação e Ética

**6º Semestre:**
- Empreendedorismo Digital
- Estágio Supervisionado II
- Gerenciamento de Serviços de TI
- Inteligência Artificial Aplicada
- Projeto Integrador
- Tópicos Avançados em ADS

### DSM - Desenvolvimento de Software Multiplataforma

**1º Semestre:**
- Algoritmos e Lógica de Programação
- Arquitetura de Computadores
- Fundamentos de Desenvolvimento de Software
- Matemática Aplicada à Computação
- Programação Básica
- Sistemas de Informação

**2º Semestre:**
- Banco de Dados I
- Design de Interface
- Desenvolvimento para Web I
- Estrutura de Dados
- Programação Orientada a Objetos
- Redes de Computadores

**3º Semestre:**
- Banco de Dados II
- Desenvolvimento para Web II
- Frameworks de Desenvolvimento Web
- Programação Mobile Android
- Sistemas Distribuídos
- Testes de Software

**4º Semestre:**
- Arquitetura de Software
- Desenvolvimento de APIs
- Programação Mobile iOS
- Segurança de Aplicações
- Serviços em Nuvem
- Qualidade de Software

**5º Semestre:**
- Computação Gráfica
- DevOps e CI/CD
- Internet das Coisas
- Programação para Games
- Tópicos Especiais em DSM
- Ética e Legislação em TI

**6º Semestre:**
- Big Data
- Machine Learning Aplicado
- Projeto de Software Completo
- Realidade Aumentada e Virtual
- Estágio Supervisionado
- Tópicos Avançados em DSM

### GRH - Gestão de Recursos Humanos

**1º Semestre:**
- Contabilidade Geral
- Economia
- Estatística Aplicada
- Fundamentos de Administração
- Introdução à Gestão de RH
- Matemática Financeira

**2º Semestre:**
- Comportamento Organizacional
- Direito do Trabalho I
- Gestão de Cargos e Salários
- Legislação Trabalhista
- Psicologia do Trabalho
- Recrutamento e Seleção

**3º Semestre:**
- Cargos e Salários II
- Direito do Trabalho II
- Gestão de Pessoas por Competências
- Higiene e Segurança do Trabalho
- Relações Humanas no Trabalho
- Treinamento e Desenvolvimento

**4º Semestre:**
- Administração de Benefícios
- Clima Organizacional
- Gestão de Desempenho
- Planejamento de RH
- Tópicos Especiais em GRH
- Ética e Responsabilidade Social

**5º Semestre:**
- Avaliação de Desempenho
- Consultoria em RH
- Gestão do Conhecimento
- Liderança e Equipes
- Programas de Qualidade de Vida
- Trabalho Interdisciplinar

**6º Semestre:**
- Estágio Supervisionado
- Gestão Estratégica de RH
- Planejamento Estratégico Organizacional
- Projetos em RH
- Tendências em RH
- Trabalho de Conclusão de Curso

### GPI - Gestão da Produção Industrial

**1º Semestre:**
- Cálculo I
- Desenho Técnico
- Física Geral
- Fundamentos de Administração
- Introdução à Engenharia de Produção
- Química Geral

**2º Semestre:**
- Cálculo II
- Economia Industrial
- Eletricidade Aplicada
- Estatística Aplicada
- Fenômenos de Transporte
- Gestão de Materiais

**3º Semestre:**
- Controle Estatístico de Processo
- Gestão da Qualidade
- Metrologia
- Processos de Fabricação I
- Programação Linear
- Resistência dos Materiais

**4º Semestre:**
- Ergonomia e Segurança
- Gestão de Manutenção
- Layout Industrial
- Processos de Fabricação II
- Pesquisa Operacional
- Sistemas de Produção

**5º Semestre:**
- Automação Industrial
- Engenharia de Métodos
- Logística e Cadeia de Suprimentos
- Planejamento e Controle da Produção
- Projetos Industriais
- Sistemas Integrados de Gestão

**6º Semestre:**
- Estágio Supervisionado
- Gestão de Projetos Industriais
- Planejamento Estratégico Industrial
- Simulação de Sistemas de Produção
- Tópicos Avançados em GPI
- Trabalho de Conclusão de Curso

---

## 3. STEP-BY-STEP IMPLEMENTATION GUIDE

### Step 1: Create Script File
```bash
cd /Users/davixavier/Desktop/todolist
mkdir -p scripts
touch scripts/criar_salas_com_materias.sh
chmod +x scripts/criar_salas_com_materias.sh
```

### Step 2: Install jq (if needed)
```bash
# macOS
brew install jq

# Verify installation
jq --version
```

### Step 3: Write Script Content
Copy the complete script code (provided in section 5)

### Step 4: Configure API URL
Ensure your API is running and update BASE_URL if needed

### Step 5: Test API Connectivity
```bash
curl http://localhost:8080/api/salas
```

### Step 6: Execute Script
```bash
./scripts/criar_salas_com_materias.sh
```

---

## 4. TESTING PROCEDURES

### Pre-Execution Tests

#### Test 1: Dependency Check
```bash
bash --version  # Should be 4.0+
curl --version
jq --version
```

#### Test 2: API Health Check
```bash
curl -X GET http://localhost:8080/api/salas
```

### Execution Tests

#### Test 3: Single Course Test
Modify loop to process only ADS course:
```bash
for curso in ADS; do  # Only ADS
```

#### Test 4: Full Execution
Run complete script and monitor output

### Post-Execution Validation

#### Test 5: Verify Database Records
```bash
# Count salas
curl http://localhost:8080/api/salas | jq 'length'
# Expected: 48

# Count materias
curl http://localhost:8080/api/materias | jq 'length'
# Expected: ~240

# Check specific room
curl http://localhost:8080/api/salas/1 | jq '.'
```

#### Test 6: Verify Subject Distribution
```bash
# Get all materias and verify per room
curl http://localhost:8080/api/materias | jq 'group_by(.salaId) | map({sala: .[0].salaId, count: length})'
```

#### Test 7: H2 Console Verification
Access H2 Console at http://localhost:8080/h2-console
- Query: `SELECT COUNT(*) FROM sala;`
- Query: `SELECT COUNT(*) FROM materia;`
- Query: `SELECT s.nome, COUNT(m.id) FROM sala s LEFT JOIN materia m ON s.id = m.sala_id GROUP BY s.id;`

---

## 5. COMPLETE BASH SCRIPT CODE

```bash
#!/bin/bash

# Script: criar_salas_com_materias.sh
# Description: Create 48 rooms and ~240 subjects for FATEC courses
# Date: 2026-03-12

# ============== CONSTANTS ==============
BASE_URL="http://localhost:8080/api"
SEGREDO_PADRAO="lider123"
PROFESSOR_PADRAO="Professor"

# Counters
TOTAL_SALAS=0
TOTAL_MATERIAS=0
TOTAL_ERROS=0

# ============== SUBJECT DATA ==============

# ADS - Análise e Desenvolvimento de Sistemas
declare -A MATERIAS_ADS=(
    [1]="Algoritmos e Lógica de Programação|Arquitetura de Computadores|Engenharia de Software I|Fundamentos de Redes de Computadores|Matemática para Computação|Introdução à Programação"
    [2]="Banco de Dados Relacional|Engenharia de Software II|Estrutura de Dados|Programação Orientada a Objetos|Sistemas Operacionais|Linguagem de Programação"
    [3]="Desenvolvimento Web I|Engenharia de Software III|Gestão de Projetos de Software|Programação Mobile I|Testes de Software|Banco de Dados Não Relacional"
    [4]="Desenvolvimento Web II|Programação para Serviços|Segurança da Informação|Tópicos Especiais em ADS|Interface Humano-Computador|Programação Avançada"
    [5]="Arquitetura de Software|Computação em Nuvem|DevOps|Empreendedorismo e Inovação|Estágio Supervisionado I|Legislação e Ética"
    [6]="Empreendedorismo Digital|Estágio Supervisionado II|Gerenciamento de Serviços de TI|Inteligência Artificial Aplicada|Projeto Integrador|Tópicos Avançados em ADS"
)

# DSM - Desenvolvimento de Software Multiplataforma
declare -A MATERIAS_DSM=(
    [1]="Algoritmos e Lógica de Programação|Arquitetura de Computadores|Fundamentos de Desenvolvimento de Software|Matemática Aplicada à Computação|Programação Básica|Sistemas de Informação"
    [2]="Banco de Dados I|Design de Interface|Desenvolvimento para Web I|Estrutura de Dados|Programação Orientada a Objetos|Redes de Computadores"
    [3]="Banco de Dados II|Desenvolvimento para Web II|Frameworks de Desenvolvimento Web|Programação Mobile Android|Sistemas Distribuídos|Testes de Software"
    [4]="Arquitetura de Software|Desenvolvimento de APIs|Programação Mobile iOS|Segurança de Aplicações|Serviços em Nuvem|Qualidade de Software"
    [5]="Computação Gráfica|DevOps e CI/CD|Internet das Coisas|Programação para Games|Tópicos Especiais em DSM|Ética e Legislação em TI"
    [6]="Big Data|Machine Learning Aplicado|Projeto de Software Completo|Realidade Aumentada e Virtual|Estágio Supervisionado|Tópicos Avançados em DSM"
)

# GRH - Gestão de Recursos Humanos
declare -A MATERIAS_GRH=(
    [1]="Contabilidade Geral|Economia|Estatística Aplicada|Fundamentos de Administração|Introdução à Gestão de RH|Matemática Financeira"
    [2]="Comportamento Organizacional|Direito do Trabalho I|Gestão de Cargos e Salários|Legislação Trabalhista|Psicologia do Trabalho|Recrutamento e Seleção"
    [3]="Cargos e Salários II|Direito do Trabalho II|Gestão de Pessoas por Competências|Higiene e Segurança do Trabalho|Relações Humanas no Trabalho|Treinamento e Desenvolvimento"
    [4]="Administração de Benefícios|Clima Organizacional|Gestão de Desempenho|Planejamento de RH|Tópicos Especiais em GRH|Ética e Responsabilidade Social"
    [5]="Avaliação de Desempenho|Consultoria em RH|Gestão do Conhecimento|Liderança e Equipes|Programas de Qualidade de Vida|Trabalho Interdisciplinar"
    [6]="Estágio Supervisionado|Gestão Estratégica de RH|Planejamento Estratégico Organizacional|Projetos em RH|Tendências em RH|Trabalho de Conclusão de Curso"
)

# GPI - Gestão da Produção Industrial
declare -A MATERIAS_GPI=(
    [1]="Cálculo I|Desenho Técnico|Física Geral|Fundamentos de Administração|Introdução à Engenharia de Produção|Química Geral"
    [2]="Cálculo II|Economia Industrial|Eletricidade Aplicada|Estatística Aplicada|Fenômenos de Transporte|Gestão de Materiais"
    [3]="Controle Estatístico de Processo|Gestão da Qualidade|Metrologia|Processos de Fabricação I|Programação Linear|Resistência dos Materiais"
    [4]="Ergonomia e Segurança|Gestão de Manutenção|Layout Industrial|Processos de Fabricação II|Pesquisa Operacional|Sistemas de Produção"
    [5]="Automação Industrial|Engenharia de Métodos|Logística e Cadeia de Suprimentos|Planejamento e Controle da Produção|Projetos Industriais|Sistemas Integrados de Gestão"
    [6]="Estágio Supervisionado|Gestão de Projetos Industriais|Planejamento Estratégico Industrial|Simulação de Sistemas de Produção|Tópicos Avançados em GPI|Trabalho de Conclusão de Curso"
)

# ============== ARRAYS TO STORE IDs ==============
declare -A SALA_IDS

# ============== HELPER FUNCTIONS ==============

log() {
    echo "$1"
}

criar_sala() {
    local nome="$1"
    local semestre="$2"
    
    local response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/salas" \
        -H "Content-Type: application/json" \
        -d "{
            \"nome\": \"${nome}\",
            \"semestre\": \"${semestre}\",
            \"segredoLider\": \"${SEGREDO_PADRAO}\"
        }")
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 201 ] || [ "$http_code" -eq 200 ]; then
        local sala_id=$(echo "$body" | jq -r '.id')
        SALA_IDS["$nome"]=$sala_id
        ((TOTAL_SALAS++))
        log "  ✓ Sala criada: ${nome} (ID: ${sala_id})"
        return 0
    else
        ((TOTAL_ERROS++))
        log "  ✗ Erro ao criar sala ${nome}: HTTP ${http_code}"
        log "     Response: ${body}"
        return 1
    fi
}

criar_materia() {
    local nome="$1"
    local sala_id="$2"
    
    local response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/materias" \
        -H "Content-Type: application/json" \
        -d "{
            \"nome\": \"${nome}\",
            \"professor\": \"${PROFESSOR_PADRAO}\",
            \"salaId\": ${sala_id}
        }")
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 201 ] || [ "$http_code" -eq 200 ]; then
        ((TOTAL_MATERIAS++))
        log "    ✓ Matéria criada: ${nome} (Sala: ${sala_id})"
        return 0
    else
        ((TOTAL_ERROS++))
        log "    ✗ Erro ao criar matéria ${nome}: HTTP ${http_code}"
        log "       Response: ${body}"
        return 1
    fi
}

obter_materias_curso() {
    local curso="$1"
    local semestre="$2"
    
    case "$curso" in
        "ADS")
            echo "${MATERIAS_ADS[$semestre]}"
            ;;
        "DSM")
            echo "${MATERIAS_DSM[$semestre]}"
            ;;
        "GRH")
            echo "${MATERIAS_GRH[$semestre]}"
            ;;
        "GPI")
            echo "${MATERIAS_GPI[$semestre]}"
            ;;
        *)
            echo ""
            ;;
    esac
}

# ============== MAIN EXECUTION ==============

log "Criando salas e matérias..."
log ""

for curso in ADS DSM GRH GPI; do
    log "Processando curso: ${curso}"
    
    for turno in Manhã Noite; do
        for semestre in 1° 2° 3° 4° 5° 6°; do
            local nome="${curso} ${semestre} ${turno}"
            
            criar_sala "$nome" "$semestre"
            
            local sala_id="${SALA_IDS[$nome]}"
            
            if [ -n "$sala_id" ]; then
                local materias=$(obter_materias_curso "$curso" "$semestre")
                
                IFS='|' read -ra MATERIA_ARRAY <<< "$materias"
                for materia in "${MATERIA_ARRAY[@]}"; do
                    criar_materia "$materia" "$sala_id"
                done
            fi
            
            log ""
        done
    done
    
    log ""
done

# ============== FINAL REPORT ==============
log ""
log "========================================="
log "           RELATÓRIO FINAL"
log "========================================="
log "Salas criadas: ${TOTAL_SALAS}"
log "Matérias criadas: ${TOTAL_MATERIAS}"
log "Erros: ${TOTAL_ERROS}"
log "========================================="

# Verify expected counts
if [ "$TOTAL_SALAS" -eq 48 ]; then
    log "✓ Todas as 48 salas foram criadas"
else
    log "✗ Esperado 48 salas, criadas ${TOTAL_SALAS}"
fi

if [ "$TOTAL_MATERIAS" -ge 240 ]; then
    log "✓ Matérias criadas: ${TOTAL_MATERIAS}"
else
    log "✗ Esperado ~240 matérias, criadas ${TOTAL_MATERIAS}"
fi

exit 0
```

---

## 6. TROUBLESHOOTING

### Common Issues

#### Issue: jq not found
**Solution:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

#### Issue: API connection refused
**Solution:**
1. Verify API is running: `curl http://localhost:8080/actuator/health`
2. Check BASE_URL in script
3. Ensure no firewall blocking port 8080

#### Issue: Duplicate rooms created
**Solution:**
The script doesn't check for existing rooms. To reset:
1. Access H2 Console
2. Execute: `DELETE FROM sala; DELETE FROM materia;`

#### Issue: Permission denied
**Solution:**
```bash
chmod +x scripts/criar_salas_com_materias.sh
```

---

## 7. SUMMARY STATISTICS

| Metric | Value |
|--------|-------|
| Total Courses | 4 |
| Total Semesters per Course | 6 |
| Total Shifts per Course | 2 |
| Total Rooms | 48 (4 × 6 × 2) |
| Subjects per Room | 6 |
| Total Subjects | 288 (48 × 6) |
| Unique Subject Names | ~140 (some overlap) |

---

## 8. IMPLEMENTATION CHECKLIST

- [ ] Create scripts directory
- [ ] Install jq dependency
- [ ] Create script file with execute permissions
- [ ] Configure BASE_URL
- [ ] Test API connectivity
- [ ] Execute script
- [ ] Verify 48 rooms created
- [ ] Verify 288 subjects created
- [ ] Test subject distribution
- [ ] Document in project README

---

**End of Implementation Plan**
