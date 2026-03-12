#!/bin/bash

BASE_URL="http://localhost:8080/api"
SEGREDO_PADRAO="lider123"
PROFESSOR_PADRAO="Professor"

# Arrays de matérias por curso e semestre
declare -A MATERIAS_ADS=(
    [1]="Engenharia de Software I|Algoritmos e Lógica de Programação|Sistemas Operacionais|Arquitetura e Organização de Computadores|Comunicação e Expressão|Inglês I|Projeto Integrador I"
    [2]="Banco de Dados Relacional|Engenharia de Software II|Linguagem de Programação|Cálculo|Interação Humano Computador|Comunicação e Expressão II|Inglês II|Gestão Financeira Empresarial com Tecnologias"
    [3]="Laboratório de Banco de Dados|Gestão de Negócios|Experiência do Usuário|Programação Orientada a Objetos|Estrutura de Dados|Gestão de Projetos Ágeis|Inglês III"
    [4]="Engenharia de Software III|Programação Orientada a Objetos|Banco de Dados|Sistemas Operacionais II|Programação Web (Eletiva)|Metodologia da Pesquisa Tecnológica Científica|Inglês IV"
    [5]="Redes de Computadores I|Programação Linear|Laboratório de Engenharia de Software|Segurança da Informação|Eletiva II – Programação Script|Eletiva I – Laboratório de Banco de Dados|Inglês V"
    [6]="Inteligência Artificial (Escolha III)|Gestão de Projetos|Empreendedorismo|Gestão de Equipes|Gestão e Governança de TI|Ética e Responsabilidade|Inglês VI|Tópicos Especiais (Escolha II)"
)

declare -A MATERIAS_DSM=(
    [1]="Modelagem de Banco de Dados|Desenvolvimento Web I|Algoritmos e Lógica de Programação|Engenharia de Software I|Design Digital|Sistemas Operacionais e Redes|Inglês I"
    [2]="Banco de Dados Relacional|Desenvolvimento Web II|Técnicas de Programação I|Engenharia de Software II|Estrutura de Dados|Matemática para Computação|Inglês II"
    [3]="Banco de Dados Não Relacional|Desenvolvimento Web III|Técnicas de Programação II|Gestão Ágil de Projetos|Álgebra Linear|Interação Humano Computador|Inglês III"
    [4]="Integração e Entrega Contínua|Laboratório de Desenvolvimento Web|Programação para Dispositivos Móveis I|Internet das Coisas e Aplicações|Estatística Aplicada|Experiência do Usuário|Inglês IV"
    [5]="Segurança no Desenvolvimento de Aplicações|Lab. de Desenvolvimento para Dispositivos Móveis|Programação para Dispositivos Móveis II|Aprendizagem de Máquina|Computação em Nuvem I"
    [6]="Mineração de Dados|Lab. de Desenvolvimento Multiplataforma|Qualidade e Testes de Software|Processamento de Linguagem Natural|Computação em Nuvem II|Ética Profissional e Patente"
)

declare -A MATERIAS_GRH=(
    [1]="Projeto Integrador I|Matemática Elementar|Comportamento Organizacional|Leitura e Produção de Textos|Gestão das Relações Interpessoais|Administração Geral|Inglês I"
    [2]="Comunicação Empresarial|Métodos para Produção do Conhecimento|Gestão de Pessoas na Administração Pública|Espanhol I|Captação e Seleção de Talentos|Estatística|Inglês II|Projeto Integrador II"
    [3]="Projeto Integrador III|Espanhol II|Inglês III|Informática Aplicada à Gestão de Pessoas I|Legislação Trabalhista e Previdenciária|Educação Corporativa|Gestão das Rotinas de Pessoal I|Fundamentos de Economia"
    [4]="Gestão da Inclusão Social|Gestão Financeira|Gestão de Carreira e Benefícios|Gestão das Rotinas de Pessoal II|Informática Aplicada à Gestão de Pessoas II|Gestão do Clima Organizacional|Inglês IV|Projeto Integrador IV"
    [5]="Projeto de Recursos Humanos I|Empreendedorismo|Endomarketing e Gestão de Clientes Internos|Gestão por Competências|Saúde e Segurança Ocupacional|Gestão de Conflitos e Negociação|Remuneração Estratégica|Inglês V"
    [6]="Projeto de Recursos Humanos II|Gestão do Conhecimento|Auditoria e Gestão da Qualidade de Vida no Trabalho|Tópicos Especiais em Gestão de Talentos Humanos|Planejamento Estratégico em RH|Consultoria em Gestão de Pessoas|Ética e Responsabilidade Social Empresarial|Inglês VI"
)

declare -A MATERIAS_GPI=(
    [1]="Informática|Tecnologia da Produção|Fundamentos de Comunicação Empresarial|Cálculo|Administração|Métodos de Pesquisa|Inglês I|Projeto Integrador GPI I"
    [2]="Materiais e Tratamentos I|Estatística|Fundamentos de Matemática Financeira|Ergonomia|Introdução à Contabilidade|Liderança e Empreendedorismo|Inglês II|Projeto Integrador GPI II"
    [3]="Estratégia de Produção e Operações|Gestão da Produção Aplicada|Economia|Custos Industriais|Materiais e Tratamentos II|Projeto de Produto I|Inglês III"
    [4]="Processo de Produção|Higiene e Segurança do Trabalho|Projeto de Produto II|Gestão da Qualidade|PPCP (Planejamento e Controle da Produção)|Automação Industrial|Projeto Integrador GPI III|Inglês IV"
    [5]="Espanhol I|Gestão Ambiental|Fundamentos de Gestão de Projetos|Gestão Financeira|Gestão da Cadeia de Suprimentos|Projeto de Fábrica|Projeto de Graduação I"
    [6]="Tecnologia da Informação|Comércio Exterior|SAP|Marketing e Vendas|Gestão de Pessoas|Espanhol II|Projeto de Graduação II"
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
    for turno in Manhã Noite; do
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
