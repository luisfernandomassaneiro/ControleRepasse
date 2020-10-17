export class ListaPaginadaModel<T> {
  total: number;
  pages: number;
  itens: T[];

  constructor() {
    this.total = 0;
    this.pages = 0;
    this.itens = [];
  }
}
