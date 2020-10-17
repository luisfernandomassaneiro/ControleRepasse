package br.com.senior.controle.lib.business.application.usecase;

import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import br.com.senior.controle.lib.business.repository.ProjectionRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.FactoryExpression;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.QBean;
import com.querydsl.core.types.dsl.StringPath;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import static br.com.senior.controle.lib.business.application.commom.QueryDslExpressionUtils.nullSafeContainsIgnoreCase;

@Setter
public abstract class UseCaseDominio<T, TID, TR extends ProjectionRepository<?, TID>> extends UseCase<ListaPaginada<T>> {

    private static final int DEFAULT_PAGE_SIZE = 250;

    @Autowired
    @SuppressWarnings("SpringJavaAutowiredMembersInspection")
    private TR repository;

    protected int pageSize = DEFAULT_PAGE_SIZE;
    protected int pageIndex;
    protected String search;
    protected boolean paged;

    public UseCaseDominio<T, TID, TR> paged(boolean paged) {
        this.paged = paged;
        return this;
    }

    protected ListaPaginada<T> query(Path<TID> id, StringPath label, Class<T> tClass) {
        return query(null, id, label, tClass);
    }

    protected ListaPaginada<T> query(BooleanBuilder filtro, Path<TID> id, StringPath label, Class<T> tClass) {
        QBean<T> projection = Projections.bean(tClass, id, label);
        return query(filtro, projection, label);
    }

    protected ListaPaginada<T> query(BooleanBuilder filtro, FactoryExpression<T> projection, StringPath label) {
        return query(filtro, projection, label, Sort.by(Sort.Direction.ASC, label.getMetadata().getName()));
    }

    protected ListaPaginada<T> query(BooleanBuilder filtro, FactoryExpression<T> projection, StringPath label, Sort sort) {
        if (filtro == null) {
            filtro = new BooleanBuilder();
        }
        filtro.and(nullSafeContainsIgnoreCase(label, search));

        if (paged) {
            var pg = PageRequest.of(this.pageIndex, this.pageSize, sort);
            Page<T> page = repository.findAll(projection, filtro, pg);
            return new ListaPaginada<>(page);
        }
        var list = repository.findAll(projection, filtro, sort);
        return new ListaPaginada<>(list.size(), 1, list);
    }
}
