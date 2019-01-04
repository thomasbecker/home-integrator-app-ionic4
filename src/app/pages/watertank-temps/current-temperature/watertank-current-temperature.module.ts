import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {WatertankCurrentTemperaturePage} from './watertank-current-temperature.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: WatertankCurrentTemperaturePage}])
    ],
    declarations: [WatertankCurrentTemperaturePage]
})
export class WatertankCurrentTemperaturePageModule {
}
