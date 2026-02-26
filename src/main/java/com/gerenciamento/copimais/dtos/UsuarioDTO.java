package com.gerenciamento.copimais.dtos;

public class UsuarioDTO {

public record LoginRequest(String username, String password) {}

public record UsuarioResponse(Long id, String username, Boolean ativo) {}

public record UsuarioCreateRequest(String username, String senha, Boolean ativo) {}

public record AlterarSenhaRequest(String senhaAntiga, String senhaNova) {}

}
