package br.com.senior.controle.business.application.security.usuario.dto;

import lombok.Data;

@Data
public class UsuarioResumoDto {
    private Long id;
    private String username;
    private String nome;
    private String email;
    private boolean active;
}
