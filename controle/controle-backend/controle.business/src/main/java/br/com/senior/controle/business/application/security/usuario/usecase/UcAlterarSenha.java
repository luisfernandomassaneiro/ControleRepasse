package br.com.senior.controle.business.application.security.usuario.usecase;

import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.commom.exceptions.BusinessException;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import br.com.senior.controle.lib.business.application.validation.ValidString;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UcAlterarSenha extends UseCase<Void> {

	@Autowired
	private UsuarioRepository repository;

	@Autowired
	private PasswordEncoder encoder;

	@Setter
	@ValidString(name = "page.security.auth.field.old_password")
	private String senhaAtual;

	@Setter
	@ValidString(name = "page.security.auth.field.new_password", required = true)
	private String novaSenha;

	@Override
	protected Void execute() {
		Usuario user = repository.require(currentUser.id());
		if (!encoder.matches(senhaAtual, user.getPassword())) {
			throw new BusinessException("page.security.error.password_not_matching");
		}
		user.setPassword(encoder.encode(novaSenha));
		repository.save(user);
		return null;
	}
}
