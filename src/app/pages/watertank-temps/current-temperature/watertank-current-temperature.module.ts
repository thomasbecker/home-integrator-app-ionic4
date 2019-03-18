import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {WatertankCurrentTemperaturePage} from './watertank-current-temperature.page';
import {ComponentsModule} from '../../../components/components.module';
import {WatertankTemperatureTrendPageModule} from '../temperature-trend/watertank-temperature-trend.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
        WatertankTemperatureTrendPageModule,
        RouterModule.forChild([{path: '', component: WatertankCurrentTemperaturePage}])
    ],
    declarations: [WatertankCurrentTemperaturePage]
})
export class WatertankCurrentTemperaturePageModule {
}
