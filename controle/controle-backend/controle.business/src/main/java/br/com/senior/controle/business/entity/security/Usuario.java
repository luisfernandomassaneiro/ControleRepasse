package br.com.senior.controle.business.entity.security;

import br.com.senior.controle.business.entity.security.domain.SexoEnum;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import br.com.senior.controle.lib.generator.annotations.GenHint;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.engine.spi.PersistentAttributeInterceptable;
import org.hibernate.engine.spi.PersistentAttributeInterceptor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "usuario")
public class Usuario implements PersistentAttributeInterceptable {

    @Transient
    private PersistentAttributeInterceptor interceptor;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @GenHint(listing = true)
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    @GenHint(label = true, listing = true)
    @Column(name = "nome", length = 250)
    private String nome;

    @GenHint(listing = true)
    @Column(name = "email", length = 250, unique = true, nullable = false)
    private String email;

    @GenHint(ignore = true)
    @Column(name = "password", length = 100)
    private String password;

    @Column(name = "ativo")
    @ColumnDefault("true")
    private boolean active;

    @GenHint(ignore = true)
    @Column(name = "recovery_code")
    private String recoveryCode;

    @GenHint(ignore = true)
    @Column(name = "recovery_expiration")
    private LocalDateTime recoveryExpiration;

    @Column(name = "sexo")
    @Enumerated(EnumType.STRING)
    private SexoEnum sexo;

    @Column(name = "nascimento")
    private LocalDate nascimento;

    @Column(name = "tipo", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoUsuarioEnum tipoUsuario;

    @Column(name = "avatar")
    @Basic(fetch = FetchType.LAZY)
    private String avatar;

    public String getAvatar() {
        if (interceptor != null) {
            return (String) interceptor.readObject(this, "avatar", avatar);
        }
        return avatar;
    }

    public void setAvatar(String avatar) {
        if (interceptor != null) {
            var av = interceptor.writeObject(this, "avatar", this.avatar, avatar);
            this.avatar = av == null ? null : av.toString();
            return;
        }
        this.avatar = avatar;
    }

    @Override
    public PersistentAttributeInterceptor $$_hibernate_getInterceptor() {
        return interceptor;
    }

    @Override
    public void $$_hibernate_setInterceptor(PersistentAttributeInterceptor interceptor) {
        this.interceptor = interceptor;
    }
}
