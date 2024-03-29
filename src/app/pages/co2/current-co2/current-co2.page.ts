import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {AppSettings} from '../../../app.settings';
import {Rooms} from '../../rooms';

@Component({
    selector: 'current-co2',
    templateUrl: 'current-co2.page.html',
    styleUrls: ['current-co2.page.scss']
})
export class CurrentCo2Page implements OnInit {
    lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    msgCount = 0;

    constructor(public navCtrl: NavController, private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Living room', 'Sleeping room', 'mobile'];
            const currentBarChart = chart('co2barchart', {
                chart: {
                    type: 'bar',
                    height: AppSettings.current_chart_height
                },
                title: {
                    text: 'Current Co2'
                },
                xAxis: {
                    categories: categories,
                    reversed: false,
                    labels: {
                        step: 1
                    }
                },
                tooltip: {
                    valueSuffix: 'ppm'
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
                    name: 'Co2',
                    data: [
                        {y: 20, color: Rooms.living.getColor()},
                        {y: 20, color: Rooms.sleeping.getColor()},
                        {y: 20, color: Rooms.mobile.getColor()}]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                this.msgCount++;
                this.lastMessage = msg;
                currentBarChart.series[0].setData([msg.livingRoomCo2, msg.sleepingRoomCo2, msg.mobileCo2]);
            });
        }, 30);
    }
}
