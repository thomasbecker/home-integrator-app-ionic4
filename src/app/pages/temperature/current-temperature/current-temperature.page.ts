import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {AppSettings} from '../../../app.settings';
import {Rooms} from '../../rooms';


@Component({
    selector: 'current-temperature',
    templateUrl: 'current-temperature.page.html',
    styleUrls: ['current-temperature.page.scss']
})
export class CurrentTemperaturePage implements OnInit {

    lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    msgCount = 0;

    constructor(private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Office', 'Living Room', 'Sleeping Room', 'Basement', 'UtilityRoom', 'Mobile'];
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
                    data: [
                        {y: 20, color: Rooms.office.getColor()},
                        {y: 20, color: Rooms.living.getColor()},
                        {y: 20, color: Rooms.sleeping.getColor()},
                        {y: 20, color: Rooms.basement.getColor()},
                        {y: 20, color: Rooms.utilityRoom.getColor()},
                        {y: 20, color: Rooms.mobile.getColor()}
                    ]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                this.lastMessage = msg;
                this.msgCount++;
                currentBarChart.series[0]
                    .setData(
                        [msg.officeTemp,
                            msg.livingRoomTemp,
                            msg.sleepingRoomTemp,
                            msg.basementTemp,
                            msg.utilityRoomTemp,
                            msg.mobileTemp]
                    );
            });
        }, 300);
    }
}
