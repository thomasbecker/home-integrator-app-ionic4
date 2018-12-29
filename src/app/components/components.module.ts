import {NgModule} from '@angular/core';
import {HistoryButtonsComponent} from './history-buttons/history-buttons.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
    imports: [IonicModule],
    declarations: [
        HistoryButtonsComponent
    ],
    exports: [
        HistoryButtonsComponent
    ],
})
export class ComponentsModule {}
