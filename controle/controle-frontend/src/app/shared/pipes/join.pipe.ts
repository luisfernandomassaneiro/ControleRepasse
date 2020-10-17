import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value: any, property?: string): any {
    console.log(value);

    if (!Array.isArray(value)) {
      return value;
    }

    let arr: any[] = value;
    if (property) {
      arr = arr.map(value1 => value1[property]);
    }
    return arr.join(', ');
  }
}
