import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch'
})
export class HighlightSearchPipe implements PipeTransform {

  transform(value: string, args: string): any {
    if (args && value) {
        let startIndex = value.toLowerCase().indexOf(args.toLowerCase());
        if (startIndex != -1) {
            let endLength = args.length;
            let matchingString = value.substr(startIndex, endLength);
            const replacethis = new RegExp( matchingString, 'g');
            return value.replace(replacethis, "<mark>" + matchingString + "</mark>");
        }

    }
    return value;
  }

}
