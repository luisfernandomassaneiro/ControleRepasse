import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../model/usuario.model';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '@shared/services/security.service';
import { MessagesService, NotificationType } from '@shared/services/message.service';
import { CurrentService } from '../../services/current.service';

@Component({
  templateUrl: './usuario-profile.component.html',
  styles: ['.ant-modal-content {margin-top: 16px}'],
})
export class UsuarioProfileComponent implements OnInit {

  entity: UsuarioModel;

  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private message: MessagesService,
    private currentService: CurrentService) {
  }

  ngOnInit() {
    this.entity = this.route.snapshot.data.entity;
  }

  save(model: UsuarioModel): void {
    this.currentService.save(model).subscribe((r) => {
      this.securityService.updateUserInfo(r);
      this.message.notifyI18n('security.usuario.messages.account_updated', NotificationType.Success);
    });
  }
}
