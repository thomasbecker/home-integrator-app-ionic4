import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../../../components/components.module';
import {WatertankTemperatureTrendPage} from './watertank-temperature-trend.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule
    ],
    declarations: [WatertankTemperatureTrendPage],
    exports: [WatertankTemperatureTrendPage]
})
export class WatertankTemperatureTrendPageModule {
}
