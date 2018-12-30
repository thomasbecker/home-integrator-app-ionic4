import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CurrentHumidityPage} from './current-humidity.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: CurrentHumidityPage}])
    ],
    declarations: [CurrentHumidityPage]
})
export class CurrentHumidityPageModule {
}
