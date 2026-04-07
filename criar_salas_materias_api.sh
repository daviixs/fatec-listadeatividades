#!/bin/bash

# Script para criar todas as salas e matérias via API
# Compatível com bash 3.x (macOS)

export API_URL="http://localhost:8080/api"
export SEGREDO="seu-calendario-2026"
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
            criar_materia "$sala_id" "Inglês I"
            criar_materia "$sala_id" "Algoritmos e Lógica de Programação"
            criar_materia "$sala_id" "Engenharia de Software I"
            criar_materia "$sala_id" "Comunicação e Expressão"
            criar_materia "$sala_id" "Arquitetura e Organização de Computadores"
            criar_materia "$sala_id" "Projeto Integrador I"
            criar_materia "$sala_id" "Sistemas Operacionais"
            ;;
        2)
            criar_materia "$sala_id" "Interação Humano Computador"
            criar_materia "$sala_id" "Linguagem de Programação"
            criar_materia "$sala_id" "Gestão Financeira Empresarial com Tecnologia"
            criar_materia "$sala_id" "Cálculo"
            criar_materia "$sala_id" "Engenharia de Software II"
            criar_materia "$sala_id" "Banco de Dados Relacional"
            criar_materia "$sala_id" "Comunicação e Expressão II"
            criar_materia "$sala_id" "Inglês II"
            ;;
        3)
            criar_materia "$sala_id" "Programação Orientada a Objetos"
            criar_materia "$sala_id" "Gestão de Negócios"
            criar_materia "$sala_id" "Estrutura de Dados"
            criar_materia "$sala_id" "Gestão de Projetos Ágeis"
            criar_materia "$sala_id" "Laboratório de Banco de Dados"
            criar_materia "$sala_id" "Experiência do Usuário"
            criar_materia "$sala_id" "Inglês III"
            ;;
        4)
            criar_materia "$sala_id" "Inglês IV"
            criar_materia "$sala_id" "Programação Orientada a Objetos"
            criar_materia "$sala_id" "Engenharia de Software III"
            criar_materia "$sala_id" "Sistemas Operacionais II"
            criar_materia "$sala_id" "Banco de Dados"
            criar_materia "$sala_id" "Metodologia de Pesquisa Científica e Tecnológica"
            criar_materia "$sala_id" "Programação Web"
            ;;
        5)
            criar_materia "$sala_id" "Redes de Computadores I"
            criar_materia "$sala_id" "Programação Linear"
            criar_materia "$sala_id" "Inglês V"
            criar_materia "$sala_id" "Laboratório de Engenharia de Software"
            criar_materia "$sala_id" "Segurança da Informação"
            criar_materia "$sala_id" "Programação Script"
            criar_materia "$sala_id" "Laboratório de Banco de Dados"
            ;;
        6)
            criar_materia "$sala_id" "Inteligência Artificial"
            criar_materia "$sala_id" "Tópicos Especiais"
            criar_materia "$sala_id" "Gestão de Equipes"
            criar_materia "$sala_id" "Gestão de Projetos"
            criar_materia "$sala_id" "Gestão e Governança de TI"
            criar_materia "$sala_id" "Empreendedorismo"
            criar_materia "$sala_id" "Ética"
            criar_materia "$sala_id" "Inglês VI"
            ;;
    esac
}

# DSM - Desenvolvimento de Software Multiplataforma
criar_materias_dsm() {
    local sala_id=$1
    local semestre=$2

    case $semestre in
        1)
            criar_materia "$sala_id" "Desenvolvimento Web I"
            criar_materia "$sala_id" "Engenharia de Software I"
            criar_materia "$sala_id" "Algoritmos e Lógica de Programação"
            criar_materia "$sala_id" "Design Digital"
            criar_materia "$sala_id" "Sistemas Operacionais e Redes de Computadores"
            criar_materia "$sala_id" "Modelagem de Banco de Dados"
            ;;
        2)
            criar_materia "$sala_id" "Engenharia de Software II"
            criar_materia "$sala_id" "Estrutura de Dados"
            criar_materia "$sala_id" "Desenvolvimento Web II"
            criar_materia "$sala_id" "Técnicas de Programação I"
            criar_materia "$sala_id" "Matemática para Computação"
            criar_materia "$sala_id" "Banco de Dados Relacional"
            ;;
        3)
            criar_materia "$sala_id" "Banco de Dados Não Relacional"
            criar_materia "$sala_id" "Inglês I"
            criar_materia "$sala_id" "Gestão Ágil de Projetos de Software"
            criar_materia "$sala_id" "Interação Humano-Computador"
            criar_materia "$sala_id" "Álgebra Linear"
            criar_materia "$sala_id" "Técnicas de Programação II"
            criar_materia "$sala_id" "Desenvolvimento Web III"
            ;;
        4)
            criar_materia "$sala_id" "Programação para Dispositivos Móveis I"
            criar_materia "$sala_id" "Experiência do Usuário"
            criar_materia "$sala_id" "Estatística Aplicada"
            criar_materia "$sala_id" "Integração e Entrega"
            criar_materia "$sala_id" "Internet das Coisas"
            criar_materia "$sala_id" "Laboratório de Desenvolvimento Web"
            criar_materia "$sala_id" "Inglês II"
            ;;
        5)
            criar_materia "$sala_id" "Redação"
            criar_materia "$sala_id" "Computação em Nuvem I"
            criar_materia "$sala_id" "Programação para Dispositivos Móveis II"
            criar_materia "$sala_id" "Aprendizagem de Máquinas"
            criar_materia "$sala_id" "Laboratório de Dispositivos Móveis"
            criar_materia "$sala_id" "Segurança no Desenvolvimento de Aplicações"
            criar_materia "$sala_id" "Inglês III"
            ;;
        6)
            criar_materia "$sala_id" "Qualidade e Testes de Software"
            criar_materia "$sala_id" "Mineração de Dados"
            criar_materia "$sala_id" "Processamento de Linguagem Natural"
            criar_materia "$sala_id" "Computação em Nuvem II"
            criar_materia "$sala_id" "Ética Profissional e Patente"
            criar_materia "$sala_id" "Laboratório de Desenvolvimento Multiplataforma"
            criar_materia "$sala_id" "Inglês IV"
            ;;
    esac
}

# GRH - Gestão de Recursos Humanos
criar_materias_grh() {
    local sala_id=$1
    local semestre=$2

    case $semestre in
        1)
            criar_materia "$sala_id" "Inglês I"
            criar_materia "$sala_id" "Matemática Elementar"
            criar_materia "$sala_id" "Comportamento Organizacional"
            criar_materia "$sala_id" "Projeto Integrador I"
            criar_materia "$sala_id" "Administração Geral"
            criar_materia "$sala_id" "Gestão das Relações Interpessoais"
            criar_materia "$sala_id" "Leitura e Produção de Texto"
            ;;
        2)
            criar_materia "$sala_id" "Comunicação Empresarial"
            criar_materia "$sala_id" "Gestão de Pessoas na Administração Pública"
            criar_materia "$sala_id" "Projeto Integrador II"
            criar_materia "$sala_id" "Espanhol I"
            criar_materia "$sala_id" "Métodos para Produção do Conhecimento"
            criar_materia "$sala_id" "Captação e Seleção de Talentos"
            criar_materia "$sala_id" "Estatística"
            criar_materia "$sala_id" "Inglês II"
            ;;
        3)
            criar_materia "$sala_id" "Fundamentos de Economia"
            criar_materia "$sala_id" "Educação Corporativa"
            criar_materia "$sala_id" "Legislação Trabalhista e Previdenciária"
            criar_materia "$sala_id" "Informática Aplicada à Gestão de Pessoas"
            criar_materia "$sala_id" "Projeto Integrador III"
            criar_materia "$sala_id" "Espanhol II"
            criar_materia "$sala_id" "Gestão das Rotinas de Pessoal"
            criar_materia "$sala_id" "Inglês III"
            ;;
        4)
            criar_materia "$sala_id" "Gestão da Inclusão Social"
            criar_materia "$sala_id" "Gestão do Clima Organizacional"
            criar_materia "$sala_id" "Gestão das Rotinas de Pessoal II"
            criar_materia "$sala_id" "Gestão de Carreiras e Benefícios"
            criar_materia "$sala_id" "Projeto Integrador IV"
            criar_materia "$sala_id" "Informática Aplicada à Gestão de Pessoas II"
            criar_materia "$sala_id" "Gestão Financeira"
            criar_materia "$sala_id" "Inglês IV"
            ;;
        5)
            criar_materia "$sala_id" "Inglês V"
            criar_materia "$sala_id" "Empreendedorismo"
            criar_materia "$sala_id" "Endomarketing"
            criar_materia "$sala_id" "Gestão de Conflitos e Negociação"
            criar_materia "$sala_id" "Saúde e Segurança Ocupacional"
            criar_materia "$sala_id" "Remuneração Estratégica"
            criar_materia "$sala_id" "Projeto de Recursos Humanos I"
            criar_materia "$sala_id" "Gestão por Competências"
            ;;
        6)
            criar_materia "$sala_id" "Projeto de Recursos Humanos II"
            criar_materia "$sala_id" "Gestão do Conhecimento"
            criar_materia "$sala_id" "Consultoria em Gestão de Pessoas"
            criar_materia "$sala_id" "Gestão de Talentos Humanos"
            criar_materia "$sala_id" "Tópicos Especiais em Gestão de Talentos"
            criar_materia "$sala_id" "Inglês VI"
            criar_materia "$sala_id" "Auditoria e Gestão da Qualidade de Vida no Trabalho"
            criar_materia "$sala_id" "Planejamento Estratégico em RH"
            criar_materia "$sala_id" "Ética e Responsabilidade Social Empresarial"
            ;;
    esac
}

# GPI - Gestão da Produção Industrial
criar_materias_gpi() {
    local sala_id=$1
    local semestre=$2

    case $semestre in
        1)
            criar_materia "$sala_id" "Informática"
            criar_materia "$sala_id" "Comunicação Empresarial"
            criar_materia "$sala_id" "Metodologia de Pesquisa"
            criar_materia "$sala_id" "Tecnologia de Produção"
            criar_materia "$sala_id" "Administração"
            criar_materia "$sala_id" "Inglês I"
            criar_materia "$sala_id" "Cálculo"
            criar_materia "$sala_id" "Projeto GPI I"
            ;;
        2)
            criar_materia "$sala_id" "Desenho Técnico"
            criar_materia "$sala_id" "Fundamentos de Matemática Financeira"
            criar_materia "$sala_id" "Inglês II"
            criar_materia "$sala_id" "Matemática"
            criar_materia "$sala_id" "Estatística"
            criar_materia "$sala_id" "Projeto GPI II"
            criar_materia "$sala_id" "Economia"
            criar_materia "$sala_id" "Introdução à Contabilidade"
            ;;
        3)
            criar_materia "$sala_id" "Projeto GPI III"
            criar_materia "$sala_id" "Economia"
            criar_materia "$sala_id" "Design de Produto"
            criar_materia "$sala_id" "Gestão da Produção Aplicada"
            criar_materia "$sala_id" "Custos Industriais"
            criar_materia "$sala_id" "Projeto de Produto I"
            criar_materia "$sala_id" "Inglês III"
            criar_materia "$sala_id" "Materiais e Ensaios"
            criar_materia "$sala_id" "Estrutura de Operações"
            ;;
        4)
            criar_materia "$sala_id" "Projeto de Produto II"
            criar_materia "$sala_id" "Gestão da Qualidade"
            criar_materia "$sala_id" "PPCP"
            criar_materia "$sala_id" "Higiene e Segurança do Trabalho"
            criar_materia "$sala_id" "Processo de Produção"
            criar_materia "$sala_id" "Fundamentos de Automação Industrial"
            criar_materia "$sala_id" "Inglês IV"
            ;;
        5)
            criar_materia "$sala_id" "Projeto de Fábrica"
            criar_materia "$sala_id" "Gestão da Cadeia de Suprimentos"
            criar_materia "$sala_id" "Gestão Ambiental"
            criar_materia "$sala_id" "Gestão Financeira"
            criar_materia "$sala_id" "Ética e Direito Empresarial"
            criar_materia "$sala_id" "Gestão de Projetos"
            criar_materia "$sala_id" "Projeto de Graduação I"
            ;;
        6)
            criar_materia "$sala_id" "Comércio Exterior"
            criar_materia "$sala_id" "Tecnologia da Informação"
            criar_materia "$sala_id" "Gestão de Pessoas"
            criar_materia "$sala_id" "Marketing"
            criar_materia "$sala_id" "Espanhol II"
            criar_materia "$sala_id" "SAP"
            criar_materia "$sala_id" "Projeto de Graduação II"
            ;;
    esac
}

# Processa todas as salas de um curso
processar_curso() {
    local curso_sigla=$1
    local function_materias=$2

    echo -e "\n${YELLOW}=== Processando curso: $curso_sigla ===${NC}\n"

    for turno in "Matutino" "Noturno"; do
        if [ "$curso_sigla" = "DSM" ] && [ "$turno" = "Matutino" ]; then
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
echo -e "${YELLOW}=== Criando salas e matérias do Seu Calendário Acadêmico ===${NC}"

# Processa cada curso
processar_curso "ADS" criar_materias_ads
processar_curso "DSM" criar_materias_dsm
processar_curso "GRH" criar_materias_grh
processar_curso "GPI" criar_materias_gpi

echo -e "\n${GREEN}=== Finalizado! ===${NC}"
echo -e "Total de salas criadas: $total_salas"
echo -e "Total de matérias criadas: $total_materias"
