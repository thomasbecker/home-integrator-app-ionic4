import {NgModule} from '@angular/core';
import {HistoryButtonsComponent} from './history-buttons/history-buttons.component';
import {IonicModule} from '@ionic/angular';
import {DebugPowerDataOutputComponent} from './debug-power-data-output/debug-power-data-output.component';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [IonicModule, CommonModule],
    declarations: [
        DebugPowerDataOutputComponent,
        HistoryButtonsComponent
    ],
    exports: [
        DebugPowerDataOutputComponent,
        HistoryButtonsComponent
    ],
})
export class ComponentsModule {}
