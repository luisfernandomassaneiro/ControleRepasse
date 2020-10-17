package br.com.senior.controle.external.api.security.dominio;

import br.com.senior.controle.business.application.security.dominio.UcObterDominioTipoUsuario;
import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TipoUsuarioDominioController {

    private final UseCaseFacade facade;

    @Autowired
    public TipoUsuarioDominioController(UseCaseFacade facade) {
        this.facade = facade;
    }

    @GetMapping(value = "/api/dominio/tipo-usuario")
    public List<String> tipoUsuario() {
        return facade.execute(new UcObterDominioTipoUsuario());
    }
}
