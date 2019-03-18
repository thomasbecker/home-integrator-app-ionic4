import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CurrentCo2Page} from './current-co2.page';
import {Co2TrendPageModule} from '../co2-trend/co2-trend.module';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
        Co2TrendPageModule,
        RouterModule.forChild([{path: '', component: CurrentCo2Page}])
    ],
    declarations: [CurrentCo2Page]
})
export class CurrentCo2PageModule {
}
