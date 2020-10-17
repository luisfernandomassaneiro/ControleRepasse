package br.com.senior.controle.external.config;

import br.com.senior.controle.lib.commom.settings.ApplicationSettings;
import br.com.senior.controle.lib.commom.settings.SecuritySettings;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/application")
public class SettingsController {

    @Data
    private static class ApplicationSettingsDto {
        private String appName;
        private String hashKey;
        private boolean enableAd;
        private boolean enableLocal;
        private boolean alterarUsername;
        private boolean alterarTipoUsuario;
    }

    @Autowired
    private ApplicationSettings settings;
    @Autowired
    private SecuritySettings securitySettings;

    @GetMapping("settings")
    public SettingsController.ApplicationSettingsDto getSettings() {
        var set = new SettingsController.ApplicationSettingsDto();
        set.setAppName(settings.getName());
        set.setHashKey(settings.getHashSalt());
        set.setAlterarTipoUsuario(securitySettings.isAlterarTipoUsuario());
        set.setAlterarUsername(securitySettings.isAlterarUsername());
        set.setEnableAd(securitySettings.isEnableAd());
        set.setEnableLocal(securitySettings.isEnableLocal());
        return set;
    }
}
