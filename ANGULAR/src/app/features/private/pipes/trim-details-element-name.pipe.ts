import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimDetailsElementName'
})
export class TrimDetailsElementNamePipe implements PipeTransform {

  transform(value: string, ): unknown {
    if(value.length>20){
      value = value.substring(0,20) + "..."
    }
    return value;
  }

}
