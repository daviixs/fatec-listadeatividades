package com.fatec.todolist;

import com.fatec.todolist.dto.AtividadeRequest;
import com.fatec.todolist.dto.SalaDeAulaRequest;
import com.fatec.todolist.dto.SalaCalendarioResponse;
import com.fatec.todolist.dto.SalaDeAulaResponse;
import com.fatec.todolist.entity.Atividade;
import com.fatec.todolist.entity.Materia;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.entity.TipoAtividade;
import com.fatec.todolist.entity.TipoEntrega;
import com.fatec.todolist.repository.AtividadeRepository;
import com.fatec.todolist.repository.MateriaRepository;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import com.fatec.todolist.repository.VotacaoCancelamentoRepository;
import com.fatec.todolist.repository.VotoRepository;
import com.fatec.todolist.service.AtividadeService;
import com.fatec.todolist.service.SalaConsultaService;
import com.fatec.todolist.service.SalaDeAulaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(properties = {
        "spring.cache.type=simple",
        "app.seed.enabled=false",
        "spring.data.redis.repositories.enabled=false"
})
class CacheIntegrationTests {

    @Autowired
    private SalaConsultaService salaConsultaService;

    @Autowired
    private SalaDeAulaService salaDeAulaService;

    @Autowired
    private AtividadeService atividadeService;

    @Autowired
    private SalaDeAulaRepository salaRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private AtividadeRepository atividadeRepository;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private VotacaoCancelamentoRepository votacaoRepository;

    @Autowired
    private VotoRepository votoRepository;

    @BeforeEach
    void setUp() {
        clearCache("salas");
        clearCache("materiasPorSala");
        clearCache("calendarioSala");
        votoRepository.deleteAll();
        votacaoRepository.deleteAll();
        atividadeRepository.deleteAll();
        materiaRepository.deleteAll();
        salaRepository.deleteAll();
    }

    @Test
    void deveCachearListaDeSalasEInvalidarQuandoUmaSalaForCriadaPeloServico() {
        salaRepository.save(novaSala("ADS 1° MANHA", "1"));

        List<SalaDeAulaResponse> primeiraConsulta = salaConsultaService.listarTodas();
        assertEquals(1, primeiraConsulta.size());

        salaRepository.save(novaSala("ADS 2° MANHA", "2"));

        List<SalaDeAulaResponse> consultaCacheada = salaConsultaService.listarTodas();
        assertEquals(1, consultaCacheada.size());

        salaDeAulaService.criarSala(new SalaDeAulaRequest("ADS 3° MANHA", "3", "segredo"));

        List<SalaDeAulaResponse> consultaAposInvalidacao = salaConsultaService.listarTodas();
        assertEquals(3, consultaAposInvalidacao.size());
    }

    @Test
    void deveCachearCalendarioDaSalaEInvalidarQuandoUmaAtividadeForCriadaPeloServico() {
        SalaDeAula sala = salaRepository.save(novaSala("DSM 1° NOTURNO", "1"));
        Materia materia = materiaRepository.save(novaMateria("Engenharia de Software", sala));
        atividadeRepository.save(novaAtividade("Lista 01", materia, LocalDate.now().plusDays(1)));

        SalaCalendarioResponse primeiraConsulta = salaConsultaService.buscarCalendarioPorSala(sala.getId());
        assertEquals(1, primeiraConsulta.atividades().size());

        atividadeRepository.save(novaAtividade("Lista 02", materia, LocalDate.now().plusDays(2)));

        SalaCalendarioResponse consultaCacheada = salaConsultaService.buscarCalendarioPorSala(sala.getId());
        assertEquals(1, consultaCacheada.atividades().size());

        atividadeService.criar(new AtividadeRequest(
                null,
                "Lista 03",
                "Nova atividade para invalidar o cache",
                TipoEntrega.ENTREGA_MANUAL,
                null,
                "Entregar em PDF",
                LocalDate.now().plusDays(3),
                materia.getId(),
                TipoAtividade.ATIVIDADE
        ));

        SalaCalendarioResponse consultaAposInvalidacao = salaConsultaService.buscarCalendarioPorSala(sala.getId());
        assertEquals(3, consultaAposInvalidacao.atividades().size());
    }

    private void clearCache(String cacheName) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
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

    private Atividade novaAtividade(String titulo, Materia materia, LocalDate prazo) {
        Atividade atividade = new Atividade();
        atividade.setTitulo(titulo);
        atividade.setDescricao("Descricao");
        atividade.setTipoEntrega(TipoEntrega.ENTREGA_MANUAL);
        atividade.setRegras("Regras");
        atividade.setPrazo(prazo);
        atividade.setMateria(materia);
        atividade.setTipo(TipoAtividade.ATIVIDADE);
        return atividade;
    }
}
