
package br.com.senior.controle.external.api.security;

import br.com.senior.controle.business.application.security.usuario.dto.UsuarioDto;
import br.com.senior.controle.business.application.security.usuario.dto.UsuarioResumoDto;
import br.com.senior.controle.business.application.security.usuario.usecase.*;
import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/usuario")
public class UsuarioController {

    private final UseCaseFacade facade;

    @Autowired
    public UsuarioController(UseCaseFacade facade) { this.facade = facade; }

    @GetMapping
    public ListaPaginada<UsuarioResumoDto> listar(UcListarUsuario filtro) { return facade.execute(filtro); }

    @GetMapping("/{id}")
    public UsuarioDto obter(@PathVariable Long id) {
        return facade.execute(new UcObterUsuario().withId(id));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        facade.execute(new UcExcluirUsuario().withId(id));
    }

    @PostMapping
    public UsuarioDto incluir(@RequestBody UcIncluirUsuario uc) {
        return facade.execute(uc);
    }

    @PostMapping("/{id}")
    public UsuarioDto alterar(@RequestBody UcAlterarUsuario uc, @PathVariable Long id) {
        return facade.execute(uc.withId(id));
    }

    @PutMapping("/{id}/activation")
    public void manterAtivacao(@RequestParam(name = "state") boolean state, @PathVariable Long id) {
        facade.execute(new UcManterAtivacaoUsuario(state).withId(id));
    }
}
