package com.gerenciamento.copimais.service;

import com.gerenciamento.copimais.model.Servico;
import com.gerenciamento.copimais.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository repository;

    public List<Servico> listarTodos() {
        return repository.findAll();
    }

    public Servico salvar(Servico servico) {
        if (servico.getPreco().doubleValue() < 0) {
            throw new RuntimeException("O preço do serviço não pode ser negativo.");
        }
        return repository.save(servico);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
    
    public Servico buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
    }
}
