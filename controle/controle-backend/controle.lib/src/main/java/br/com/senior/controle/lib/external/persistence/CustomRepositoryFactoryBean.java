package br.com.senior.controle.lib.external.persistence;

import org.springframework.data.jpa.repository.support.JpaRepositoryFactoryBean;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.core.support.RepositoryFactorySupport;
import org.springframework.lang.NonNull;

import javax.persistence.EntityManager;

public class CustomRepositoryFactoryBean<T extends Repository<S, I>, S, I>
        extends JpaRepositoryFactoryBean<T, S, I> {

    public CustomRepositoryFactoryBean(Class<? extends T> repositoryInterface) {
        super(repositoryInterface);
    }

    @Override
    @NonNull
    protected RepositoryFactorySupport createRepositoryFactory(EntityManager entityManager) {
        return new CustomRepositoryFactory(entityManager);
    }
}