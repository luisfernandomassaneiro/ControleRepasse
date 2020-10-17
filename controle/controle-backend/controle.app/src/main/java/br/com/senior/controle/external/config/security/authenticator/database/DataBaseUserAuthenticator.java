package br.com.senior.controle.external.config.security.authenticator.database;

import br.com.senior.controle.business.application.auth.impl.UserService;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import br.com.senior.controle.lib.security.IUserContext;
import br.com.senior.controle.lib.security.IUserAuthenticator;
import br.com.senior.controle.lib.security.model.UserInformation;
import br.com.senior.controle.lib.security.model.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class DataBaseUserAuthenticator implements IUserAuthenticator {

    @Value("${senior.security.enable_local:true}")
    private boolean enabled;

    private final UserService repository;
    private final PasswordEncoder encoder;
    private final IUserContext securityContext;

    @Autowired
    public DataBaseUserAuthenticator(UserService repository, PasswordEncoder encoder, IUserContext securityContext) {
        this.repository = repository;
        this.encoder = encoder;
        this.securityContext = securityContext;
    }

    @Override
    public UserPrincipal logon(String username, String password) {
        UserInformation user = repository.findByUsernameAndType(username, TipoUsuarioEnum.LOCAL);
        if (user == null) {
            return null;
        }
        if (!encoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("page.security.error.invalid_username");
        }
        return user;
    }

    @Override
    public int priority() {
        return 0;
    }

    @PostConstruct
    public void register() {
        if(enabled){
            securityContext.register(this);
        }
    }
}
