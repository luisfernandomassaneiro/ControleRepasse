package br.com.senior.controle.lib.commom.settings;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties("senior.app")
public class ApplicationSettings {
    private String url;
    private String name;
    private String hashSalt = "senior";
}
