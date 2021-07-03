import { Pipe, PipeTransform } from '@angular/core';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import { AppService } from '../app.service';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

    constructor(private appService: AppService) {}

  transform(list: any[], searchText: string): any[] {
    if (!list) { return []; }
    if (!searchText) { return list; }

    searchText = searchText.toLowerCase();
    const x = list.filter( item => {
        return item.title.toLowerCase().includes(searchText);
    });
    if (!x || x.length === 0) {
        this.appService.openSnackBar('No Data Found');
    }
    return x;
  }
}
