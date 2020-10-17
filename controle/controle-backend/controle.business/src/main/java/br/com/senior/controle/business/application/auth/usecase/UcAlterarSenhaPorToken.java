package br.com.senior.controle.business.application.auth.usecase;

import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.commom.exceptions.BusinessException;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import br.com.senior.controle.lib.business.application.validation.ValidString;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

public class UcAlterarSenhaPorToken extends UseCase<Void> {

    @Setter
    @ValidString(name = "page.security.auth.field.token", required = true)
    private String recoveryToken;

    @Setter
    @ValidString(name = "page.security.auth.field.password", required = true)
    private String novaSenha;

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    protected Void execute() {
        Usuario u = repository.findByRecoveryCode(recoveryToken);
        if (u == null || !u.isActive()) {
            throw new BusinessException("page.security.auth.password_recovery.error.expired_token");
        }
        if (u.getRecoveryExpiration().isBefore(LocalDateTime.now())) {
            throw new BusinessException("page.security.auth.password_recovery.error.expired_token");
        }
        u.setPassword(passwordEncoder.encode(novaSenha));
        u.setRecoveryCode(null);
        repository.save(u);
        return null;
    }
}
