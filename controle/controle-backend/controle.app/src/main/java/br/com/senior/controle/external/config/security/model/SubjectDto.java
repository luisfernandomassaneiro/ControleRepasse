package br.com.senior.controle.external.config.security.model;

import br.com.senior.controle.lib.security.model.UserPrincipal;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SubjectDto extends UserPrincipal {

    private String avatar;


    public SubjectDto(CurrentUserInfo model) {
        super(model.getUser());
    }
}
