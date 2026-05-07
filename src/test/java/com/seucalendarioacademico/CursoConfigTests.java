package com.seucalendarioacademico;

import com.seucalendarioacademico.entity.CursoConfig;
import com.seucalendarioacademico.entity.Turno;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CursoConfigTests {

    @Test
    void dsmPossuiApenasTurnoNoturno() {
        assertFalse(CursoConfig.DSM.possuiTurno(Turno.MANHA));
        assertTrue(CursoConfig.DSM.possuiTurno(Turno.NOITE));
    }

    @Test
    void adsNoturnoUsaMateriasEspecificasDoHorarioNoturno() {
        assertEquals(
            List.of(
                "Engenharia de Software",
                "Arquitetura e Organização de Computadores",
                "Algoritmos e Lógica de Programação",
                "Projeto Integrador I",
                "Comunicação e Expressão",
                "Sistemas Operacionais",
                "Inglês I"
            ),
            CursoConfig.ADS.getMaterias(Turno.NOITE, 1)
        );
    }

    @Test
    void gpiMantemDiferencasEntreMatutinoENoturno() {
        assertTrue(CursoConfig.GPI.getMaterias(Turno.MANHA, 1).contains("Informática / Cálculo"));
        assertTrue(CursoConfig.GPI.getMaterias(Turno.NOITE, 1).contains("Fundamentos Comuns Empresariais"));
        assertFalse(CursoConfig.GPI.getMaterias(Turno.NOITE, 1).contains("Comunicação Empresarial"));
    }
}
