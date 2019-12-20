import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData, HomePowerData} from '../../../dataProviderWs';
import {NavController} from '@ionic/angular';
import {AppSettings} from '../../../app.settings';


@Component({
    selector: 'current-temperature',
    templateUrl: 'current-temperature.page.html',
    styleUrls: ['current-temperature.page.scss']
})
export class CurrentTemperaturePage implements OnInit {

    private lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    private msgCount = 0;

    constructor(private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Office', 'Living Room', 'Sleeping Room', 'Basement'];
            const currentBarChart = chart('tempbarchart', {
                chart: {
                    type: 'bar',
                    height: AppSettings.current_chart_height
                },
                title: {
                    text: 'Current Temperature'
                },
                xAxis: {
                    categories: categories,
                    reversed: false,
                    labels: {
                        step: 1
                    }
                },
                tooltip: {
                    valueSuffix: 'C'
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Temperature',
                    data: [{y: 20, color: '#02FE18'}, {y: 20, color: '#0099ff'}, {y: 20, color: '#FFE4C4'}, {y: 20, color: '#8B4513'}]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                this.lastMessage = msg;
                this.msgCount++;
                currentBarChart.series[0].setData([msg.officeTemp, msg.livingRoomTemp, msg.sleepingRoomTemp, msg.basementTemp]);
            });
        }, 300);
    }
}
