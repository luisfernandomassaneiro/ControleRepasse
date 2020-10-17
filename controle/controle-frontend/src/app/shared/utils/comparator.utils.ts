export class ComparatorUtils {

  private static instance = new ComparatorUtils();

  static getInstance() {
    return this.instance;
  }

  // tslint:disable-next-line:ban-types
  compare(field: string): Function {
    return (a, b) => a && b ? a[field] === b[field] : a === b;
  }
}
