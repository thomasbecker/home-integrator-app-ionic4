import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from 'src/app/components/components.module';
import {Co2TrendPage} from './co2-trend.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
        RouterModule.forChild([{path: '', component: Co2TrendPage}])
    ],
    declarations: [Co2TrendPage]
})
export class Co2TrendPageModule {
}
