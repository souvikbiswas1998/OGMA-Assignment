import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PnfComponent } from './pnf/pnf.component';

const routes: Routes = [
  { path: '', redirectTo: '404' },
  { path: '404', component: PnfComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
