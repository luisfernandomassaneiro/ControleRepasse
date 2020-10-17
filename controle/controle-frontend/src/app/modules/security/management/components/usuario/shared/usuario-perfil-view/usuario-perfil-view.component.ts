import { Component, EventEmitter, Output } from '@angular/core';
import { UsuarioPerfilModel } from '../../../../model/usuario-perfil.model';
import { SecurityResources } from '@shared/constants/security_resources.const';
import { AssociacaoUsuarioPerfilService } from '../../../../services/associacao-usuario-perfil.service';

@Component({
  selector: 'app-usuario-perfil-view',
  templateUrl: './usuario-perfil-view.component.html',
})
export class UsuarioPerfilViewComponent {

  resources = SecurityResources;
  detail: UsuarioPerfilModel;
  @Output()
  deleted: EventEmitter<UsuarioPerfilModel> = new EventEmitter<UsuarioPerfilModel>();

  constructor(private service: AssociacaoUsuarioPerfilService) {
  }

  show(item: UsuarioPerfilModel): void {
    this.detail = item;
  }

  delete(item: UsuarioPerfilModel): void {
    this.service.deletar(item.usuario.id, item.id).then(() => {
      this.detail = null;
      this.deleted.emit(item);
    });
  }
}
