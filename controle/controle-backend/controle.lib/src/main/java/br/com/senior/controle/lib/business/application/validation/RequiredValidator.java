package br.com.senior.controle.lib.business.application.validation;

import br.com.senior.controle.lib.commom.Messages;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class RequiredValidator implements ConstraintValidator<Required, Object> {

    private Required constraint;
    private final Messages messages;

    @Autowired
    public RequiredValidator(Messages messages) {
        this.messages = messages;
    }

    @Override
    public void initialize(Required constraintAnnotation) {
        constraint = constraintAnnotation;
    }

    private static boolean checkSize(Object o){
        boolean isValid = true;
        if (o == null) {
            isValid = false;
        } else {
            if (o instanceof CharSequence) {
                var str = o.toString();
                isValid = !str.trim().isEmpty();
            }
        }
        return isValid;
    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext constraintContext) {
        boolean isValid = checkSize(o);
        if (!isValid) {
            String msg = messages.getMessage(constraint.message(), messages.getMessage(constraint.name()));
            constraintContext.disableDefaultConstraintViolation();
            constraintContext.buildConstraintViolationWithTemplate(msg).addConstraintViolation();
        }
        return isValid;
    }
}
