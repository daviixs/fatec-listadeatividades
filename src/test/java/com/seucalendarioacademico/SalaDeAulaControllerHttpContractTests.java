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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.cache.type=simple",
        "app.seed.enabled=false",
        "spring.data.redis.repositories.enabled=false"
})
class SalaDeAulaControllerHttpContractTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

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
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        votoRepository.deleteAll();
        votacaoRepository.deleteAll();
        atividadeRepository.deleteAll();
        materiaRepository.deleteAll();
        salaRepository.deleteAll();
    }

    @Test
    void listarSalasDeveRetornarArrayJson() throws Exception {
        salaRepository.save(novaSala("ADS 1° MANHA", "1"));

        mockMvc.perform(get("/api/salas"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].nome").value("ADS 1° MANHA"))
                .andExpect(jsonPath("$[0].semestre").value("1"));
    }

    @Test
    void calendarioDaSalaDeveRetornarArraysJsonNoContrato() throws Exception {
        SalaDeAula sala = salaRepository.save(novaSala("DSM 2° NOTURNO", "2"));
        Materia materia = materiaRepository.save(novaMateria("Banco de Dados", sala));
        atividadeRepository.save(novaAtividade("Projeto Final", materia));

        mockMvc.perform(get("/api/salas/{salaId}/calendario", sala.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.sala.nome").value("DSM 2° NOTURNO"))
                .andExpect(jsonPath("$.materias").isArray())
                .andExpect(jsonPath("$.materias[0].nome").value("Banco de Dados"))
                .andExpect(jsonPath("$.atividades").isArray())
                .andExpect(jsonPath("$.atividades[0].titulo").value("Projeto Final"))
                .andExpect(jsonPath("$.atividades[0].tipo").value("TRABALHO"));
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
        atividade.setPrazo(LocalDate.now().plusDays(3));
        atividade.setMateria(materia);
        atividade.setTipo(TipoAtividade.TRABALHO);
        return atividade;
    }
}
