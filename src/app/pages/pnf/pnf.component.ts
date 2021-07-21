import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pnf',
  templateUrl: './pnf.component.html',
  styleUrls: ['./pnf.component.scss']
})
export class PnfComponent implements OnInit, OnDestroy {

  public count = 5;
  private isRedirect = false;
  private x: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // this.timer();
    this.x = setInterval(() => {
      this.count--;
      if (this.count === 0) { clearInterval(this.x); this.router.navigate(['/']); }
    }, 1000);
  }

  timer(): void {
    setTimeout(() => {
      this.count--;
      if (this.count !== 0 && !this.isRedirect) { this.timer(); }
      if (this.count === 0) {
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.isRedirect = true;
    clearInterval(this.x);
  }
}
