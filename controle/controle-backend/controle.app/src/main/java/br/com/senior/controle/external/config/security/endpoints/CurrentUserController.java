package br.com.senior.controle.external.config.security.endpoints;

import br.com.senior.controle.business.application.security.usuario.dto.UsuarioDto;
import br.com.senior.controle.business.application.security.usuario.usecase.UcAlterarSenha;
import br.com.senior.controle.business.application.security.usuario.usecase.UcAlterarUsuario;
import br.com.senior.controle.business.application.security.usuario.usecase.UcObterUsuario;
import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import br.com.senior.controle.lib.commom.CurrentUser;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/current")
public class CurrentUserController {

    private final CurrentUser currentUser;
    private final UseCaseFacade useCaseFacade;

    public CurrentUserController(CurrentUser currentUser, UseCaseFacade useCaseFacade) {
        this.currentUser = currentUser;
        this.useCaseFacade = useCaseFacade;
    }

    @GetMapping("/user")
    public UsuarioDto getUser() {
        return useCaseFacade.execute(new UcObterUsuario().withId(currentUser.id()));
    }

    @PostMapping("/user")
    public UsuarioDto saveUser(@RequestBody UcAlterarUsuario uc) {
        return useCaseFacade.execute(uc.withId(currentUser.id()));
    }

    @PostMapping("/password")
    public void redefinirSenha(@RequestBody UcAlterarSenha uc) {
        useCaseFacade.execute(uc);
    }
}
