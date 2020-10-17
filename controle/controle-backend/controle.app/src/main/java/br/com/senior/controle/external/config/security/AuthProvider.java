package br.com.senior.controle.external.config.security;

import br.com.senior.controle.external.config.security.model.CurrentUserInfo;
import br.com.senior.controle.lib.business.application.commom.exceptions.BusinessException;
import br.com.senior.controle.lib.security.IUserContext;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthProvider implements AuthenticationProvider {

    @Autowired
    private IUserContext securityContext;
    

    @Override
    public Authentication authenticate(Authentication authentication) {
        String username = (String) authentication.getPrincipal();

        String password = (String) authentication.getCredentials();

        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            throw new BadCredentialsException("page.security.error.required_fields");
        }

        var user = new CurrentUserInfo(securityContext.logon(username, password));
        List<GrantedAuthority> auth = null;
        return new UsernamePasswordAuthenticationToken(user, password, auth);
    }

    @Override
    public boolean supports(Class<?> type) {
        return UsernamePasswordAuthenticationToken.class.equals(type);
    }
}
