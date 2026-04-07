package com.fatec.todolist;

import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
                "spring.cache.type=simple",
                "app.seed.enabled=false",
                "spring.data.redis.repositories.enabled=false"
        })
@AutoConfigureMockMvc
class SecurityConfigIntegrationTests {

    @Autowired
    private SalaDeAulaRepository salaRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        salaRepository.deleteAll();
    }

    @Test
    void devePermitirAcessoPublicoAoEndpointRaizDeSalas() throws Exception {
        salaRepository.save(novaSala("ADS 1° DIURNO", "1"));

        mockMvc.perform(get("/api/salas"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("ADS 1° DIURNO")));
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
