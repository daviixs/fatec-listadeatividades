package com.fatec.todolist.config;

import com.fatec.todolist.dto.MateriaRequest;
import com.fatec.todolist.dto.SalaDeAulaRequest;
import com.fatec.todolist.entity.CursoConfig;
import com.fatec.todolist.entity.Turno;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import com.fatec.todolist.service.MateriaService;
import com.fatec.todolist.service.SalaDeAulaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final SalaDeAulaRepository salaDeAulaRepository;
    private final SalaDeAulaService salaDeAulaService;
    private final MateriaService materiaService;

    public DataInitializer(SalaDeAulaRepository salaDeAulaRepository,
                          SalaDeAulaService salaDeAulaService,
                          MateriaService materiaService) {
        this.salaDeAulaRepository = salaDeAulaRepository;
        this.salaDeAulaService = salaDeAulaService;
        this.materiaService = materiaService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (salaDeAulaRepository.count() > 0) {
            log.info("Database already contains data. Skipping initialization.");
            return;
        }

        log.info("Starting database initialization...");

        int salasCriadas = 0;
        int materiasCriadas = 0;
        final String segredoPadrao = "fatec2026";
        final String professorPadrao = "Professor";

        for (CursoConfig curso : CursoConfig.values()) {
            for (Turno turno : Turno.values()) {
                for (int semestre = 1; semestre <= 6; semestre++) {
                    String nomeSala = String.format("%s %d° %s",
                        curso.getSigla(),
                        semestre,
                        turno.getDisplayName());

                    String semestreStr = String.valueOf(semestre);

                    SalaDeAulaRequest salaRequest = new SalaDeAulaRequest(
                        nomeSala,
                        semestreStr,
                        segredoPadrao
                    );

                    var sala = salaDeAulaService.criarSala(salaRequest);
                    salasCriadas++;

                    for (String nomeMateria : curso.getMaterias(semestre)) {
                        MateriaRequest materiaRequest = new MateriaRequest(
                            nomeMateria,
                            professorPadrao,
                            sala.getId().longValue()
                        );

                        materiaService.criarMateria(materiaRequest);
                        materiasCriadas++;
                    }
                }
            }
        }

        log.info("Initialization complete. Created {} classrooms with {} subjects.",
            salasCriadas, materiasCriadas);
    }
}
