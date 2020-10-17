package br.com.senior.controle.lib.business.application.usecase.impl;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.Collection;

/**
 * Facilidade para retorno de listas paginadas.
 *
 * @param <T> Tipo do item a ser retornado.
 */
@Getter
@Setter
public class ListaPaginada<T> {

    private long total;

    private int pages;

    private Collection<T> itens;

    public ListaPaginada() {
        //Contrutor padrão.
    }

    public ListaPaginada(Page<T> page) {
        this(page.getTotalElements(), page.getTotalPages(), page.getContent());
    }

    public ListaPaginada(long total, int pages, Collection<T> itens) {
        this.total = total;
        this.pages = pages;
        this.itens = itens;
    }

}
