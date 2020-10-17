package br.com.senior.controle.generator;

import br.com.senior.dexter.gerador.EntryPoint;
import br.com.senior.controle.lib.generator.annotations.GenHint;
import com.openpojo.reflection.PojoField;
import lombok.SneakyThrows;

import java.util.HashMap;
import java.util.Map;

public class GeradorMain {

    private static Map<String, Object> map(PojoField pojoField) {
        var hint = pojoField.getAnnotation(GenHint.class);
        Map<String, Object> ms = new HashMap<>();
        if(hint != null) {
            ms.put("ignore", hint.ignore());
            ms.put("label", hint.label());
            ms.put("listing", hint.listing());
            ms.put("type", hint.type().toString());
        }
        return ms;
    }

    @SneakyThrows
    public static void main(String[] args) {
        EntryPoint.show(GeradorMain::map);
    }
}
