import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimChartElementName'
})
export class TrimChartElementNamePipe implements PipeTransform {

  transform(value:string|undefined ): string|undefined {
    if(value){
      if(value.length>10){
       value = value.substring(0,10) + "..."
      }
    }
      return value;
  }

}
