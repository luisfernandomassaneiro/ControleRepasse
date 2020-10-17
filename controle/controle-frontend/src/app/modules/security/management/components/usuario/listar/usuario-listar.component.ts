import { Component } from '@angular/core';

import { UsuarioService } from '../../../services/usuario.service';

import { FilteredTableWrapper } from '@shared/utils/filtered-table.wrapper';
import { UsuarioFiltro } from '../../../model/usuario-filtro.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioResumoModel } from '../../../model/usuario-resumo.model';
import { MessagesService, NotificationType } from '@shared/services/message.service';
import { PersistentFilterService } from '@shared/services/persistent-filter.service';
import { HashService } from '@shared/services/hash.service';

@Component({
  templateUrl: './usuario-listar.component.html',
})
export class UsuarioListarComponent {

  filtro = new UsuarioFiltro();
  gridWrapper: FilteredTableWrapper<UsuarioResumoModel>;

  constructor(private service: UsuarioService, private router: Router, private route: ActivatedRoute, private message: MessagesService,
              filterService: PersistentFilterService, public hash: HashService) {
    this.gridWrapper = new FilteredTableWrapper(service, this.filtro, null, filterService);
  }

  delete(item): void {
    this.service.confirmAndDelete(item.id).then(() => this.gridWrapper.refresh());
  }

  view(data: any): void {
    this.router.navigate(['../visualizar', this.hash.encode(data.id)], { relativeTo: this.route });
  }

  changeStatus(data: UsuarioResumoModel): void {
    this.service.state(data.id, data.active).subscribe(() => {
      if (data.active) {
        this.message.notifyI18n('security.usuario.messages.activate.success', NotificationType.Success);
      } else {
        this.message.notifyI18n('security.usuario.messages.deactivate.success', NotificationType.Success);
      }
    }, () => {
      data.active = !data.active;
    });
  }
}
