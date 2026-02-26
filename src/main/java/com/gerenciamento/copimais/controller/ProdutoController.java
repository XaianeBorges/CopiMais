package com.gerenciamento.copimais.controller;

import com.gerenciamento.copimais.model.Produto;
import com.gerenciamento.copimais.service.ProdutoService;
import com.gerenciamento.copimais.config.UsuarioSessao;
import com.gerenciamento.copimais.dtos.ProdutoRequestDTO;
import com.gerenciamento.copimais.dtos.ProdutoResponseDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;
    private final UsuarioSessao sessao;

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listar() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody ProdutoRequestDTO dto) {
        if (!sessao.isLogado()) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(produtoService.salvar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody ProdutoRequestDTO dto) {
        if (!sessao.isLogado()) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!sessao.isLogado()) return ResponseEntity.status(403).build();
        produtoService.deletarLogico(id);
        return ResponseEntity.noContent().build();
    }
}