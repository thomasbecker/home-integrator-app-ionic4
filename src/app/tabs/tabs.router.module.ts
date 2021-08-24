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
                        loadChildren: () => import('../pages/power/current-power/current-power.module').then(m => m.CurrentPowerPageModule)
                    }
                ]
            },
            {
                path: 'current-temperature',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../pages/temperature/current-temperature/current-temperature.module')
                            .then(m => m.CurrentTemperaturePageModule)
                    }
                ]
            },
            {
                path: 'current-co2',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../pages/co2/current-co2/current-co2.module').then(m => m.CurrentCo2PageModule)
                    }
                ]
            },
            {
                path: 'current-humidity',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../pages/humidity/current-humidity/current-humidity.module')
                            .then(m => m.CurrentHumidityPageModule)
                    }
                ]
            },
            {
                path: 'current-heating',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../pages/heating-temps/current-temperature/heating-current-temperature.module')
                            .then(m => m.HeatingCurrentTemperaturePageModule)
                    }
                ]
            },
            {
                path: 'current-watertank',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../pages/watertank-temps/current-temperature/watertank-current-temperature.module')
                            .then(m => m.WatertankCurrentTemperaturePageModule)
                    }
                ]
            },
            {
                path: 'heatpump-pv-coverage',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../pages/heatpump-pv-coverage/heatpump-pv-coverage.module')
                            .then(m => m.HeatpumpPvCoveragePageModule)
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
