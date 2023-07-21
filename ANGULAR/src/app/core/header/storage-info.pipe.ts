import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed'
})
export class toFixedPipe implements PipeTransform {
  transform(value: number): string {
    let mesure = "GB"
    let volume = value/1000000000 //GB
    if(volume<1){
        mesure = "MB"
        volume =  volume*1000 //MB
        if(volume<1){
            return `<${volume}${mesure}`
        }
    }
    return `${volume}${mesure}`
  }
}
