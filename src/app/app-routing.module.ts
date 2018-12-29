import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComponentsModule} from './components/components.module';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes), ComponentsModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
