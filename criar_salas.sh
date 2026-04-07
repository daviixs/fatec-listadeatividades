#!/bin/bash

BASE_URL="http://localhost:8080/api/salas"
SEGREDO_PADRAO="seu-calendario-2026"

# Cursos e seus nomes completos
declare -A cursos=(
    ["ADS"]="Análise e Desenvolvimento de Sistemas"
    ["DSM"]="Desenvolvimento de Software Multiplataforma"
    ["GPI"]="Gestão da Produção Industrial"
    ["GRH"]="Gestão de Recursos Humanos"
)

# Turnos
turnos=("Matutino" "Noturno")

# Semestres
semestres=("1°" "2°" "3°" "4°" "5°" "6°")

echo "Criando salas..."

total_salas=0

for sigla in "${!cursos[@]}"; do
    for turno in "${turnos[@]}"; do
        # DSM somente Noturno
        if [[ "$sigla" == "DSM" && "$turno" == "Matutino" ]]; then
            continue
        fi

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

            total_salas=$((total_salas + 1))
            echo "Criado: $nome"
        done
    done
done

echo "Total de salas criadas: $total_salas"
