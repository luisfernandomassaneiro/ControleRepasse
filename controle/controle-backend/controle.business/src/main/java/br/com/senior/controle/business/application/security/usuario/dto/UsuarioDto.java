package br.com.senior.controle.business.application.security.usuario.dto;

import br.com.senior.controle.business.entity.security.domain.SexoEnum;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UsuarioDto {
    private Long id;
    private String username;
    private String nome;
    private String email;
    private boolean active;
    private SexoEnum sexo;
    private LocalDate nascimento;
    private TipoUsuarioEnum tipoUsuario;
    private String avatar;
}
