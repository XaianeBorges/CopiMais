package com.gerenciamento.copimais.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gerenciamento.copimais.model.Usuario;

@Repository

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {


}
