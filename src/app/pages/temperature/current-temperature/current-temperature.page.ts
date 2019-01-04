import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';
import {NavController} from '@ionic/angular';


@Component({
    selector: 'current-temperature',
    templateUrl: 'current-temperature.page.html',
    styleUrls: ['current-temperature.page.scss']
})
export class CurrentTemperaturePage implements OnInit {

    constructor(private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Office', 'Living Room', 'Sleeping Room'];
            const currentBarChart = chart('tempbarchart', {
                chart: {
                    type: 'bar'
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
                    data: [{y: 20, color: '#02FE18'}, {y: 20, color: '#0099ff'}, {y: 20, color: '#D37515'}]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                currentBarChart.series[0].setData([msg.officeTemp, msg.livingRoomTemp, msg.sleepingRoomTemp]);
            });
        }, 30);
    }
}
