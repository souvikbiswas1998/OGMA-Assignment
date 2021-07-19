import { AfterContentChecked, Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentChecked {
  title = 'Assignment';
  show = false;

  constructor(public appService: AppService) {
  }
  ngAfterContentChecked(): void {
    this.show = this.appService.showSpinner;
  }
}
