package br.com.senior.controle.lib.business.application.usecase;

import br.com.senior.controle.lib.business.application.commom.exceptions.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
public class UseCaseFacade {

    private final Validator validator;
    private final AutowireCapableBeanFactory beanFactory;

    @Autowired
    public UseCaseFacade(Validator validator, BeanFactory beanFactory) {
        this.validator = validator;
        this.beanFactory = (AutowireCapableBeanFactory) beanFactory;
    }

    @Transactional
    public <T> T execute(UseCase<T> usecase) {
        beanFactory.autowireBean(usecase);
        try{
            validate(usecase);
            return executeAndHandleExceptions(usecase);
        } finally {
            beanFactory.destroyBean(usecase);
        }
    }

    private static <T> T executeAndHandleExceptions(UseCase<T> prepared) {
        try {
            return prepared.execute();
        } catch (ConstraintViolationException ex) {
            throw new BusinessException(new HashSet<>(ex.getConstraintViolations()), ex);
        }
    }

    protected void validate(Object usecase) {
        Set<ConstraintViolation<Object>> violations = validator.validate(usecase,
                ValidationOrder.class);
        if (!violations.isEmpty()) {
            throw new BusinessException(new HashSet<>(violations));
        }
    }
}
