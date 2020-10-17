package br.com.senior.controle.business.application.auth.impl;

import br.com.senior.controle.business.application.security.commons.UserCacheManager;
import br.com.senior.controle.business.entity.security.QUsuario;
import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import br.com.senior.controle.lib.security.model.UserInformation;
import br.com.senior.controle.lib.security.model.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Iterator;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class UserService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional()
    @Cacheable(value = UserCacheManager.USER_KEY)
    public UserPrincipal find(Long id) {
        AtomicReference<UserPrincipal> model = new AtomicReference<>(null);
        usuarioRepository.findById(id).ifPresent(u -> {
            if (!u.isActive()) {
                return;
            }
            model.set(new UserPrincipal());
            model.get().setId(u.getId());
            model.get().setEmail(u.getEmail());
            model.get().setNome(u.getNome());
            model.get().setUsername(u.getUsername());
            model.get().setType(u.getTipoUsuario());
        });
        return model.get();
    }

    private static UserInformation build(Usuario user) {
        var p = new UserInformation();
        p.setId(user.getId());
        p.setNome(user.getNome());
        p.setUsername(user.getUsername());
        p.setEmail(user.getEmail());
        p.setType(user.getTipoUsuario());
        p.setAtivo(user.isActive());
        p.setPassword(user.getPassword());
        return p;
    }

    public UserInformation findByUsernameAndType(String username, TipoUsuarioEnum type){
        Iterator<Usuario> user = usuarioRepository.findAll(QUsuario.usuario.username.eq(username).and(QUsuario.usuario.tipoUsuario.eq(type))).iterator();
        if(user.hasNext()){
            return build(user.next());
        }
        return null;
    }

    public boolean exists(String username) {
        return usuarioRepository.exists(QUsuario.usuario.username.eq(username));
    }

    public Usuario save(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    public void save(UserPrincipal principle) {
        Usuario usuario = usuarioRepository.findByUsername(principle.getUsername());
        if (usuario == null) {
            usuario = new Usuario();
            usuario.setActive(true);
            usuario.setEmail(principle.getEmail());
            usuario.setUsername(principle.getUsername());
            usuario.setTipoUsuario(principle.getType());
        } else {
            principle.setEmail(usuario.getEmail());
            principle.setId(usuario.getId());
        }
        usuario.setNome(principle.getNome());
        var usr = usuarioRepository.save(usuario);
        principle.setId(usr.getId());
    }
}
