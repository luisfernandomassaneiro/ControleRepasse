export class MultiSelectListDatasource {

  public displayed: any[];
  public hasNext: boolean;
  private readonly dataset: any[];
  private page = 0;
  private size = 100;
  private available: any[];

  constructor(items: any[], label: string) {
    this.dataset = items;
    this.available = items;
    this.displayed = [];
    this.nextPage();
    items.forEach(value => value.normalized = MultiSelectListDatasource.normalize(value[label]));
  }

  get selected() {
    return this.dataset.filter((value) => value.checked);
  }

  get isAllSelected() {
    for (const item of  this.available) {
      if (!item.checked) {
        return false;
      }
    }
    return this.available.length > 0;
  }

  public static normalize(str: string): string {
    if (!str) {
      return '';
    }
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  nextPage(): void {
    const offset = this.page * this.size;
    this.displayed.push(...this.available.slice(offset, offset + this.size + 1));
    this.hasNext = this.available.length > this.displayed.length;
    this.page++;
  }

  select(item?: any): void {
    if (!item) {
      this.available.forEach(value => value.checked = true);
    } else {
      item.checked = true;
    }
  }

  unselect(item?: any): void {
    if (!item) {
      this.available.forEach(value => value.checked = false);
    } else {
      item.checked = false;
    }
  }

  toogleSelect(item?: any): void {
    if (!item) {
      this.available.forEach(value => value.checked = !value.checked);
    } else {
      item.checked = !item.checked;
    }
  }

  selectByValue(values: any[], property: string) {
    this.dataset.forEach(value => {
      value.checked = values.indexOf(value[property]) >= 0;
    });
  }

  search(value: string) {
    value = MultiSelectListDatasource.normalize(value);
    if (value) {
      this.available = this.dataset.filter(value1 => {
        return value1.normalized.indexOf(value) >= 0;
      });
    } else {
      this.available = this.dataset;
    }
    this.page = 0;
    this.displayed = [];
    this.nextPage();
  }
}
