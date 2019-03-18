import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CurrentHumidityPage} from './current-humidity.page';
import {ComponentsModule} from '../../../components/components.module';
import {HumidityTrendPageModule} from '../humidity-trend/humidity-trend.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HumidityTrendPageModule,
        ComponentsModule,
        RouterModule.forChild([{path: '', component: CurrentHumidityPage}])
    ],
    declarations: [CurrentHumidityPage]
})
export class CurrentHumidityPageModule {
}
