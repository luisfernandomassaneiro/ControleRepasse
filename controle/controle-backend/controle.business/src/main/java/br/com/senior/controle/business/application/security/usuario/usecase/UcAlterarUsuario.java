package br.com.senior.controle.business.application.security.usuario.usecase;

import br.com.senior.controle.business.application.security.commons.UserCacheManager;
import br.com.senior.controle.business.application.security.usuario.UsuarioMapper;
import br.com.senior.controle.business.application.security.usuario.dto.UsuarioDto;
import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.entity.security.domain.SexoEnum;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import br.com.senior.controle.lib.business.application.validation.LazyValidation;
import br.com.senior.controle.lib.business.application.validation.Required;
import br.com.senior.controle.lib.business.application.validation.ValidString;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import br.com.senior.controle.lib.commom.settings.SecuritySettings;
import com.google.common.base.Strings;
import com.querydsl.core.types.Projections;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.constraints.AssertFalse;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Email;
import java.time.LocalDate;

import static br.com.senior.controle.business.entity.security.QUsuario.usuario;

@Getter
@Setter
public class UcAlterarUsuario extends IdentifiedUseCase<UsuarioDto, Long> {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private UserCacheManager cacheManager;
    @Autowired
    private SecuritySettings settings;

    @Required(name = "page.security.usuario.field.tipo")
    private TipoUsuarioEnum tipoUsuario;

    @ValidString(name = "page.security.usuario.field.username", required = true, maxSize = 50)
    private String username;

    @ValidString(name = "page.security.usuario.field.nome", maxSize = 250)
    private String nome;

    @Email
    @ValidString(name = "page.security.usuario.field.email", required = true, maxSize = 250)
    private String email;

    private SexoEnum sexo;

    private LocalDate nascimento;

    private String avatar;

    @AssertTrue(message = "page.security.usuario.validation.nome.required", groups = LazyValidation.class)
    public boolean isNomeValido() {
        Usuario user = repository.findOne(Projections.bean(Usuario.class, usuario.tipoUsuario), usuario.id.eq(getId()));
        if (user.getTipoUsuario() != TipoUsuarioEnum.LOCAL) {
            return true;
        }
        return !Strings.isNullOrEmpty(nome);
    }

    @AssertFalse(message = "page.security.usuario.email.unique", groups = LazyValidation.class)
    private boolean isemailUnique() {
        return repository.exists(usuario.email.eq(email).and(usuario.id.eq(getId()).not()));
    }

    @Override
    protected UsuarioDto execute() {
        Usuario entity = repository.require(getId());

        map(UsuarioMapper.class).updateUsuario(this, entity);

        if(settings.isAlterarTipoUsuario()) {
            entity.setUsername(username);
        }
        if(settings.isAlterarTipoUsuario()) {
            entity.setTipoUsuario(tipoUsuario);
        }
        if(entity.getTipoUsuario() == TipoUsuarioEnum.LOCAL){
            //O nome do usuário que não seja LOCAL é carregado pelo serviço de Origem no momento do login.
            entity.setNome(nome);
        }

        repository.save(entity);
        cacheManager.clear(getId());
        return map(UsuarioMapper.class).toUsuarioDto(entity);
    }
}
