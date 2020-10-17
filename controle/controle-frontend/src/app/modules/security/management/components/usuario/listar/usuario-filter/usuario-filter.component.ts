import { Component, Input, OnInit } from '@angular/core';

import { UsuarioFiltro } from '../../../../model/usuario-filtro.model';

import { SexoEnumDomainService } from '@shared/services/domain/security/sexo-enum-domain.service';
import { TipoUsuarioDomainService } from '@shared/services/domain/security/tipo-usuario-domain.service';
import { FilteredTableWrapper } from '@shared/utils/filtered-table.wrapper';
import { UsuarioResumoModel } from '../../../../model/usuario-resumo.model';

@Component({
  selector: 'app-usuario-filter',
  templateUrl: './usuario-filter.component.html',
  styles: [],
})
export class UsuarioFilterComponent implements OnInit {

  @Input() grid: FilteredTableWrapper<UsuarioResumoModel>;
  @Input() filtro: UsuarioFiltro;
  sexoDomain;
  tipoUsuarioDomain;

  constructor(
    private sexoEnumService: SexoEnumDomainService,
    private tipoUsuarioEnumService: TipoUsuarioDomainService,
  ) {
  }

  ngOnInit() {
    this.sexoEnumService.list().subscribe(domain => this.sexoDomain = domain);
    this.tipoUsuarioEnumService.list().subscribe(domain => this.tipoUsuarioDomain = domain);
  }
}
