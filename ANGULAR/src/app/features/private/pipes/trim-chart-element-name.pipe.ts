import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimChartElementName'
})
export class TrimChartElementNamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
