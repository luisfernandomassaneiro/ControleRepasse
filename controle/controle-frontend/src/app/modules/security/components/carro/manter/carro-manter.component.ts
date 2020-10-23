import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ReactiveFormsUtils } from '@shared/utils/reactive-forms.utils';
import { ComparatorUtils } from '@shared/utils/comparator.utils';
import { BreadCrumbItem } from '@shared/components/layout/page-header.component';
import { CarroService } from '../../../services/carro.service';
import { CarroModel } from '../../../models/carro.model';
import { HashService } from '@shared/services/hash.service';
import { NzModalService, NzUploadFile } from 'ng-zorro-antd';
import { AnexoService } from 'app/modules/security/services/anexo.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Observer, Subject } from 'rxjs';
import { MessagesService, NotificationType } from '@shared/services/message.service';

@Component({
  templateUrl: './carro-manter.component.html'
})
export class CarroManterComponent implements OnInit {

  comparator = ComparatorUtils.getInstance();
  entity: CarroModel;
  title: string;
  form: FormGroup;
  breadcrumb: BreadCrumbItem[] = [{label: 'menu.home', route: '/'}, {label: 'menu.security.carro', route: '/security/carro'}];
  unsubscribe$ = new Subject();
  buscouImagens = false;
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private service: CarroService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hash: HashService,
    private anexoService: AnexoService,
    private modal: NzModalService,
    private message: MessagesService
) {}

  ngOnInit(): void {


    this.entity = this.route.snapshot.data.entity || new CarroModel();
    if (this.entity.id) {
      this.title = 'security.carro.edit.title';
      this.breadcrumb.push({label: this.entity.descricao, route: ['../../visualizar/' + this.hash.encode(this.entity.id)]});
      this.breadcrumb.push({label: 'general.labels.edit'});
    } else {
      this.title = 'security.carro.add.title';
      this.breadcrumb.push({label: 'general.labels.add'});
    }

    this.form = this.formBuilder.group({
      id: [this.entity.id, []],
      descricao: [this.entity.descricao, [Validators.required, ]],
      placa: [this.entity.placa, []],
      renavam: [this.entity.renavam, []],
      vendedor: [this.entity.vendedor, []],
      comprador: [this.entity.comprador, []],
      valorCompra: [this.entity.valorCompra, []],
      valorVenda: [this.entity.valorVenda, []],
      data: [this.entity.data, []],
    });
  }

  save(model): void {
    if (!ReactiveFormsUtils.eval(this.form)) {
      return;
    }

    this.service.saveAndNotify(model, model.id).then(() => {
        history.go(-1);
    });
  }

  back() {
    history.go(-1);
  }
  
  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  beforeUpload = (file: File): boolean => {
    this.uploadFile(file);
    this.message.notify('Imagem incluída com sucesso!', NotificationType.Success);
    return false;
  }

  nzRemove = (file: NzUploadFile) => {
    return new Observable((observer: Observer<boolean>) => {
      this.confirm().then(retorno => {
        if (retorno) {
          this.anexoService.delete(Number(file.uid)).subscribe(() => {})
          this.message.notify('Imagem excluída com sucesso!', NotificationType.Success);
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      })
    });
  };
/*
  nzRemove = (file: NzUploadFile): boolean => {
    this.modal.confirm({
      nzTitle: 'Tem certeza que deseja excluir essa imagem?',
      nzContent: '<b style="color: red;">Essa operação não poderá ser desfeita</b>',
      nzOkText: 'Sim',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.anexoService.delete(Number(file.uid)).subscribe(() => {})
        return true;
      },
      nzCancelText: 'Não',
      nzOnCancel: () => {
        return false;
      }
    });
  }
*/

public confirm(): Promise<boolean> {
  return new Promise((resolve) => {
    const ref = this.modal.confirm({
      nzTitle: 'Tem certeza que deseja excluir essa imagem?',
      nzContent: '<b style="color: red;">Essa operação não poderá ser desfeita</b>',
      nzOkText: 'Sim',
      nzOkType: 'danger',
      nzCancelText: 'Não',
      nzOnOk: () => new Promise(() => {
        resolve(true);
        ref.close();
      }),
      nzOnCancel: () => new Promise(() => {
        resolve(false);
        ref.close();
      }),
    });
  });
}

  uploadFile(arquivo: File) {
    const formData = new FormData();

    if (this.entity.id) {
      formData.append('carroId', JSON.stringify(this.entity.id));
    }
    console.log(arquivo) 
    formData.append('arquivo', arquivo);

    this.anexoService
      .salvar(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        const imagem = {
          uid: response.id,
          originFileObj: arquivo,
          name: arquivo.name
        } 
        this.fileList = [...this.fileList, imagem];
      });
  }

  buscaImagens(event: boolean) {
    if (event && !this.buscouImagens && this.entity.id) {
      this.anexoService
        .buscaImagens(this.entity.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if (response && response.length > 0) {
            response.forEach(anexo => {
              this.anexoService
                .download(anexo.id)
                .subscribe(data => {
                  const blob = new Blob([data], { type: data.type });
                  var file = new File([blob], anexo.file, {
                    type: anexo.mimeType
                  })
                  const imagem = {
                    uid: anexo.id.toString(),
                    name: anexo.fileName,
                    originFileObj: file
                  } 
                  this.fileList = [...this.fileList, imagem];
                });
            });
          }
        });
    }
  }
  
}

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
