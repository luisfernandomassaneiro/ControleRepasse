
package br.com.senior.controle.business.application.security.usuario.usecase;

import br.com.senior.controle.business.application.security.commons.UserCacheManager;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import br.com.senior.controle.lib.business.application.validation.LazyValidation;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.constraints.AssertFalse;

public class UcExcluirUsuario extends IdentifiedUseCase<Void, Long> {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private UserCacheManager cacheManager;

    @AssertFalse(message = "page.security.usuario.delete_error.logged_user", groups = LazyValidation.class)
    private boolean isCurrentUser() {
        return currentUser.id().equals(getId());
    }

    @Override
    protected Void execute() {
        cacheManager.clear(getId());
        repository.deleteById(getId());
        return null;
    }
}