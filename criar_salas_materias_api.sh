#!/bin/bash

# Script para criar todas as salas e matérias via API
# Compatível com bash 3.x (macOS)

export API_URL="http://localhost:8080/api"
export SEGREDO="fatec2026"
export PROFESSOR="Professor"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
total_salas=0
total_materias=0

# Função para buscar ou criar uma sala
buscar_ou_criar_sala() {
    local nome=$1
    local semestre=$2

    # Primeiro, tenta buscar a sala pelo nome
    local salas=$(curl -s "$API_URL/salas")
    local sala_id=$(echo "$salas" | grep -o "\"nome\":\"$nome\"" -B 1 | grep '"id":[0-9]*' | head -1 | cut -d':' -f2)

    if [ -n "$sala_id" ]; then
        echo -e "${YELLOW}→${NC} Sala já existe: $nome (ID: $sala_id)"
        echo "$sala_id"
        return
    fi

    # Se não encontrou, tenta criar
    local response=$(curl -s -X POST "$API_URL/salas" \
        -H "Content-Type: application/json" \
        -d "{\"nome\":\"$nome\",\"semestre\":\"$semestre\",\"segredoLider\":\"$SEGREDO\"}")

    sala_id=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

    if [ -n "$sala_id" ]; then
        echo -e "${GREEN}✓${NC} Sala criada: $nome (ID: $sala_id)"
        total_salas=$((total_salas + 1))
        echo "$sala_id"
    else
        echo -e "${RED}✗${NC} Erro ao criar sala: $nome"
        echo "Response: $response"
        return 1
    fi
}

# Função para criar uma matéria
criar_materia() {
    local sala_id=$1
    local nome=$2

    local response=$(curl -s -X POST "$API_URL/materias" \
        -H "Content-Type: application/json" \
        -d "{\"nome\":\"$nome\",\"professor\":\"$PROFESSOR\",\"salaId\":$sala_id}")

    local materia_id=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

    if [ -n "$materia_id" ]; then
        echo "  ✓ Matéria criada: $nome"
        total_materias=$((total_materias + 1))
    else
        echo "  ✗ Erro ao criar matéria: $nome"
        echo "  Response: $response"
    fi
}

# ADS - Análise e Desenvolvimento de Sistemas
criar_materias_ads() {
    local sala_id=$1
    local semestre=$2

    case $semestre in
        1)
            criar_materia "$sala_id" "Arquitetura de Computadores"
            criar_materia "$sala_id" "Desenvolvimento de Interface Web"
            criar_materia "$sala_id" "Engenharia de Requisitos"
            criar_materia "$sala_id" "Estrutura de Dados"
            criar_materia "$sala_id" "Lógica de Programação"
            criar_materia "$sala_id" "Matemática Aplicada"
            criar_materia "$sala_id" "Programação Modular"
            ;;
        2)
            criar_materia "$sala_id" "Algoritmos e Estruturas de Dados"
            criar_materia "$sala_id" "Banco de Dados I"
            criar_materia "$sala_id" "Design de Software"
            criar_materia "$sala_id" "Engenharia de Software"
            criar_materia "$sala_id" "Interação Humano-Computador"
            criar_materia "$sala_id" "Marketing Digital"
            criar_materia "$sala_id" "Paradigmas de Programação"
            criar_materia "$sala_id" "Tópicos em Computação"
            ;;
        3)
            criar_materia "$sala_id" "Banco de Dados II"
            criar_materia "$sala_id" "Desenvolvimento de Aplicações Corporativas"
            criar_materia "$sala_id" "Empreendedorismo"
            criar_materia "$sala_id" "Gestão de Projetos de Software"
            criar_materia "$sala_id" "Linguagens de Programação"
            criar_materia "$sala_id" "Modelagem de Sistemas"
            criar_materia "$sala_id" "Sistemas Operacionais"
            ;;
        4)
            criar_materia "$sala_id" "Computação em Nuvem"
            criar_materia "$sala_id" "Desenvolvimento Móvel"
            criar_materia "$sala_id" "Gestão de TI"
            criar_materia "$sala_id" "Programação para Web"
            criar_materia "$sala_id" "Qualidade de Software"
            criar_materia "$sala_id" "Segurança da Informação"
            criar_materia "$sala_id" "Tópicos Especiais"
            ;;
        5)
            criar_materia "$sala_id" "Arquitetura de Software"
            criar_materia "$sala_id" "Banco de Dados III"
            criar_materia "$sala_id" "Data Science"
            criar_materia "$sala_id" "DevOps"
            criar_materia "$sala_id" "Integração de Sistemas"
            criar_materia "$sala_id" "Processos de Software"
            criar_materia "$sala_id" "Tópicos Avançados"
            ;;
        6)
            criar_materia "$sala_id" "Business Intelligence"
            criar_materia "$sala_id" "Computação Gráfica"
            criar_materia "$sala_id" "Desenvolvimento de Jogos"
            criar_materia "$sala_id" "Internet das Coisas"
            criar_materia "$sala_id" "Machine Learning"
            criar_materia "$sala_id" "Redes de Computadores"
            criar_materia "$sala_id" "Sistemas Distribuídos"
            criar_materia "$sala_id" "TCC I e II"
            ;;
    esac
}

# DSM - Desenvolvimento de Software Multiplataforma
criar_materias_dsm() {
    local sala_id=$1
    local semestre=$2

    case $semestre in
        1)
            criar_materia "$sala_id" "Análise e Projeto de Sistemas"
            criar_materia "$sala_id" "Arquitetura de Computadores"
            criar_materia "$sala_id" "Desenvolvimento de Interface Web"
            criar_materia "$sala_id" "Estrutura de Dados"
            criar_materia "$sala_id" "Lógica de Programação"
            criar_materia "$sala_id" "Matemática Aplicada"
            criar_materia "$sala_id" "Programação Modular"
            ;;
        2)
            criar_materia "$sala_id" "Algoritmos e Estruturas de Dados"
            criar_materia "$sala_id" "Banco de Dados I"
            criar_materia "$sala_id" "Design de Software"
            criar_materia "$sala_id" "Engenharia de Software"
            criar_materia "$sala_id" "Interação Humano-Computador"
            criar_materia "$sala_id" "Paradigmas de Programação"
            criar_materia "$sala_id" "Tópicos em Computação"
            ;;
        3)
            criar_materia "$sala_id" "Banco de Dados II"
            criar_materia "$sala_id" "Desenvolvimento de Aplicações Corporativas"
            criar_materia "$sala_id" "Empreendedorismo"
            criar_materia "$sala_id" "Gestão de Projetos de Software"
            criar_materia "$sala_id" "Linguagens de Programação"
            criar_materia "$sala_id" "Modelagem de Sistemas"
            criar_materia "$sala_id" "Sistemas Operacionais"
            ;;
        4)
            criar_materia "$sala_id" "Computação em Nuvem"
            criar_materia "$sala_id" "Desenvolvimento Móvel"
            criar_materia "$sala_id" "Gestão de TI"
            criar_materia "$sala_id" "Programação para Web"
            criar_materia "$sala_id" "Qualidade de Software"
            criar_materia "$sala_id" "Segurança da Informação"
            criar_materia "$sala_id" "Tópicos Especiais"
            ;;
        5)
            criar_materia "$sala_id" "DevOps"
            criar_materia "$sala_id" "Integração de Sistemas"
            criar_materia "$sala_id" "Processos de Software"
            criar_materia "$sala_id" "Segurança Avançada"
            criar_materia "$sala_id" "Tópicos Avançados"
            ;;
        6)
            criar_materia "$sala_id" "Business Intelligence"
            criar_materia "$sala_id" "Data Science"
            criar_materia "$sala_id" "Internet das Coisas"
            criar_materia "$sala_id" "Machine Learning"
            criar_materia "$sala_id" "Redes de Computadores"
            criar_materia "$sala_id" "TCC I e II"
            ;;
    esac
}

# GRH - Gestão de Recursos Humanos
criar_materias_grh() {
    local sala_id=$1
    local semestre=$2

    case $semestre in
        1)
            criar_materia "$sala_id" "Administração de Recursos Humanos"
            criar_materia "$sala_id" "Análise Organizacional"
            criar_materia "$sala_id" "Contabilidade Básica"
            criar_materia "$sala_id" "Direito do Trabalho"
            criar_materia "$sala_id" "Ética e Responsabilidade Social"
            criar_materia "$sala_id" "Fundamentos de Administração"
            criar_materia "$sala_id" "Psicologia Organizacional"
            ;;
        2)
            criar_materia "$sala_id" "Cálculo Financeiro"
            criar_materia "$sala_id" "Gestão da Qualidade"
            criar_materia "$sala_id" "Gestão de Custos"
            criar_materia "$sala_id" "Gestão Estratégica de Pessoas"
            criar_materia "$sala_id" "Legislação Trabalhista"
            criar_materia "$sala_id" "Planejamento Estratégico"
            criar_materia "$sala_id" "Relações Trabalhistas"
            criar_materia "$sala_id" "Treinamento e Desenvolvimento"
            ;;
        3)
            criar_materia "$sala_id" "Gestão de Benefícios"
            criar_materia "$sala_id" "Gestão de Carreiras"
            criar_materia "$sala_id" "Gestão de Desempenho"
            criar_materia "$sala_id" "Gestão do Clima Organizacional"
            criar_materia "$sala_id" "Gestão por Competências"
            criar_materia "$sala_id" "Psicologia Social"
            criar_materia "$sala_id" "Saúde e Segurança do Trabalho"
            ;;
        4)
            criar_materia "$sala_id" "Comunicação Empresarial"
            criar_materia "$sala_id" "Gestão de Talentos"
            criar_materia "$sala_id" "Marketing Pessoal"
            criar_materia "$sala_id" "Negociação e Mediação"
            criar_materia "$sala_id" "Planejamento de Carreira"
            criar_materia "$sala_id" "Processos de Recrutamento e Seleção"
            criar_materia "$sala_id" "Teoria das Organizações"
            criar_materia "$sala_id" "Trabalho em Equipe"
            ;;
        5)
            criar_materia "$sala_id" "Auditoria de RH"
            criar_materia "$sala_id" "Consultoria em RH"
            criar_materia "$sala_id" "Gestão de Crises"
            criar_materia "$sala_id" "Gestão da Mudança Organizacional"
            criar_materia "$sala_id" "Liderança"
            criar_materia "$sala_id" "Planejamento de RH"
            criar_materia "$sala_id" "Tecnologias em RH"
            criar_materia "$sala_id" "Terceirização"
            ;;
        6)
            criar_materia "$sala_id" "Comportamento Organizacional"
            criar_materia "$sala_id" "Cultura Organizacional"
            criar_materia "$sala_id" "Gestão do Conhecimento"
            criar_materia "$sala_id" "Inteligência Emocional"
            criar_materia "$sala_id" "Tendências em RH"
            criar_materia "$sala_id" "TCC I e II"
            criar_materia "$sala_id" "Trabalho Remoto"
            ;;
    esac
}

# GPI - Gestão de Projetos e Inovação
criar_materias_gpi() {
    local sala_id=$1
    local semestre=$2

    case $semestre in
        1)
            criar_materia "$sala_id" "Administração de Projetos"
            criar_materia "$sala_id" "Análise de Viabilidade"
            criar_materia "$sala_id" "Engenharia de Requisitos"
            criar_materia "$sala_id" "Fundamentos de PMO"
            criar_materia "$sala_id" "Gerenciamento de Riscos"
            criar_materia "$sala_id" "Metodologias de Projetos"
            criar_materia "$sala_id" "Planejamento de Projetos"
            criar_materia "$sala_id" "Programação de Projetos"
            ;;
        2)
            criar_materia "$sala_id" "Análise de Cenários"
            criar_materia "$sala_id" "Compras e Contratos"
            criar_materia "$sala_id" "Gestão da Comunicação"
            criar_materia "$sala_id" "Gestão de Escopo"
            criar_materia "$sala_id" "Gestão de Tempo"
            criar_materia "$sala_id" "MS Project"
            criar_materia "$sala_id" "Planejamento Estratégico de Projetos"
            criar_materia "$sala_id" "PMBOK Aplicado"
            ;;
        3)
            criar_materia "$sala_id" "Agile e Scrum"
            criar_materia "$sala_id" "Gestão da Qualidade"
            criar_materia "$sala_id" "Gestão de Custos"
            criar_materia "$sala_id" "Gestão de Integração"
            criar_materia "$sala_id" "Gestão de Stakeholders"
            criar_materia "$sala_id" "Kaizen"
            criar_materia "$sala_id" "Lean Six Sigma"
            ;;
        4)
            criar_materia "$sala_id" "Escritório de Projetos"
            criar_materia "$sala_id" "Gestão de Mudanças"
            criar_materia "$sala_id" "Gestão de Portfólios"
            criar_materia "$sala_id" "Governança de TI"
            criar_materia "$sala_id" "Indicadores de Desempenho"
            criar_materia "$sala_id" "Maturidade em Projetos"
            criar_materia "$sala_id" "Office 365"
            criar_materia "$sala_id" "Project Server"
            ;;
        5)
            criar_materia "$sala_id" "Analytics em Projetos"
            criar_materia "$sala_id" "Business Intelligence"
            criar_materia "$sala_id" "Design Thinking"
            criar_materia "$sala_id" "Inovação"
            criar_materia "$sala_id" "Metodologias Híbridas"
            criar_materia "$sala_id" "TCC I e II"
            criar_materia "$sala_id" "Técnicas de Negociação"
            ;;
        6)
            criar_materia "$sala_id" "Consultoria em Projetos"
            criar_materia "$sala_id" "Gestão Ágil de Portfólios"
            criar_materia "$sala_id" "Gestão de Programas"
            criar_materia "$sala_id" "Modelagem de Processos"
            criar_materia "$sala_id" "PMO Digital"
            criar_materia "$sala_id" "Transformação Digital"
            criar_materia "$sala_id" "TCC I e II"
            ;;
    esac
}

# Processa todas as salas de um curso
processar_curso() {
    local curso_sigla=$1
    local function_materias=$2

    echo -e "\n${YELLOW}=== Processando curso: $curso_sigla ===${NC}\n"

    for turno in "Manhã" "Noite"; do
        if [ "$curso_sigla" = "DSM" ] && [ "$turno" = "Manhã" ]; then
            continue
        fi
        for semestre in 1 2 3 4 5 6; do
            local nome_sala="$curso_sigla ${semestre}° $turno"

            local sala_id=$(buscar_ou_criar_sala "$nome_sala" "$semestre" | tail -1)

            if [ -n "$sala_id" ]; then
                $function_materias "$sala_id" "$semestre"
            fi
        done
    done
}

# Verifica se o backend está rodando
echo "Verificando se o backend está rodando em $API_URL..."
if ! curl -s "$API_URL/salas" > /dev/null 2>&1; then
    echo -e "${RED}✗ Backend não encontrado em $API_URL${NC}"
    echo "Certifique-se de que o backend está rodando antes de executar este script."
    exit 1
fi

echo -e "${GREEN}✓ Backend encontrado!${NC}\n"

# Main
echo -e "${YELLOW}=== Criando todas as salas e matérias da FATEC ===${NC}"

# Processa cada curso
processar_curso "ADS" criar_materias_ads
processar_curso "DSM" criar_materias_dsm
processar_curso "GRH" criar_materias_grh
processar_curso "GPI" criar_materias_gpi

echo -e "\n${GREEN}=== Finalizado! ===${NC}"
echo -e "Total de salas criadas: $total_salas"
echo -e "Total de matérias criadas: $total_materias"
