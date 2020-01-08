import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {AppSettings} from '../../../app.settings';
import {Rooms} from '../../rooms';


@Component({
    selector: 'watertank-current-temperature',
    templateUrl: 'watertank-current-temperature.page.html',
    styleUrls: ['watertank-current-temperature.page.scss']
})
export class WatertankCurrentTemperaturePage implements OnInit {
    private lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    private msgCount = 0;

    constructor(private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Middle', 'Bottom'];
            const currentBarChart = chart('watertanktempbarchart', {
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
                    data: [
                        {y: 20, color: Rooms.watertankMiddle.getColor()},
                        {y: 20, color: Rooms.watertankBottom.getColor()}
                    ]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                this.lastMessage = msg;
                this.msgCount++;
                currentBarChart.series[0].setData([msg.waterTankMiddle, msg.waterTankBottom]);
            });
        }, 300);
    }
}
