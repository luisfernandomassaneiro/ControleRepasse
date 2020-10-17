package br.com.senior.controle.lib.business.application.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class TelefoneValidator implements ConstraintValidator<Telefone, String> {

    private static final Pattern regex = Pattern.compile("\\(\\d\\d\\) \\d\\d\\d\\d\\d\\-\\d\\d\\d\\d");

    @Override
    public boolean isValid(String object, ConstraintValidatorContext constraintValidatorContext) {
        return object == null || regex.matcher(object).matches();
    }
}
