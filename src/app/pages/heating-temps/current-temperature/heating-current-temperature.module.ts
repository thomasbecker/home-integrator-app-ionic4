import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeatingCurrentTemperaturePage} from './heating-current-temperature.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: HeatingCurrentTemperaturePage}])
    ],
    declarations: [HeatingCurrentTemperaturePage]
})
export class HeatingCurrentTemperaturePageModule {
}
