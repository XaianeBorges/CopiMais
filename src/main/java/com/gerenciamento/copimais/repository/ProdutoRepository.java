package com.gerenciamento.copimais.repository;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gerenciamento.copimais.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByQuantidadeEstoqueLessThanEqual(Integer limite);

} 
