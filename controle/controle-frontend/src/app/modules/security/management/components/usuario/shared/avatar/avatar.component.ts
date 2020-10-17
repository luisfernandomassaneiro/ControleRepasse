import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MessagesService, NotificationType } from '@shared/services/message.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-usuario-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {

  @Input() avatar: string;
  @Output() change: EventEmitter<string> = new EventEmitter();
  running = false;

  constructor(private message: MessagesService) {
  }

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

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {

      this.running = true;

      if (!this.checkImage(file)) {
        this.running = false;
        observer.complete();
        return;
      }
      if (!this.checkSize(file)) {
        this.running = false;
        observer.complete();
        return;
      }

      this.resizeImage(file, 200, 200).then(blob => {
        this.extractBase64(blob).then(base64 => {
          this.avatar = base64;
          this.change.emit(base64);
          this.running = false;
        });
      });
      observer.complete();
    });
  };
}
