import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';


@Component({
    selector: 'watertank-current-temperature',
    templateUrl: 'watertank-current-temperature.page.html',
    styleUrls: ['watertank-current-temperature.page.scss']
})
export class WatertankCurrentTemperaturePage implements OnInit {

    constructor(private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Middle', 'Bottom'];
            const currentBarChart = chart('watertanktempbarchart', {
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
                    data: [{y: 20, color: '#02FE18'}, {y: 20, color: '#0099ff'}]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                currentBarChart.series[0].setData([msg.waterTankMiddle, msg.waterTankBottom]);
            });
        }, 30);
    }
}
