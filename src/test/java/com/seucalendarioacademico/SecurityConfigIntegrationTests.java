package com.seucalendarioacademico;

import com.seucalendarioacademico.entity.SalaDeAula;
import com.seucalendarioacademico.repository.SalaDeAulaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
                "spring.cache.type=simple",
                "app.seed.enabled=false",
                "spring.data.redis.repositories.enabled=false"
        })
@AutoConfigureMockMvc
class SecurityConfigIntegrationTests {
    private static final String FRONTEND_PRODUCAO_ORIGIN = "https://listadeatividades.davixs.com.br";


    @Autowired
    private SalaDeAulaRepository salaRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        salaRepository.deleteAll();
    }

    @Test
    void devePermitirAcessoPublicoAoHealth() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate"))
                .andExpect(header().string("Pragma", "no-cache"))
                .andExpect(content().string("OK"));
    }

    @Test
    void devePermitirAcessoPublicoAoAliasApiHealth() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate"))
                .andExpect(header().string("Pragma", "no-cache"))
                .andExpect(content().string("OK"));
    }

    @Test
    void devePermitirAcessoPublicoAoEndpointRaizDeSalas() throws Exception {
        salaRepository.save(novaSala("ADS 1° DIURNO", "1"));

        mockMvc.perform(get("/api/salas"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("ADS 1° DIURNO")));
    }

    @Test
    void devePermitirPreflightOptionsDeOrigemDeProducaoParaSalas() throws Exception {
        mockMvc.perform(options("/api/salas")
                        .header("Origin", FRONTEND_PRODUCAO_ORIGIN)
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "X-Test-Header"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", FRONTEND_PRODUCAO_ORIGIN))
                .andExpect(header().string("Access-Control-Allow-Methods", containsString("GET")));
    }

    @Test
    void deveRetornarCabecalhoCorsEmGetDeSalasParaFrontendDeProducao() throws Exception {
        salaRepository.save(novaSala("ADS 1° DIURNO", "1"));

        mockMvc.perform(get("/api/salas")
                        .header("Origin", FRONTEND_PRODUCAO_ORIGIN))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", FRONTEND_PRODUCAO_ORIGIN));
    }

    @Test
    void naoDeveTratarApiRaizComoEndpointDeHealth() throws Exception {
        mockMvc.perform(get("/api"))
                .andExpect(status().isForbidden());
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
