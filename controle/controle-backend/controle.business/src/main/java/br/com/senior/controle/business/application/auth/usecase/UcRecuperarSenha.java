package br.com.senior.controle.business.application.auth.usecase;

import br.com.senior.controle.business.application.auth.dto.ValidadeTokenDto;
import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import br.com.senior.controle.lib.business.application.validation.ValidString;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import br.com.senior.controle.lib.commom.Messages;
import br.com.senior.controle.lib.commom.mail.EmailService;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class UcRecuperarSenha extends UseCase<ValidadeTokenDto> {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private Messages messages;

    @Setter
    @ValidString(name = "page.security.auth.field.username", required = true)
    private String username;

    @Override
    protected ValidadeTokenDto execute() {
        Usuario u = repository.findByUsername(username);
        if (u == null) {
            return new ValidadeTokenDto(null, false, messages.getMessage("page.security.error.user_not_found"));
        }
        if (!u.isActive()) {
            return new ValidadeTokenDto(null, false, messages.getMessage("page.security.error.inactive_user"));
        }

        if(u.getTipoUsuario() != TipoUsuarioEnum.LOCAL) {
            return new ValidadeTokenDto(null, false, messages.getMessage("page.security.password_recovery.error.not_local_user"));
        }

        u.setRecoveryCode(UUID.randomUUID().toString());
        u.setRecoveryExpiration(LocalDateTime.now().plus(24, ChronoUnit.HOURS));
        repository.save(u);

        Map<String, Object> data = new HashMap<>();
        data.put("recovery_token", u.getRecoveryCode());
        data.put("expiration_date", u.getRecoveryExpiration());
        data.put("user_name", u.getNome().split(" ")[0]);
        emailService.builder()
                .template("password-recovery", data)
                .subject(messages.getMessage("page.security.auth.password_recovery.message.email_subject"))
                .to(u.getEmail())
                .send();
        return new ValidadeTokenDto(u.getRecoveryExpiration(), true, null);
    }
}
