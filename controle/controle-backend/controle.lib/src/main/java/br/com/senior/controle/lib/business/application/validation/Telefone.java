package br.com.senior.controle.lib.business.application.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = TelefoneValidator.class)
public @interface Telefone {

    String message() default "general.validation.invalid_phone";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    @Target({FIELD, METHOD, PARAMETER, ANNOTATION_TYPE})
    @Retention(RUNTIME)
    @Documented
    @interface List {
        Telefone[] value();
    }
}
