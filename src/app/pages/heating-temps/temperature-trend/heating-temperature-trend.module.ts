import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../../../components/components.module';
import {HeatingTemperatureTrendPage} from './heating-temperature-trend.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
    ],
    declarations: [HeatingTemperatureTrendPage],
    exports: [HeatingTemperatureTrendPage]
})
export class HeatingTemperatureTrendPageModule {
}
