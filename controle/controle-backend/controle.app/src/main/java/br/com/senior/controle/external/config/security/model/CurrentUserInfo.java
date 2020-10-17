package br.com.senior.controle.external.config.security.model;

import br.com.senior.controle.lib.security.model.UserPrincipal;
import lombok.Data;

import java.util.List;

@Data
public class CurrentUserInfo {
    private final UserPrincipal user;
}
