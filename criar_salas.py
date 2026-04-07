#!/usr/bin/env python3

import requests

BASE_URL = "http://localhost:8080/api/salas"
SEGREDO_PADRAO = "seu-calendario-2026"

cursos = {
    "ADS": "Análise e Desenvolvimento de Sistemas",
    "DSM": "Desenvolvimento de Software Multiplataforma",
    "GPI": "Gestão da Produção Industrial",
    "GRH": "Gestão de Recursos Humanos"
}

turnos = ["Manhã", "Noite"]
semestres = ["1°", "2°", "3°", "4°", "5°", "6°"]

print("Criando salas...")

contador = 0

for sigla, nome_completo in cursos.items():
    for turno in turnos:
        for semestre in semestres:
            nome = f"{sigla} {semestre} {turno}"

            payload = {
                "nome": nome,
                "semestre": semestre,
                "segredoLider": SEGREDO_PADRAO
            }

            response = requests.post(BASE_URL, json=payload)

            if response.status_code == 201:
                print(f"✓ Criado: {nome}")
                contador += 1
            else:
                print(f"✗ Erro ao criar {nome}: {response.status_code}")

print(f"\nTotal de salas criadas: {contador}/{len(cursos) * len(turnos) * len(semestres)}")
