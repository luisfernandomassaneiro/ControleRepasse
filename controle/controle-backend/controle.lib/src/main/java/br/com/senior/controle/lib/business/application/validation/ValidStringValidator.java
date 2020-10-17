package br.com.senior.controle.lib.business.application.validation;

import br.com.senior.controle.lib.commom.Messages;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class ValidStringValidator implements ConstraintValidator<ValidString, Object> {

    private ValidString constraint;
    private final Messages messages;

    @Autowired
    public ValidStringValidator(Messages messages) {
        this.messages = messages;
    }

    @Override
    public void initialize(ValidString constraintAnnotation) {
        constraint = constraintAnnotation;
    }

    private boolean checkMin(CharSequence o){
        if(o == null || constraint.minSize() <= 0){
            return true;
        }
        return o.length() >= constraint.minSize();
    }

    private boolean checkMax(CharSequence o){
        if(o == null || constraint.maxSize() <= 0){
            return true;
        }
        return o.length() <= constraint.maxSize();
    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext constraintContext) {

        String msg = null;

        if(o == null){
            if(constraint.required()){
                msg = messages.getMessage(constraint.message(), messages.getMessage(constraint.name()));
            }
        }else{

            if (!(o instanceof CharSequence)) {
                throw new IllegalArgumentException("A Annotation ValidString deve ser usada para String ou outras classes que implementem CharSequence");
            }

            CharSequence seq = (CharSequence)o;

            if (constraint.required() && seq.toString().trim().isEmpty()) {
                msg = messages.getMessage(constraint.message(), messages.getMessage(constraint.name()));
            }else if (!checkMax(seq)){
                msg = messages.getMessage(constraint.maxSizeMessage(), messages.getMessage(constraint.name(), constraint.maxSize()));
            }else if (!checkMin(seq)){
                msg = messages.getMessage(constraint.minSizeMessage(), messages.getMessage(constraint.name(), constraint.maxSize()));
            }
        }

        if(msg != null){
            constraintContext.disableDefaultConstraintViolation();
            constraintContext.buildConstraintViolationWithTemplate(msg).addConstraintViolation();
        }
        return msg == null;
    }
}
