package br.com.senior.controle.external.reports;

import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import br.com.senior.controle.lib.business.application.usecase.impl.QueryPaginada;
import br.com.senior.controle.lib.commom.Messages;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRField;
import net.sf.jasperreports.engine.data.JRAbstractBeanDataSource;
import org.apache.commons.lang3.ClassUtils;

import java.util.Iterator;

public class PagedBeanCollectionDataSource<T> extends JRAbstractBeanDataSource {

    private static final int DEFAULT_PAGE_SIZE = 250;

    private final UseCaseFacade facade;
    private final QueryPaginada<ListaPaginada<T>> useCase;
    private T current;

    private ListaPaginada<T> list;
    private Iterator<T> iterator;
    private final Messages messages;

    public PagedBeanCollectionDataSource(UseCaseFacade facade, Messages messages, QueryPaginada<ListaPaginada<T>> useCase) {
        this(facade, messages, useCase, DEFAULT_PAGE_SIZE);
    }

    public PagedBeanCollectionDataSource(UseCaseFacade facade, Messages messages, QueryPaginada<ListaPaginada<T>> useCase, int pageSize) {
        this(facade, messages, useCase, pageSize,true);
    }

    private PagedBeanCollectionDataSource(UseCaseFacade facade, Messages messages, QueryPaginada<ListaPaginada<T>> useCase, int pageSize, boolean isUseFieldDescription) {
        super(isUseFieldDescription);
        this.facade = facade;
        if(pageSize < 1){
            pageSize = DEFAULT_PAGE_SIZE;
        }
        useCase.setPageSize(pageSize);
        this.useCase = useCase;
        this.messages = messages;
        moveFirst();
    }

    private void loadPage(int index) {
        useCase.setPageIndex(index);
        this.list = facade.execute(useCase);
        this.iterator = list.getItens().iterator();
    }

    private boolean hasMorePages() {
        return useCase.getPageIndex() < list.getPages() - 1;
    }

    @Override
    public final void moveFirst() {
        loadPage(0);
    }

    @Override
    public boolean next() {
        //Quando o iterador chega ao fim, o datasource carrega a nova página
        if (!iterator.hasNext() && hasMorePages()) {
            loadPage(useCase.getPageIndex() + 1);
        }

        boolean hasNext = iterator.hasNext();
        this.current = hasNext ? iterator.next() : null;
        return hasNext;
    }

    @Override
    public Object getFieldValue(JRField jrField) throws JRException {
        Object val = this.getFieldValue(this.current, jrField);
        if (val == null) {
            return null;
        }
        if (val.getClass().isEnum()) {
            return messages.getMessage(val.getClass().getSimpleName() + "." + val);
        }
        if (ClassUtils.isAssignable(Boolean.class, val.getClass()) || ClassUtils.isAssignable(boolean.class, val.getClass())) {
            return messages.getMessage(String.valueOf(val).toLowerCase());
        }
        return val;
    }
}
