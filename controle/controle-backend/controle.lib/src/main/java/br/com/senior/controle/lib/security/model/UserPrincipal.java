package br.com.senior.controle.lib.security.model;

import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public class UserPrincipal implements Serializable {

    private Long id;
    private String nome;
    private String username;
    private String email;
    private TipoUsuarioEnum type;
    private boolean ativo;

    public UserPrincipal(UserPrincipal source){
        id = source.getId();
        nome = source.getNome();
        username = source.getUsername();
        email = source.getEmail();
        type = source.getType();
        this.ativo = source.ativo;
    }
}