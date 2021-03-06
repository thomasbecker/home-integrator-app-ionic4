import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {AppSettings} from '../../../app.settings';
import {Rooms} from '../../rooms';


@Component({
    selector: 'current-humidity',
    templateUrl: 'current-humidity.page.html',
    styleUrls: ['current-humidity.page.scss']
})
export class CurrentHumidityPage implements OnInit {
    private lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    private msgCount = 0;

    constructor(public navCtrl: NavController, private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Living room humidity', 'Sleeping room humidity', 'Basement', 'UtilityRoom'];
            const currentBarChart = chart('humiditybarchart', {
                chart: {
                    type: 'bar',
                    height: AppSettings.current_chart_height
                },
                title: {
                    text: 'Current humidity'
                },
                xAxis: {
                    categories: categories,
                    reversed: false,
                    labels: {
                        step: 1
                    }
                },
                tooltip: {
                    valueSuffix: '%'
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
                    name: 'humidity',
                    data: [
                        {y: 20, color: Rooms.living.getColor()},
                        {y: 20, color: Rooms.sleeping.getColor()},
                        {y: 20, color: Rooms.basement.getColor()},
                        {y: 20, color: Rooms.utilityRoom.getColor()}
                    ]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                this.lastMessage = msg;
                this.msgCount++;
                currentBarChart.series[0]
                    .setData([msg.livingRoomHumidity, msg.sleepingRoomHumidity, msg.basementHumidity, msg.utilityRoomHumidity]);
            });
        }, 300);
    }
}
