import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeatingCurrentTemperaturePage} from './heating-current-temperature.page';
import {HeatingTemperatureTrendPageModule} from '../temperature-trend/heating-temperature-trend.module';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HeatingTemperatureTrendPageModule,
        ComponentsModule,
        RouterModule.forChild([{path: '', component: HeatingCurrentTemperaturePage}])
    ],
    declarations: [HeatingCurrentTemperaturePage]
})
export class HeatingCurrentTemperaturePageModule {
}
