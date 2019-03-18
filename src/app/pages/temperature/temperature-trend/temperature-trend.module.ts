import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../../../components/components.module';
import {TemperatureTrendPage} from './temperature-trend.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule
    ],
    declarations: [TemperatureTrendPage],
    exports: [TemperatureTrendPage]
})
export class TemperatureTrendPageModule {
}
