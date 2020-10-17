package br.com.senior.controle.business.application.auth.usecase;

import br.com.senior.controle.business.application.auth.dto.ValidadeTokenDto;
import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

public class UcVerficarToken extends UseCase<ValidadeTokenDto> {

    @Autowired
    private UsuarioRepository repository;
    private final String token;

    public UcVerficarToken(String token) {
        this.token = token;
    }

    @Override
    protected ValidadeTokenDto execute() {
        Usuario u = repository.findByRecoveryCode(token);
        ValidadeTokenDto validade = new ValidadeTokenDto();
        if (u == null || !u.isActive()) {
            return validade;
        }
        validade.setExpiracao(u.getRecoveryExpiration());
        if (u.getRecoveryExpiration().isBefore(LocalDateTime.now())) {
            return validade;
        }
        validade.setValido(true);
        return validade;
    }
}
