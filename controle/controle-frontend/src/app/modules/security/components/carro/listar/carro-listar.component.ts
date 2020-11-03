import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CarroService } from '../../../services/carro.service';
import { CarroResumoModel } from '../../../models/carro-resumo.model';
import { CarroFiltroModel } from '../../../models/carro-filtro.model';

import { HashService } from '@shared/services/hash.service';
import { FilteredTableWrapper } from '@shared/utils/filtered-table.wrapper';
import { ReportTypeEnum } from '@shared/enum/report-type.enum';
import { PersistentFilterService } from '@shared/services/persistent-filter.service';
import { CarroTotaisModel } from 'app/modules/security/models/carro-totais.model';

@Component({
  templateUrl: './carro-listar.component.html'
})
export class CarroListarComponent {

  filtro = new CarroFiltroModel();
  totais = new CarroTotaisModel();
  gridWrapper: FilteredTableWrapper<CarroResumoModel>;
  loading = false;

  constructor(private service: CarroService, private router: Router, private route: ActivatedRoute,
              filterService: PersistentFilterService, public hash: HashService) {
    const inicialSort = {
      field: 'data',
      order: 'descend'
    };         
    this.gridWrapper = new FilteredTableWrapper(service, this.filtro, inicialSort, filterService);
    this.filtrar(true);
  }

  delete(item: CarroResumoModel): void {
    this.service.confirmAndDelete(item.id).then(() => this.gridWrapper.refresh());
  }

  view(item: CarroResumoModel): void {
    this.router.navigate(['../alterar', this.hash.encode(item.id)], {relativeTo: this.route});
  }

  filtrar(model: boolean): void {
    this.loading = true;
    this.service.buscaTotais(this.filtro).subscribe(carroTotais => {
      this.totais = carroTotais;
      this.loading = false;
    })
  }

}
