package br.com.senior.controle.external.config.security;

import br.com.senior.controle.external.config.security.model.CurrentUserInfo;
import br.com.senior.controle.lib.commom.CurrentUser;
import br.com.senior.controle.lib.security.model.UserInformation;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import static br.com.senior.controle.external.config.security.jwt.JwtAuthTokenFilter.SPRING_SECURITY_PREFIX;

@Component
public class CurrentUserProvider implements CurrentUser {

    private static CurrentUserInfo principle(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof CurrentUserInfo) {
            return (CurrentUserInfo)principal;
        }
        var i = new CurrentUserInfo(new UserInformation());
        return i;
    }

    @Override
    public Long id() {
        return principle().getUser().getId();
    }

    @Override
    public String username() {
        return principle().getUser().getUsername();
    }

    @Override
    public String email() {
        return principle().getUser().getEmail();
    }

    @Override
    public String nome() {
        return principle().getUser().getNome();
    }
}
