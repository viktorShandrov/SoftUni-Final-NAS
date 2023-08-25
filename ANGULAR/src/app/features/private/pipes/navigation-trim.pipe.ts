import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'navigationTrim'
})
export class NavigationTrimPipe implements PipeTransform {

  transform(value: string): unknown {
    if(value.length>8){
      value = value.substring(0,8) + "..."
    }
    return value;
  }

}
