import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilteredTableWrapper } from '@shared/utils/filtered-table.wrapper';
import { CarroFiltroModel } from '../../../../models/carro-filtro.model';
import { CarroResumoModel } from '../../../../models/carro-resumo.model';


@Component({
  selector: 'app-carro-filter',
  templateUrl: './carro-filter.component.html'
})
export class CarroFilterComponent implements OnInit {

  @Input() filtro: CarroFiltroModel;
  @Input() grid: FilteredTableWrapper<CarroResumoModel>;
  @Output() filtrarEmit: EventEmitter<Boolean> = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() {
  }

  onChange(result: Date[]): void {
    if (result && result.length > 1 && this.filtro) {
      this.filtro.dataInicial = result[0];
      this.filtro.dataFinal = result[1];
    }
  }

  filtrar(model: boolean): void {
    this.filtrarEmit.emit(model);
  }
}
