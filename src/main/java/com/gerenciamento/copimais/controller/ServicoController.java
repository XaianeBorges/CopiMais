package com.gerenciamento.copimais.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gerenciamento.copimais.model.Servico;
import com.gerenciamento.copimais.repository.ServicoRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicos")
@RequiredArgsConstructor
public class ServicoController {

    private final ServicoRepository repository;

    @GetMapping
    public List<Servico> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Servico salvar(@RequestBody Servico servico) {
        return repository.save(servico);
    }
}
