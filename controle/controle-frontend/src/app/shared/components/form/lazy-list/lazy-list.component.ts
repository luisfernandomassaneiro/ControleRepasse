import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComparatorUtils } from '@shared/utils/comparator.utils';
import { ListaPaginadaModel } from '@shared/models/lista-paginada.model';
import { DomainService } from '@shared/services/base/domain.service';

export type LoadFn = (filtro: any, pageIndex: number, search?: string) => Observable<ListaPaginadaModel<any>>;
export type LabelFn = (item: any) => string;

@Component({
  selector: 'app-lazy-list',
  templateUrl: './lazy-list.component.html',
  styles: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LazyListComponent),
    multi: true,
  }],
})
export class LazyListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  item: any;
  items: any[] = [];
  isLoading: boolean;
  onServer = true;
  nzShowSearch = false;
  @Input() label: string | LabelFn;
  @Input() value?: string;
  @Input() nzPlaceHolder?: string;
  @Input() nzAllowClear?: boolean;
  @Input() nzDisabled?: boolean;
  @Input() compareWith?: (o1: any, o2: any) => boolean;
  @Input() filtro: any;
  @Input() loader: LoadFn | DomainService<any>;
  @Input() trigger: Subject<any>;
  private subscriptions: { search?: Subscription; loader?: Subscription; } = {};
  private page = 0;
  private hasMore = true;
  private searchChange$ = new BehaviorSubject('');
  private search: string;

  onChange: any = () => {
  };

  onTouch: any = () => {
  };

  getLabel(item: any): string {
    if (!this.label) {
      return item ? item.toString() : '-';
    }
    let fn: LabelFn;
    if (Object.prototype.toString.call(this.label) === '[object Function]') {
      fn = this.label as LabelFn;
    } else {
      fn = (item1: any) => {
        return item1[this.label.toString()];
      };
    }
    return fn(item);
  }

  update(e: any): void {
    this.item = e;
    this.onChange(this.item && this.value ? this.item[this.value] : this.item);
    this.onTouch();
  }

  onSearch(value: string): void {
    this.searchChange$.next(value);
  }

  more(): Promise<ListaPaginadaModel<any>> {
    return new Promise<ListaPaginadaModel<any>>(resolve => {
      if (this.isLoading || !this.hasMore || !this.onServer || !this.loader) {
        return;
      }

      this.isLoading = true;

      let fn: LoadFn;
      if (Object.prototype.toString.call(this.loader) === '[object Function]') {
        fn = this.loader as LoadFn;
      } else {
        const srv = this.loader as DomainService<any>;
        fn = (f, idx, s) => {
          const ft = f || {};
          ft.pageIndex = idx;
          ft.search = s;
          return srv.page(ft, false);
        };
      }

      fn(this.filtro, this.page, this.search).subscribe(value => {
        this.page++;
        this.items = [...this.items, ...value.itens];
        this.isLoading = false;
        this.hasMore = this.page < value.pages;
        this.nzShowSearch = value.total > 10;
        resolve(value);
      }, () => {
        this.isLoading = false;
      });
    });
  }

  writeValue(value: any): void {
    this.item = value;
  }

  ngOnInit() {
    if (!this.trigger) {
      this.initialLoad();
    } else {
      this.subscriptions.loader = this.trigger.subscribe(filtro => {
        this.onServer = true;
        this.filtro = filtro;
        this.initialLoad();
      });
    }
    if (!this.compareWith) {
      if (this.value) {
        this.compareWith = ComparatorUtils.getInstance().compare(this.value) as any;
      } else {
        this.compareWith = (o1, o2) => {
          return o1 === o2;
        };
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions.search) {
      this.subscriptions.search.unsubscribe();
    }
    if (this.subscriptions.loader) {
      this.subscriptions.loader.unsubscribe();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  private reset(search = ''): void {
    this.hasMore = true;
    this.items = [];
    this.search = search;
    this.page = 0;
  }

  private initialLoad(): void {
    this.reset();
    this.more().then(value => {
      this.onServer = value.pages > 1;
      if (this.nzShowSearch == null) {
        this.nzShowSearch = value.total > 10;
      }
      if (this.onServer) {
        this.subscriptions.search = this.searchChange$
          .pipe(debounceTime(500))
          .subscribe(v => {
            this.reset(v);
            this.more();
          });
      }
    });
  }
}
