import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../../../components/components.module';
import {HumidityTrendPage} from './humidity-trend.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
    ],
    declarations: [HumidityTrendPage],
    exports: [HumidityTrendPage]
})
export class HumidityTrendPageModule {
}
