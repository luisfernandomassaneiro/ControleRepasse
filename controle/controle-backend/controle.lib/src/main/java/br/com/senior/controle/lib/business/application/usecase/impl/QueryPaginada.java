package br.com.senior.controle.lib.business.application.usecase.impl;

import br.com.senior.controle.lib.business.application.usecase.UseCase;
import com.google.common.base.Strings;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/**
 * Facilidade para implementacao de casos de uso com paginação
 */
@Getter
@Setter
public abstract class QueryPaginada<T> extends UseCase<T> {

    private static final int DEFAULT_PAGE_SIZE = 25;
    private static final int DEFAULT_OFFSET = 0;

    private int pageSize = DEFAULT_PAGE_SIZE;
    private int pageIndex = DEFAULT_OFFSET;
    private String sortField;
    private String sortOrder;

    protected Sort getSortExp() {
        if(Strings.isNullOrEmpty(sortField)){
            return Sort.unsorted();
        }

        var direction = "descend".equals(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return Sort.by(direction, sortField);
    }

    public void allRecords() {
        pageIndex = DEFAULT_OFFSET;
        pageSize = Integer.MAX_VALUE;
    }

    protected PageRequest getPage(){
        return PageRequest.of(this.getPageIndex(), this.getPageSize(), getSortExp());
    }
}
