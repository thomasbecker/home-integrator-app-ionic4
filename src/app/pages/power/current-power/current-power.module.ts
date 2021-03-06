import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CurrentPowerPage} from './current-power.page';
import {ComponentsModule} from '../../../components/components.module';
import {PowerTrendPageModule} from '../power-trend/power-trend.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
        PowerTrendPageModule,
        RouterModule.forChild([{path: '', component: CurrentPowerPage}])
    ],
    declarations: [CurrentPowerPage]
})
export class CurrentPowerPageModule {
}
