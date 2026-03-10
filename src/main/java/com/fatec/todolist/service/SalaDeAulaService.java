package com.fatec.todolist.service;

import com.fatec.todolist.dto.SalaDeAulaRequest;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SalaDeAulaService {

    private final SalaDeAulaRepository salaRepository;

    public SalaDeAulaService(SalaDeAulaRepository salaRepository) {
        this.salaRepository = salaRepository;
    }

    @Transactional(readOnly = true)
    public List<SalaDeAula> listarTodas() {
        return salaRepository.findAll();
    }

    @Transactional
    public SalaDeAula criarSala(SalaDeAulaRequest request) {
        SalaDeAula sala = new SalaDeAula();
        sala.setNome(request.nome());
        sala.setSemestre(request.semestre());
        sala.setSegredoLider(request.segredoLider());
        sala.setCodigoConvite(gerarCodigoConvite());
        return salaRepository.save(sala);
    }

    public SalaDeAula acessarPorCodigo(String codigo) {
        return salaRepository.findByCodigoConvite(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Sala nao encontrada"));
    }

    private String gerarCodigoConvite() {
        String codigo;
        do {
            codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (salaRepository.existsByCodigoConvite(codigo));
        return codigo;
    }
}
