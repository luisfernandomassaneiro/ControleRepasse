package br.com.senior.controle.external.api.security.dominio;

import br.com.senior.controle.business.application.security.dominio.UcObterDominioUsuarios;
import br.com.senior.controle.business.application.security.usuario.dto.UsuarioResumoDto;
import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
public class UsuarioDominioController {

    private final UseCaseFacade facade;

    @Autowired
    public UsuarioDominioController(UseCaseFacade facade) {
        this.facade = facade;
    }

    @GetMapping(value = "/api/dominio/usuarios")
    public Collection<UsuarioResumoDto> all() {
        return facade.execute(new UcObterDominioUsuarios().paged(false)).getItens();
    }

    @GetMapping(value = "/api/dominio/usuarios/paged")
    public ListaPaginada<UsuarioResumoDto> paged(UcObterDominioUsuarios uc) {
        return facade.execute(uc.paged(true));
    }
}
