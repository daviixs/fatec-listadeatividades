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
    private final CacheInvalidationService cacheInvalidationService;

    public SalaDeAulaService(
            SalaDeAulaRepository salaRepository,
            CacheInvalidationService cacheInvalidationService
    ) {
        this.salaRepository = salaRepository;
        this.cacheInvalidationService = cacheInvalidationService;
    }

    @Transactional(readOnly = true)
    public List<SalaDeAula> listarTodas() {
        return salaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public SalaDeAula buscarPorId(Integer id) {
        return salaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Sala nao encontrada"));
    }

    @Transactional
    public SalaDeAula criarSala(SalaDeAulaRequest request) {
        SalaDeAula sala = new SalaDeAula();
        sala.setNome(request.nome());
        sala.setSemestre(request.semestre());
        sala.setSegredoLider(request.segredoLider());
        sala.setCodigoConvite(gerarCodigoConvite());
        SalaDeAula salva = salaRepository.save(sala);
        cacheInvalidationService.evictSalasESalasRelacionadas(salva.getId());
        return salva;
    }

    @Transactional
    public SalaDeAula atualizarSala(Integer id, SalaDeAulaRequest request) {
        SalaDeAula sala = buscarPorId(id);
        sala.setNome(request.nome());
        sala.setSemestre(request.semestre());
        sala.setSegredoLider(request.segredoLider());
        SalaDeAula atualizada = salaRepository.save(sala);
        cacheInvalidationService.evictSalasESalasRelacionadas(atualizada.getId());
        return atualizada;
    }

    @Transactional
    public void deletarSala(Integer id) {
        if (!salaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Sala nao encontrada");
        }
        salaRepository.deleteById(id);
        cacheInvalidationService.evictSalasESalasRelacionadas(id);
    }

    @Transactional(readOnly = true)
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
