import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'current-power',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/power/current-power/current-power.module#CurrentPowerPageModule'
                    }
                ]
            },
            {
                path: 'current-temperature',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/temperature/current-temperature/current-temperature.module#CurrentTemperaturePageModule'
                    }
                ]
            },
            {
                path: 'current-co2',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/co2/current-co2/current-co2.module#CurrentCo2PageModule'
                    }
                ]
            },
            {
                path: 'current-humidity',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/humidity/current-humidity/current-humidity.module#CurrentHumidityPageModule'
                    }
                ]
            },
            {
                path: 'current-heating',
                children: [
                    {
                        path: '',
                        loadChildren:
                            '../pages/heating-temps/current-temperature/heating-current-temperature.module' +
                            '#HeatingCurrentTemperaturePageModule'
                    }
                ]
            },
            {
                path: 'current-watertank',
                children: [
                    {
                        path: '',
                        loadChildren:
                            '../pages/watertank-temps/current-temperature/watertank-current-temperature.module' +
                            '#WatertankCurrentTemperaturePageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/current-power',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/current-power',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
