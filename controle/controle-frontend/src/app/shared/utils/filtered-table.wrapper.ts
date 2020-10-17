import { Subject } from 'rxjs';
import { ListaPaginadaModel } from '@shared/models/lista-paginada.model';
import { QueryService } from '@shared/services/base/query.service';
import { PersistentFilterService } from '@shared/services/persistent-filter.service';

export type Order = 'ascend' | 'descend' | null;

export interface InitialSortConfig {
  field: string;
  order: Order;
}

export class FilteredTableWrapper<TResumo> {

  public sortField: string;
  public sortOrder: Order;
  public pageSize = 10;
  public pageIndex = 1;
  public dataset: ListaPaginadaModel<TResumo> = new ListaPaginadaModel();
  public datasetChanged: Subject<ListaPaginadaModel<TResumo>> = new Subject();
  private readonly df: any;

  constructor(private readonly service: QueryService<TResumo>,
              private filtro: any,
              initialSort?: InitialSortConfig,
              private filterService?: PersistentFilterService)
  {
    this.df = { ...filtro };
    if (initialSort) {
      this.sortField = initialSort.field;
      this.sortOrder = initialSort.order;
    }
    this.loadFilter(filterService);
    this.refresh();
  }

  public get filter() {
    return this.filtro;
  }

  public set filter(filter) {
    this.filtro = filter;
  }

  public direction(field: string): 'ascend' | 'descend' | null {
    return this.sortField === field ? this.sortOrder : null;
  }

  public refresh(resetPageIndex = false) {
    if (resetPageIndex) {
      this.pageIndex = 1;
    }
    this.filtro.sortField = this.sortField;
    this.filtro.sortOrder = this.sortOrder;
    this.filtro.pageSize = this.pageSize;
    this.filtro.pageIndex = this.pageIndex - 1;
    this.service.list(this.filtro).subscribe((next) => {
      this.dataset = next;
      // Volta uma página caso a página atual estiver vazia e não for a primeira.
      // Isto ocorre quando um usuário deleta o último registro da página, por exemplo.
      if (!this.dataset.itens.length && this.pageIndex > 1) {
        this.pageIndex--;
        this.refresh(resetPageIndex);
        return;
      }
      if (this.filterService) {
        this.filterService.set(this.filtro);
      }
      if (this.datasetChanged) {
        this.datasetChanged.next(next);
      }
    });
  }

  public sort(sort: { key: string; value: string }) {
    this.sortField = sort.key;
    this.sortOrder = null;
    switch (sort.value) {
      case 'ascend':
        this.sortOrder = 'ascend';
        break;
      case 'descend':
        this.sortOrder = 'descend';
        break;
    }
    this.refresh();
  }

  public clear(order = false, page = false) {
    for (const member in this.filtro) {
      this.filtro[member] = this.df[member];
    }
    if (order) {
      this.sortField = null;
      this.sortOrder = null;
    }
    if (page) {
      this.pageIndex = 1;
      this.pageSize = 10;
    }
  }

  public reset(): void {
    this.clear(true, true);
    this.refresh();
  }

  private loadFilter(filterService: PersistentFilterService): void {
    if (!filterService) {
      return;
    }
    const persisted = filterService.get();
    if (!persisted) {
      return;
    }
    if (persisted.sortField) {
      this.sortField = persisted.sortField;
    }
    if (persisted.sortOrder) {
      this.sortOrder = persisted.sortOrder;
    }
    if (persisted.pageSize) {
      this.pageSize = persisted.pageSize;
    }
    if (persisted.pageIndex) {
      this.pageIndex = persisted.pageIndex + 1;
    }
    for (const member in persisted) {
      this.filtro[member] = persisted[member];
    }
  }
}
