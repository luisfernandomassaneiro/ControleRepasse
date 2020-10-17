package br.com.senior.controle.lib.security;

import br.com.senior.controle.lib.security.model.UserPrincipal;

/**
 * Interface do Componente de Autenticação do usuário. Pode ser substituído por um autenticador de AD ou qualquer outro tipo de autenticador.
 */
public interface IUserAuthenticator {
    UserPrincipal logon(String username, String password);
    int priority();
}
