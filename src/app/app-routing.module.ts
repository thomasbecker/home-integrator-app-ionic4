import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComponentsModule} from './components/components.module';

const routes: Routes = [
  { path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), ComponentsModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
