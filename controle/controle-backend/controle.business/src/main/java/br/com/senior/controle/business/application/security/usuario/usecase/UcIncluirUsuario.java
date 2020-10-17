package br.com.senior.controle.business.application.security.usuario.usecase;

import br.com.senior.controle.business.application.security.usuario.UsuarioMapper;
import br.com.senior.controle.business.application.security.usuario.dto.UsuarioDto;
import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.entity.security.domain.SexoEnum;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import br.com.senior.controle.lib.business.application.validation.LazyValidation;
import br.com.senior.controle.lib.business.application.validation.Required;
import br.com.senior.controle.lib.business.application.validation.ValidString;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import br.com.senior.controle.lib.commom.Messages;
import br.com.senior.controle.lib.commom.mail.EmailService;
import br.com.senior.controle.lib.commom.settings.ApplicationSettings;
import com.google.common.base.Strings;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.validation.constraints.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static br.com.senior.controle.business.entity.security.QUsuario.usuario;

@Getter
@Setter
public class UcIncluirUsuario extends UseCase<UsuarioDto> {

    private static final String EMAIL_TAG = "temporary_password";

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private Messages messages;
    @Autowired
    private ApplicationSettings settings;
    @Autowired
    private PasswordEncoder encoder;

    @Required(name = "page.security.usuario.field.tipo")
    private TipoUsuarioEnum tipoUsuario;

    @ValidString(name = "page.security.usuario.field.username", maxSize = 50, required = true)
    private String username;

    @ValidString(name = "page.security.usuario.field.nome", maxSize = 250)
    private String nome;

    @Email
    @ValidString(name = "page.security.usuario.field.email", maxSize = 250, required = true)
    private String email;

    @AssertFalse(message = "page.security.usuario.email.unique", groups = LazyValidation.class)
    private boolean isEmailUnique() {
        return repository.exists(usuario.email.eq(email));
    }

    @AssertFalse(message = "page.security.usuario.username.unique", groups = LazyValidation.class)
    private boolean isUsernameUnique() {
        return repository.exists(usuario.username.eq(username));
    }

    @AssertTrue(message = "page.security.usuario.validation.nome.required", groups = LazyValidation.class)
    public boolean isNomeValido() {
        if (tipoUsuario != TipoUsuarioEnum.LOCAL) {
            return true;
        }
        return !Strings.isNullOrEmpty(nome);
    }

    private boolean active;

    private SexoEnum sexo;

    private LocalDate nascimento;

    private String avatar;

    @Override
    protected UsuarioDto execute() {
        Usuario u = map(UsuarioMapper.class).toUsuario(this);
        String tmpPassword = UUID.randomUUID().toString();
        u.setPassword(encoder.encode(tmpPassword));
        repository.save(u);

        Map<String, Object> data = new HashMap<>();
        if (u.getNome() != null) {
            data.put("name", u.getNome().split(" ")[0]);
        } else {
            data.put("name", u.getUsername());
        }
        data.put("username", u.getUsername());
        data.put("app_name", settings.getName());

        switch (tipoUsuario) {
            case LOCAL:
                data.put(EMAIL_TAG, tmpPassword);
                break;
            case AD:
                data.put(EMAIL_TAG, messages.getMessage("page.security.usuario.add.network_password"));
                break;
            default:
                data.put(EMAIL_TAG, "Consulte o administrador");
                break;
        }

        emailService.builder()
                .to(u.getEmail())
                .subject(messages.getMessage("page.security.usuario.add.email.subject", settings.getName()))
                .template("user-created", data)
                .send();

        return map(UsuarioMapper.class).toUsuarioDto(u);
    }
}