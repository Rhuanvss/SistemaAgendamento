package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Servico;
import com.dev.SistemaAgendamento.repository.ServicoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    public List<Servico> listarServicos() {
        return servicoRepository.findAll();
    }

    public Servico buscarPorId(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Serviço não encontrado com id: " + id));
    }

    public Servico salvarServico(Servico servico) {
        validarServico(servico);
        return servicoRepository.save(servico);
    }

    public void deletarServico(Long id) {
        if (!servicoRepository.existsById(id)) {
            throw new NoSuchElementException("Serviço não encontrado com id: " + id);
        }

        servicoRepository.deleteById(id);
    }

    private void validarServico(Servico servico) {
        if (servico.getNome() == null || servico.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do serviço é obrigatório.");
        }

        if (servico.getPreco() == null || servico.getPreco().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O preço do serviço deve ser maior que zero.");
        }

        if (servico.getDuracao() == null || servico.getDuracao() <= 0) {
            throw new IllegalArgumentException("A duração do serviço deve ser maior que zero.");
        }
    }
}

