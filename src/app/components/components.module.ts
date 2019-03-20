import {NgModule} from '@angular/core';
import {HistoryButtonsComponent} from './history-buttons/history-buttons.component';
import {IonicModule} from '@ionic/angular';
import {DebugDataMsgOutputComponent} from './debug-data-msg-output/debug-data-msg-output.component';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [IonicModule, CommonModule],
    declarations: [
        DebugDataMsgOutputComponent,
        HistoryButtonsComponent
    ],
    exports: [
        DebugDataMsgOutputComponent,
        HistoryButtonsComponent
    ],
})
export class ComponentsModule {}
