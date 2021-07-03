import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  // tslint:disable-next-line: variable-name
  constructor(private _sanitizer: DomSanitizer) { }

  transform(list: any, searchText: string): any[] {

    if (!list) { return []; }
    if (!searchText) { return list; }

    const value = list.replace(
      searchText, `<span style='background-color:yellow'>${searchText}</span>` );

    return (this._sanitizer as any)?.bypassSecurityTrustHtml(value);
  }
}
