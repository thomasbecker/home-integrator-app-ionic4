import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../../../components/components.module';
import {CurrentTemperaturePage} from './current-temperature.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: CurrentTemperaturePage}])
    ],
    declarations: [CurrentTemperaturePage]
})
export class CurrentTemperaturePageModule {
}
