package br.com.senior.controle.lib.commom.settings;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties("senior.security")
public class SecuritySettings {
    private String jwtSecret;
    private boolean enableAd;
    private boolean enableLocal;
    private boolean useContext;
    private boolean alterarUsername;
    private boolean alterarTipoUsuario;
}
