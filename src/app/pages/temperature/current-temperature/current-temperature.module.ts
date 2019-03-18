import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../../../components/components.module';
import {CurrentTemperaturePage} from './current-temperature.page';
import {TemperatureTrendPage} from '../temperature-trend/temperature-trend.page';
import {TemperatureTrendPageModule} from '../temperature-trend/temperature-trend.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TemperatureTrendPageModule,
        ComponentsModule,
        RouterModule.forChild([{path: '', component: CurrentTemperaturePage}])
    ],
    declarations: [CurrentTemperaturePage]
})
export class CurrentTemperaturePageModule {
}
