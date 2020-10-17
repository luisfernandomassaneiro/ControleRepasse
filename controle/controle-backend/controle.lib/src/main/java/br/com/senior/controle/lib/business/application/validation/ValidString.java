package br.com.senior.controle.lib.business.application.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = ValidStringValidator.class)
@Documented
public @interface ValidString {

    String message() default "general.validation.required_field";
    String minSizeMessage() default "general.validation.max_size";
    String maxSizeMessage() default "general.validation.max_size";
    String name();

    boolean required() default false;
    int maxSize() default 0;
    int minSize() default 0;

    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };

    @Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
    @Retention(RUNTIME)
    @Documented
    @interface List {
        ValidString[] value();
    }
}