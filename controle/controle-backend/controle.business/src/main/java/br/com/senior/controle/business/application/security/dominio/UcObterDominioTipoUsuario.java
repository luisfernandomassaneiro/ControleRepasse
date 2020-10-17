package br.com.senior.controle.business.application.security.dominio;

import br.com.senior.controle.lib.business.application.usecase.UseCase;
import br.com.senior.controle.lib.business.domain.TipoUsuarioEnum;
import br.com.senior.controle.lib.commom.settings.SecuritySettings;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

public class UcObterDominioTipoUsuario extends UseCase<List<String>> {

    @Autowired
    private SecuritySettings securitySettings;

    @Override
    protected List<String> execute() {
        List<String> lst = new ArrayList<>();
        if(securitySettings.isEnableAd()){
            lst.add(TipoUsuarioEnum.AD.toString());
        }
        if(securitySettings.isEnableLocal()){
            lst.add(TipoUsuarioEnum.LOCAL.toString());
        }
        return lst;
    }
}
