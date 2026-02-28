package com.gerenciamento.copimais.service;

import com.gerenciamento.copimais.dtos.ServicoRequestDTO;
import com.gerenciamento.copimais.dtos.ServicoResponseDTO;
import com.gerenciamento.copimais.model.Servico;
import com.gerenciamento.copimais.repository.ServicoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository repository;

    public List<ServicoResponseDTO> listarTodosAtivos() {
        return repository.findAll().stream()
                .filter(Servico::getAtivo)
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ServicoResponseDTO salvar(ServicoRequestDTO dto) {
        Servico s = new Servico();
        s.setNome(dto.nome());
        s.setDescricao(dto.descricao());
        s.setPreco(dto.preco());
        s.setPrecoCusto(dto.precoCusto());
        s.setAtivo(true);
        return mapToResponse(repository.save(s));
    }

    @Transactional
    public void deletarLogico(Long id) {
        Servico s = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        s.setAtivo(false); 
        repository.save(s);
    }

    private ServicoResponseDTO mapToResponse(Servico s) {
        return new ServicoResponseDTO(s.getId(), s.getNome(), s.getDescricao(), s.getPreco(), s.getPrecoCusto(), s.getAtivo());
    }
}
