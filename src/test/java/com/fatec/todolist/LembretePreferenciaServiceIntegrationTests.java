package com.fatec.todolist;

import com.fatec.todolist.dto.LembretePreferenciasRequest;
import com.fatec.todolist.dto.LembretePreferenciasResponse;
import com.fatec.todolist.entity.LembreteAssinante;
import com.fatec.todolist.entity.LembreteAssinanteSala;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.repository.AtividadeRepository;
import com.fatec.todolist.repository.LembreteAssinanteRepository;
import com.fatec.todolist.repository.LembreteAssinanteSalaRepository;
import com.fatec.todolist.repository.MateriaRepository;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import com.fatec.todolist.repository.VotacaoCancelamentoRepository;
import com.fatec.todolist.repository.VotoRepository;
import com.fatec.todolist.service.LembretePreferenciaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = {
        "spring.cache.type=simple",
        "app.seed.enabled=false",
        "spring.data.redis.repositories.enabled=false"
})
class LembretePreferenciaServiceIntegrationTests {

    @Autowired
    private LembretePreferenciaService lembretePreferenciaService;

    @Autowired
    private LembreteAssinanteRepository assinanteRepository;

    @Autowired
    private LembreteAssinanteSalaRepository assinanteSalaRepository;

    @Autowired
    private SalaDeAulaRepository salaRepository;

    @Autowired
    private AtividadeRepository atividadeRepository;

    @Autowired
    private MateriaRepository materiaRepository;

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
        assinanteSalaRepository.deleteAll();
        assinanteRepository.deleteAll();
        salaRepository.deleteAll();
    }

    @Test
    void deveSubstituirAsSalasQuandoOMesmoEmailForRecadastrado() {
        SalaDeAula salaOriginal = salaRepository.save(novaSala("ADS 1° MANHA", "1"));
        SalaDeAula novaSala = salaRepository.save(novaSala("ADS 2° MANHA", "2"));

        LembreteAssinante assinante = new LembreteAssinante();
        assinante.setEmail("aluno@fatec.br");
        assinante.setAtivo(true);
        assinante = assinanteRepository.save(assinante);

        LembreteAssinanteSala preferenciaOriginal = new LembreteAssinanteSala();
        preferenciaOriginal.setAssinante(assinante);
        preferenciaOriginal.setSala(salaOriginal);
        preferenciaOriginal.setAtivo(true);
        assinanteSalaRepository.save(preferenciaOriginal);

        LembretePreferenciasResponse response = lembretePreferenciaService.salvar(
                new LembretePreferenciasRequest("aluno@fatec.br", List.of(novaSala.getId()))
        );

        List<LembreteAssinanteSala> preferenciasAtivas =
                assinanteSalaRepository.findByAssinanteIdAndAtivoTrue(assinante.getId());

        assertEquals(assinante.getId(), response.assinanteId());
        assertEquals(List.of(novaSala.getId()), response.salaIds());
        assertEquals(1, preferenciasAtivas.size());
        assertEquals(novaSala.getId(), preferenciasAtivas.get(0).getSala().getId());
        assertTrue(response.ativo());
    }

    private SalaDeAula novaSala(String nome, String semestre) {
        SalaDeAula sala = new SalaDeAula();
        sala.setNome(nome);
        sala.setSemestre(semestre);
        sala.setSegredoLider("segredo");
        sala.setCodigoConvite(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return sala;
    }
}
