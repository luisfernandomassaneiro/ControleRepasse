package br.com.senior.controle.business.repository.security;

import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.lib.business.repository.EntityRepository;

public interface UsuarioRepository extends EntityRepository<Usuario, Long> {
    Usuario findByRecoveryCode(String recoveryCode);
    Usuario findByUsername(String username);
}
