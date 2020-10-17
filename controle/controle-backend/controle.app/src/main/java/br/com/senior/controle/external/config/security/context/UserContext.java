package br.com.senior.controle.external.config.security.context;

import br.com.senior.controle.business.application.auth.impl.UserService;
import br.com.senior.controle.lib.security.IUserContext;
import br.com.senior.controle.lib.security.IUserAuthenticator;
import br.com.senior.controle.lib.security.model.UserPrincipal;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserContext implements IUserContext {

    private final List<IUserAuthenticator> auths = new ArrayList<>();
    private final UserService authService;

    public UserContext(UserService authService) {
        this.authService = authService;
    }

    private UserPrincipal logonOnAvalilableAuthenticators(String username, String password){
        //A Ordem de prioridade dos autenticadores é definida pelos próprios autenticadores.
        //1 - Local
        //2 - AD
        UserPrincipal principle = null;
        for (IUserAuthenticator iu : auths.stream().sorted(Comparator.comparingInt(IUserAuthenticator::priority)).collect(Collectors.toList())) {
            principle = iu.logon(username, password);
            if (principle != null) {
                break;
            }
        }
        return principle;
    }

    @Override
    public UserPrincipal logon(String username, String password) {
        UserPrincipal principle = logonOnAvalilableAuthenticators(username, password);
        if(principle == null){
            throw new BadCredentialsException("page.security.error.invalid_username");
        }
        if (!principle.isAtivo()) {
            throw new BadCredentialsException("page.security.error.inactive_user");
        }
        return principle;
    }

    @Override
    public UserPrincipal find(Long id) {
        return authService.find(id);
    }

    @Override
    public void register(IUserAuthenticator authenticator) {
        auths.add(authenticator);
    }
}
