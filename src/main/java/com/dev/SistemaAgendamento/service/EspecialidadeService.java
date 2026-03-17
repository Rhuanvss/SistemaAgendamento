package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.repository.EspecialidadeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EspecialidadeService {

    private final EspecialidadeRepository especialidadeRepository;

    public EspecialidadeService(EspecialidadeRepository especialidadeRepository) {
        this.especialidadeRepository = especialidadeRepository;
    }

    public List<Especialidade> listarEspecialidades() {
        return especialidadeRepository.findAll();
    }

    public Especialidade buscarPorId(Long id) {
        return especialidadeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Especialidade não encontrada com id: " + id));
    }

    public Especialidade salvarEspecialidade(Especialidade especialidade) {
        validarEspecialidade(especialidade);
        return especialidadeRepository.save(especialidade);
    }

    public void deletarEspecialidade(Long id) {
        if (!especialidadeRepository.existsById(id)) {
            throw new NoSuchElementException("Especialidade não encontrada com id: " + id);
        }

        especialidadeRepository.deleteById(id);
    }

    private void validarEspecialidade(Especialidade especialidade) {
        if (especialidade.getNome() == null || especialidade.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da especialidade é obrigatório.");
        }

        if (especialidade.getPreco() == null || especialidade.getPreco().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O preço da especialidade deve ser maior que zero.");
        }

        if (especialidade.getDuracao() == null || especialidade.getDuracao() <= 0) {
            throw new IllegalArgumentException("A duração da especialidade deve ser maior que zero.");
        }
    }
}
