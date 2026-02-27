package com.gerenciamento.copimais.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.gerenciamento.copimais.model.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByDataVendaBetween(LocalDateTime inicio, LocalDateTime fim);
    List<Venda> findAllByOrderByDataVendaDesc();
   
}