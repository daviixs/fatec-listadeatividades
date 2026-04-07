#!/bin/bash

BASE_URL="http://localhost:8080/api"
SEGREDO_PADRAO="seu-calendario-2026"
PROFESSOR_PADRAO="Professor"

# Arrays de matérias por curso e semestre
declare -A MATERIAS_ADS=(
    [1]="Inglês I|Algoritmos e Lógica de Programação|Engenharia de Software I|Comunicação e Expressão|Arquitetura e Organização de Computadores|Projeto Integrador I|Sistemas Operacionais"
    [2]="Interação Humano Computador|Linguagem de Programação|Gestão Financeira Empresarial com Tecnologia|Cálculo|Engenharia de Software II|Banco de Dados Relacional|Comunicação e Expressão II|Inglês II"
    [3]="Programação Orientada a Objetos|Gestão de Negócios|Estrutura de Dados|Gestão de Projetos Ágeis|Laboratório de Banco de Dados|Experiência do Usuário|Inglês III"
    [4]="Inglês IV|Programação Orientada a Objetos|Engenharia de Software III|Sistemas Operacionais II|Banco de Dados|Metodologia de Pesquisa Científica e Tecnológica|Programação Web"
    [5]="Redes de Computadores I|Programação Linear|Inglês V|Laboratório de Engenharia de Software|Segurança da Informação|Programação Script|Laboratório de Banco de Dados"
    [6]="Inteligência Artificial|Tópicos Especiais|Gestão de Equipes|Gestão de Projetos|Gestão e Governança de TI|Empreendedorismo|Ética|Inglês VI"
)

declare -A MATERIAS_DSM=(
    [1]="Desenvolvimento Web I|Engenharia de Software I|Algoritmos e Lógica de Programação|Design Digital|Sistemas Operacionais e Redes de Computadores|Modelagem de Banco de Dados"
    [2]="Engenharia de Software II|Estrutura de Dados|Desenvolvimento Web II|Técnicas de Programação I|Matemática para Computação|Banco de Dados Relacional"
    [3]="Banco de Dados Não Relacional|Inglês I|Gestão Ágil de Projetos de Software|Interação Humano-Computador|Álgebra Linear|Técnicas de Programação II|Desenvolvimento Web III"
    [4]="Programação para Dispositivos Móveis I|Experiência do Usuário|Estatística Aplicada|Integração e Entrega|Internet das Coisas|Laboratório de Desenvolvimento Web|Inglês II"
    [5]="Redação|Computação em Nuvem I|Programação para Dispositivos Móveis II|Aprendizagem de Máquinas|Laboratório de Dispositivos Móveis|Segurança no Desenvolvimento de Aplicações|Inglês III"
    [6]="Qualidade e Testes de Software|Mineração de Dados|Processamento de Linguagem Natural|Computação em Nuvem II|Ética Profissional e Patente|Laboratório de Desenvolvimento Multiplataforma|Inglês IV"
)

declare -A MATERIAS_GRH=(
    [1]="Inglês I|Matemática Elementar|Comportamento Organizacional|Projeto Integrador I|Administração Geral|Gestão das Relações Interpessoais|Leitura e Produção de Texto"
    [2]="Comunicação Empresarial|Gestão de Pessoas na Administração Pública|Projeto Integrador II|Espanhol I|Métodos para Produção do Conhecimento|Captação e Seleção de Talentos|Estatística|Inglês II"
    [3]="Fundamentos de Economia|Educação Corporativa|Legislação Trabalhista e Previdenciária|Informática Aplicada à Gestão de Pessoas|Projeto Integrador III|Espanhol II|Gestão das Rotinas de Pessoal|Inglês III"
    [4]="Gestão da Inclusão Social|Gestão do Clima Organizacional|Gestão das Rotinas de Pessoal II|Gestão de Carreiras e Benefícios|Projeto Integrador IV|Informática Aplicada à Gestão de Pessoas II|Gestão Financeira|Inglês IV"
    [5]="Inglês V|Empreendedorismo|Endomarketing|Gestão de Conflitos e Negociação|Saúde e Segurança Ocupacional|Remuneração Estratégica|Projeto de Recursos Humanos I|Gestão por Competências"
    [6]="Projeto de Recursos Humanos II|Gestão do Conhecimento|Consultoria em Gestão de Pessoas|Gestão de Talentos Humanos|Tópicos Especiais em Gestão de Talentos|Inglês VI|Auditoria e Gestão da Qualidade de Vida no Trabalho|Planejamento Estratégico em RH|Ética e Responsabilidade Social Empresarial"
)

declare -A MATERIAS_GPI=(
    [1]="Informática|Comunicação Empresarial|Metodologia de Pesquisa|Tecnologia de Produção|Administração|Inglês I|Cálculo|Projeto GPI I"
    [2]="Desenho Técnico|Fundamentos de Matemática Financeira|Inglês II|Matemática|Estatística|Projeto GPI II|Economia|Introdução à Contabilidade"
    [3]="Projeto GPI III|Economia|Design de Produto|Gestão da Produção Aplicada|Custos Industriais|Projeto de Produto I|Inglês III|Materiais e Ensaios|Estrutura de Operações"
    [4]="Projeto de Produto II|Gestão da Qualidade|PPCP|Higiene e Segurança do Trabalho|Processo de Produção|Fundamentos de Automação Industrial|Inglês IV"
    [5]="Projeto de Fábrica|Gestão da Cadeia de Suprimentos|Gestão Ambiental|Gestão Financeira|Ética e Direito Empresarial|Gestão de Projetos|Projeto de Graduação I"
    [6]="Comércio Exterior|Tecnologia da Informação|Gestão de Pessoas|Marketing|Espanhol II|SAP|Projeto de Graduação II"
)

# Mapa para associar curso ao array de matérias
declare -A CURSO_MATERIAS=(
    [ADS]=MATERIAS_ADS
    [DSM]=MATERIAS_DSM
    [GRH]=MATERIAS_GRH
    [GPI]=MATERIAS_GPI
)

# Arrays para armazenar IDs das salas
declare -A SALA_IDS
declare -A SALA_TURNO

# Contadores
TOTAL_SALAS=0
TOTAL_MATERIAS=0
ERROS=0

echo "Criando salas e matérias..."
echo "======================================"
echo ""

# Função para criar uma sala
criar_sala() {
    local nome=$1
    local semestre=$2
    local curso=$3
    
    local response=$(curl -s -X POST "$BASE_URL/salas" \
        -H "Content-Type: application/json" \
        -d "{
            \"nome\": \"$nome\",
            \"semestre\": \"$semestre\",
            \"segredoLider\": \"$SEGREDO_PADRAO\"
        }")
    
    local id=$(echo "$response" | jq -r '.id // empty')
    
    if [ "$id" != "null" ] && [ -n "$id" ]; then
        SALA_IDS["$nome"]=$id
        TOTAL_SALAS=$((TOTAL_SALAS + 1))
        echo "✓ Sala criada: $nome (ID: $id)"
        return 0
    else
        echo "✗ Erro ao criar sala: $nome"
        echo "  Resposta: $response"
        ERROS=$((ERROS + 1))
        return 1
    fi
}

# Função para criar uma matéria
criar_materia() {
    local nome=$1
    local sala_id=$2
    
    local response=$(curl -s -X POST "$BASE_URL/materias" \
        -H "Content-Type: application/json" \
        -d "{
            \"nome\": \"$nome\",
            \"professor\": \"$PROFESSOR_PADRAO\",
            \"salaId\": $sala_id
        }")
    
    local id=$(echo "$response" | jq -r '.id // empty')
    
    if [ "$id" != "null" ] && [ -n "$id" ]; then
        TOTAL_MATERIAS=$((TOTAL_MATERIAS + 1))
        echo "  ✓ Matéria criada: $nome"
        return 0
    else
        echo "  ✗ Erro ao criar matéria: $nome"
        echo "    Resposta: $response"
        ERROS=$((ERROS + 1))
        return 1
    fi
}

# Criar todas as salas
echo "FASE 1: Criando salas..."
echo ""

for curso in ADS DSM GRH GPI; do
    for turno in Matutino Noturno; do
        # DSM só possui turno Noturno
        if [[ "$curso" == "DSM" && "$turno" == "Matutino" ]]; then
            continue
        fi

        for semestre in 1° 2° 3° 4° 5° 6°; do
            nome="${curso} ${semestre} ${turno}"
            criar_sala "$nome" "$semestre" "$curso"
            SALA_TURNO["$nome"]=$turno
        done
    done
done

echo ""
echo "FASE 2: Criando matérias..."
echo ""

# Criar matérias para cada sala
for nome_sala in "${!SALA_IDS[@]}"; do
    sala_id=${SALA_IDS[$nome_sala]}
    
    # Extrair curso e semestre do nome da sala
    curso=$(echo "$nome_sala" | awk '{print $1}')
    semestre=$(echo "$nome_sala" | awk '{print $2}' | tr -d '°')
    
    # Obter matérias do semestre baseado no curso
    materias=""
    case "$curso" in
        ADS)
            materias="${MATERIAS_ADS[$semestre]}"
            ;;
        DSM)
            materias="${MATERIAS_DSM[$semestre]}"
            ;;
        GRH)
            materias="${MATERIAS_GRH[$semestre]}"
            ;;
        GPI)
            materias="${MATERIAS_GPI[$semestre]}"
            ;;
    esac
    
    if [ -n "$materias" ]; then
        echo "Criando matérias para: $nome_sala (Sala ID: $sala_id)"
        
        # Splitar matérias por |
        IFS='|' read -ra MATERIA_ARRAY <<< "$materias"
        
        for materia in "${MATERIA_ARRAY[@]}"; do
            materia=$(echo "$materia" | xargs)
            if [ -n "$materia" ]; then
                criar_materia "$materia" "$sala_id"
            fi
        done
        echo ""
    fi
done

# Relatório final
echo ""
echo "======================================"
echo "RELATÓRIO FINAL"
echo "======================================"
echo "Salas criadas: $TOTAL_SALAS"
echo "Matérias criadas: $TOTAL_MATERIAS"
echo "Erros: $ERROS"
echo "======================================"
