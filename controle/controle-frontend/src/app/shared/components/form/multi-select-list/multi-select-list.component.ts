import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslationService } from '@shared/services/translation.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MultiSelectListDatasource } from '@shared/components/form/multi-select-list/multi-select-list.datasource';
import { DomainService } from '@shared/services/base/domain.service';

export type LoadFn = () => Observable<any[]>;

@Component({
  selector: 'app-multi-select-list',
  templateUrl: './multi-select-list.component.html',
  styles: [':host { display: block; width: 100%; }'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectListComponent),
    multi: true,
  }],
})
export class MultiSelectListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  dataset: MultiSelectListDatasource = new MultiSelectListDatasource([], '');
  loading: boolean;
  checked: boolean;
  message: string;
  disabled: boolean;
  search: string;
  @Input() label: string;
  @Input() value: string;
  @Input() placeholder = '';
  @Input() maxDisplayedItens = 4;
  @Input() resultModelType: 'object' | 'id' = 'id';
  @Input() i18nPrefix: string;
  @Input() loader: LoadFn | DomainService<any>;
  @Input() trigger: Subject<any>;
  private subscriptions: { search?: Subscription; loader?: Subscription; } = {};
  private searchChange$ = new BehaviorSubject('');
  private keys: any[] = [];

  constructor(private translations: TranslationService) {
    this.subscriptions.search = this.searchChange$.pipe(debounceTime(500)).subscribe(value => {
      this.dataset.search(value);
      this.evalCheck();
    });
  }

  @Input() set options(val: any[] | string[]) {

    if (val.length && typeof val[0] === 'string') {
      this.value = 'key';
      this.label = 'value';
      this.resultModelType = 'id';
      const tp = [];
      val.forEach(value1 => {
        tp.push({ key: value1, value: value1 });
      });
      val = tp;
    }

    this.loading = true;
    val.forEach(value1 => {
      if (this.i18nPrefix) {
        value1[this.label] = this.translations.translate(this.i18nPrefix + value1[this.label]);
      }
    });

    this.dataset = new MultiSelectListDatasource(val, this.label);
    this.loading = false;
  }

  onChange: any = () => {
  };

  onTouch: any = () => {
  };

  ngOnInit() {
    this.message = this.placeholder;
    if (this.trigger) {
      this.subscriptions.loader = this.trigger.subscribe(filtro => {
        this.load(filtro);
      });
    } else {
      this.load();
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

  checkall(e: boolean) {
    this.checked = e;
    if (this.checked) {
      this.dataset.select();
    } else {
      this.dataset.unselect();
    }
    this.evalLabel();
    this.update();
  }

  checkSingle(item: any) {
    this.dataset.toogleSelect(item);
    this.evalCheck();
    this.evalLabel();
    this.update();
  }

  onSearch(value: string): void {
    this.searchChange$.next(value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(val: any): void {

    if (val && !Array.isArray(val)) {
      throw new Error('O Valor ' + val + ' não é um array');
    }

    if (!val) {
      this.dataset.unselect();
      this.keys = [];
    } else {
      this.keys = (val as any[]).map(value1 => (typeof value1 === 'object') ? value1[this.value] : value1).filter(value1 => !!value1);
      this.dataset.selectByValue(this.keys, this.value);
    }
    this.evalCheck();
    this.evalLabel();
  }

  scroll(evt: Event): void {
    if (!this.dataset.hasNext) {
      return;
    }
    const el: Element = evt.target as Element;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      this.dataset.nextPage();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  private evalLabel(): void {
    const selected = this.dataset.selected;
    if (selected.length === 0) {
      this.message = this.placeholder;
      return;
    }
    if (selected.length > this.maxDisplayedItens) {
      this.message = selected.length + ' itens selecionados';
      return;
    }
    this.message = selected.map(value1 => value1[this.label]).join(', ');
  }

  private update(): void {
    const items = this.dataset.selected;

    if (this.resultModelType === 'object') {
      this.onChange(items);
    } else {
      const keys = items.map(value1 => value1[this.value]);
      this.onChange(keys);
    }
    this.onTouch();
  }

  private evalCheck() {
    this.checked = this.dataset.isAllSelected;
  }

  private load(filtro?: any): void {

    if (!this.loader) {
      return;
    }

    let fn: LoadFn;
    if (Object.prototype.toString.call(this.loader) === '[object Function]') {
      fn = this.loader as LoadFn;
    } else {
      const srv = this.loader as DomainService<any>;
      fn = () => {
        return srv.list(filtro, false);
      };
    }
    this.loading = true;
    fn().subscribe(value1 => {
      this.options = value1;
      this.dataset.selectByValue(this.keys, this.value);
      this.evalCheck();
      this.evalLabel();
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }
}
