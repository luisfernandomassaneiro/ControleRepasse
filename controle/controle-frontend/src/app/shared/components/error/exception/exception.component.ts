import { Component, Input } from '@angular/core';
import { NzModalService, NzResultStatusType } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { TranslationService } from '@shared/services/translation.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss'],
})
export class ExceptionComponent {

  @Input() code: NzResultStatusType;
  @Input() title: string;
  @Input() description: string;
  @Input() messages: string[] = [];
  @Input() redirect = true;
  guid: string;

  constructor(modalSrv: NzModalService, route: ActivatedRoute, i18nService: TranslationService) {
    modalSrv.closeAll();
    route.queryParams.subscribe(params => {
      if (params.code) {
        this.guid = i18nService.translate('error.hash-message', { code: params.code });
      }
    });
  }
}
