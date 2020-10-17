package br.com.senior.controle.lib.business.repository;

import br.com.senior.controle.lib.business.application.commom.exceptions.EntityNotFoundException;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

@NoRepositoryBean
public interface QueryRepository<T, TID> extends PagingAndSortingRepository<T, TID>,
        QuerydslPredicateExecutor<T>, ProjectionRepository<T, TID> {

    default T require(TID id){
        Optional<T> registro = findById(id);
        if(!registro.isPresent()){
            throw new EntityNotFoundException(id);
        }
        return registro.get();
    }
}