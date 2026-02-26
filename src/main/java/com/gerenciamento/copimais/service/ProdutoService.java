package com.gerenciamento.copimais.service;

import com.gerenciamento.copimais.dtos.ProdutoRequestDTO;
import com.gerenciamento.copimais.dtos.ProdutoResponseDTO;
import com.gerenciamento.copimais.model.Produto;
import com.gerenciamento.copimais.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;

    public List<ProdutoResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .filter(Produto::getAtivo) 
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
        return mapToResponse(produto);
    }

    @Transactional
    public ProdutoResponseDTO salvar(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        mapToEntity(produto, dto);
        produto.setAtivo(true);
        
        Produto salvo = repository.save(produto);
        return mapToResponse(salvo);
    }

    @Transactional
    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        
        mapToEntity(produto, dto);
        return mapToResponse(repository.save(produto));
    }

    @Transactional
    public void deletarLogico(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produto.setAtivo(false); 
        repository.save(produto);
    }

    private void mapToEntity(Produto entity, ProdutoRequestDTO dto) {
        entity.setNome(dto.nome());
        entity.setDescricao(dto.descricao());
        entity.setPrecoCompra(dto.precoCompra());
        entity.setPrecoVenda(dto.precoVenda());
        entity.setQuantidadeEstoque(dto.quantidadeEstoque());
    }

    private ProdutoResponseDTO mapToResponse(Produto p) {
        return new ProdutoResponseDTO(
            p.getId(), p.getNome(), p.getDescricao(), 
            p.getPrecoCompra(), p.getPrecoVenda(), 
            p.getQuantidadeEstoque(), p.getAtivo()
        );
    }
}