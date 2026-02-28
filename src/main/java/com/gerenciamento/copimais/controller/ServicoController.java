package com.gerenciamento.copimais.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gerenciamento.copimais.config.UsuarioSessao;
import com.gerenciamento.copimais.dtos.ServicoRequestDTO;
import com.gerenciamento.copimais.dtos.ServicoResponseDTO;
import com.gerenciamento.copimais.service.ServicoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicos")
@RequiredArgsConstructor
public class ServicoController {

    private final ServicoService service;
    private final UsuarioSessao sessao;

    @GetMapping
    public ResponseEntity<List<ServicoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodosAtivos());
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody ServicoRequestDTO dto) {
        if (!sessao.isLogado()) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.salvar(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!sessao.isLogado()) return ResponseEntity.status(403).build();
        service.deletarLogico(id);
        return ResponseEntity.noContent().build();
    }
}
