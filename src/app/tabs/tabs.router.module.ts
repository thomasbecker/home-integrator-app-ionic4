import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

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
        path: 'power-trend',
        children: [
          {
            path: '',
            loadChildren: '../pages/power/power-trend/power-trend.module#PowerTrendPageModule'
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
        path: 'temperature-trend',
        children: [
          {
            path: '',
            loadChildren: '../pages/temperature/temperature-trend/temperature-trend.module#TemperatureTrendPageModule'
          }
        ]
      },
      {
        path: 'co2-trend',
        children: [
          {
            path: '',
            loadChildren: '../pages/co2/co2-trend/co2-trend.module#Co2TrendPageModule'
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
        path: 'humidity-trend',
        children: [
          {
            path: '',
            loadChildren: '../pages/humidity/humidity-trend/humidity-trend.module#HumidityTrendPageModule'
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
export class TabsPageRoutingModule {}
