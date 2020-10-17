package br.com.senior.controle.business.application.security.usuario.usecase;

import br.com.senior.controle.business.application.security.commons.UserCacheManager;
import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import br.com.senior.controle.lib.business.application.validation.LazyValidation;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.constraints.AssertFalse;

@Setter
public class UcManterAtivacaoUsuario extends IdentifiedUseCase<Void, Long> {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private UserCacheManager cacheManager;

    private final boolean active;

    public UcManterAtivacaoUsuario(boolean active) {
        this.active = active;
    }

    @AssertFalse(groups = LazyValidation.class, message = "page.security.usuario.reactivate_error.logged_user")
    public boolean isCurrentUser() {
        return getId().equals(currentUser.id());
    }

    @Override
    protected Void execute() {
        Usuario usuario = repository.require(getId());
        usuario.setActive(active);
        repository.save(usuario);
        cacheManager.clear(getId());
        return null;
    }
}
