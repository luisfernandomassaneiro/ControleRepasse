import { Component, OnInit, Input } from '@angular/core';
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

  constructor(
  ) { }

  ngOnInit() {
  }
}
