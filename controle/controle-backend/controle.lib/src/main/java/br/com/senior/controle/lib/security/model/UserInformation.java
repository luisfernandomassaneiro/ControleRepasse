package br.com.senior.controle.lib.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
public class UserInformation extends UserPrincipal {

    @JsonIgnore
    private String password;
}
