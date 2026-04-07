package com.seucalendarioacademico;

import com.seucalendarioacademico.entity.Atividade;
import com.seucalendarioacademico.entity.Materia;
import com.seucalendarioacademico.entity.SalaDeAula;
import com.seucalendarioacademico.entity.TipoAtividade;
import com.seucalendarioacademico.entity.TipoEntrega;
import com.seucalendarioacademico.repository.AtividadeRepository;
import com.seucalendarioacademico.repository.MateriaRepository;
import com.seucalendarioacademico.repository.SalaDeAulaRepository;
import com.seucalendarioacademico.repository.VotacaoCancelamentoRepository;
import com.seucalendarioacademico.repository.VotoRepository;
import com.seucalendarioacademico.service.SalaConsultaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(properties = {
        "spring.cache.type=simple",
        "app.seed.enabled=false",
        "spring.data.redis.repositories.enabled=false"
})
class SalaDeAulaControllerIntegrationTests {

    @Autowired
    private SalaConsultaService salaConsultaService;

    @Autowired
    private AtividadeRepository atividadeRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private SalaDeAulaRepository salaRepository;

    @Autowired
    private VotacaoCancelamentoRepository votacaoRepository;

    @Autowired
    private VotoRepository votoRepository;

    @BeforeEach
    void setUp() {
        votoRepository.deleteAll();
        votacaoRepository.deleteAll();
        atividadeRepository.deleteAll();
        materiaRepository.deleteAll();
        salaRepository.deleteAll();
    }

    @Test
    void deveRetornarCalendarioAgregadoDaSala() {
        SalaDeAula sala = salaRepository.save(novaSala("GPI 2° NOTURNO", "2"));
        Materia materia = materiaRepository.save(novaMateria("Pesquisa Operacional", sala));
        atividadeRepository.save(novaAtividade("Trabalho Final", materia));

        var calendario = salaConsultaService.buscarCalendarioPorSala(sala.getId());

        assertEquals(sala.getId(), calendario.sala().id());
        assertEquals(sala.getNome(), calendario.sala().nome());
        assertEquals(1, calendario.materias().size());
        assertEquals(materia.getId(), calendario.materias().get(0).id());
        assertEquals(materia.getNome(), calendario.materias().get(0).nome());
        assertEquals(1, calendario.atividades().size());
        assertEquals("Trabalho Final", calendario.atividades().get(0).titulo());
        assertEquals(materia.getId(), calendario.atividades().get(0).materiaId());
        assertEquals(materia.getNome(), calendario.atividades().get(0).materiaNome());
    }

    private SalaDeAula novaSala(String nome, String semestre) {
        SalaDeAula sala = new SalaDeAula();
        sala.setNome(nome);
        sala.setSemestre(semestre);
        sala.setSegredoLider("segredo");
        sala.setCodigoConvite(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return sala;
    }

    private Materia novaMateria(String nome, SalaDeAula sala) {
        Materia materia = new Materia();
        materia.setNome(nome);
        materia.setProfessor("Professor Teste");
        materia.setSala(sala);
        return materia;
    }

    private Atividade novaAtividade(String titulo, Materia materia) {
        Atividade atividade = new Atividade();
        atividade.setTitulo(titulo);
        atividade.setDescricao("Descricao");
        atividade.setTipoEntrega(TipoEntrega.ENTREGA_MANUAL);
        atividade.setRegras("Regras");
        atividade.setPrazo(LocalDate.now().plusDays(5));
        atividade.setMateria(materia);
        atividade.setTipo(TipoAtividade.TRABALHO);
        return atividade;
    }
}
