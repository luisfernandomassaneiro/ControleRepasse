import { ReportTypeEnum } from '@shared/enum/report-type.enum';
import { saveAs } from 'file-saver';

export class FileDownloadUtils {

  static MIME_TYPES = {
    CSV: 'text/csv',
    PDF: 'application/pdf',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ODS: 'application/vnd.oasis.opendocument.spreadsheet',
    XLS: 'application/vnd.ms-excel',
  };

  static download(data: BlobPart, type: ReportTypeEnum, name: string) {
    const mime = this.MIME_TYPES[type.toString()];
    const blob = new Blob([data], { type: mime });

    switch (type) {
      case ReportTypeEnum.HTML:
        const myReader = new FileReader();
        myReader.addEventListener('loadend', (e: ProgressEvent) => {
          const myWindow = window.open('', '');
          myWindow.document.write('<html lang="en"><head><title>' + name + '</title><body>' + (e.target as any).result + '</body></html>');
        });
        myReader.readAsText(blob);
        break;
      case ReportTypeEnum.PDF:
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        break;
      default:
        saveAs(blob, name + '.' + type.toString().toLocaleLowerCase());
    }
  }

  static save(blob: Blob, name: string) {
    saveAs(blob, name);
  }
}
