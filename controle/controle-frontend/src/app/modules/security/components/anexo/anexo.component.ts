import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';

import { MessagesService, NotificationType } from '@shared/services/message.service';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AnexoService } from '../../services/anexo.service';
import { AnexoModel } from '../../models/anexo.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-anexo',
  templateUrl: './anexo.component.html',
  styles: [
  ]
})
export class AnexoComponent implements OnDestroy {

  constructor(
    private message: MessagesService,
    private anexoService: AnexoService) {}

  @Input() formGroup: FormGroup;
  @Input() anexo: AnexoModel;
  @Input() exibeBotaoAnexar: true;
  @Input() labelDownload: string;
  @Output() change: EventEmitter<AnexoModel> = new EventEmitter();

  running = false;
  unsubscribe$ = new Subject();

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const width = image.width;
        const height = image.height;

        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }

        let newWidth;
        let newHeight;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, newWidth, newHeight);

        canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
    });
  }

  extractBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result.toString());
      };
    });
  }

  checkImage(file: File): boolean {
    const allowed = ['image/png', 'image/jpeg', 'image/bmp'];
    const isJPG = allowed.includes(file.type);
    if (!isJPG) {
      this.message.notify('Você só pode enviar imagens do tipo PNG, JPEG ou BMP', NotificationType.Error);
      return false;
    }
    return true;
  }

  checkSize(file: File): boolean {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.notify('A Imagem deve ser menor que 2 Mb', NotificationType.Error);
      return false;
    }
    return true;
  }

  getAttachURL() {
    this.anexoService.download(this.anexo.id, this.anexo.fileName).subscribe(() => { });
  }

  beforeUpload = (file: File): boolean => {
    this.uploadFile(file);
    return false;
  }

  uploadFile(arquivo: File) {
    const formData = new FormData();

    if (this.anexo) {
      formData.append('anexoId', JSON.stringify(this.anexo.id));
    }

    formData.append('arquivo', arquivo);

    this.anexoService
      .salvar(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        // this.formGroup.get('file').setValue(response.file);
        this.anexo = response;
        this.change.emit(this.anexo);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isInputInvalid(formControl: any): boolean {
    return false;
  }

  hasFile(): boolean {
    return this.anexo && this.anexo.id !== null;
  }

  hasOldFile(): boolean {
    return false;
  }
}
