package br.com.senior.controle.lib.security;

import br.com.senior.controle.lib.security.model.UserPrincipal;

public interface IUserContext {
    UserPrincipal logon(String username, String password);
    UserPrincipal find(Long token);
    void register(IUserAuthenticator authenticator);
}
