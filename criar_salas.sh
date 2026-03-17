#!/bin/bash

BASE_URL="http://localhost:8080/api/salas"
SEGREDO_PADRAO="fatec2026"

# Cursos e seus nomes completos
declare -A cursos=(
    ["ADS"]="Análise e Desenvolvimento de Sistemas"
    ["DSM"]="Desenvolvimento de Software Multiplataforma"
    ["GPI"]="Gestão da Produção Industrial"
    ["GRH"]="Gestão de Recursos Humanos"
)

# Turnos
turnos=("Manhã" "Noite")

# Semestres
semestres=("1°" "2°" "3°" "4°" "5°" "6°")

echo "Criando salas..."

for sigla in "${!cursos[@]}"; do
    for turno in "${turnos[@]}"; do
        for semestre in "${semestres[@]}"; do
            nome="${sigla} ${semestre} ${turno}"

            curl -X POST "$BASE_URL" \
                -H "Content-Type: application/json" \
                -d "{
                    \"nome\": \"$nome\",
                    \"semestre\": \"$semestre\",
                    \"segredoLider\": \"$SEGREDO_PADRAO\"
                }" \
                -w "\nStatus: %{http_code}\n" \
                -s

            echo "Criado: $nome"
        done
    done
done

echo "Total de salas criadas: $((${#cursos[@]} * ${#turnos[@]} * ${#semestres[@]}))"
