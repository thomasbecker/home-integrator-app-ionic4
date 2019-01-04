import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';

@Component({
    selector: 'current-co2',
    templateUrl: 'current-co2.page.html',
    styleUrls: ['current-co2.page.scss']
})
export class CurrentCo2Page implements OnInit {

    constructor(public navCtrl: NavController, private dataProvider: DataProviderWs) {
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Living room', 'Sleeping room'];
            const currentBarChart = chart('co2barchart', {
                chart: {
                    type: 'bar'
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
                    data: [{y: 20, color: '#000000'}, {y: 20, color: '#0099ff'}]
                }],
            });

            this.dataProvider.getEnvironmentMessages().subscribe(msg => {
                currentBarChart.series[0].setData([msg.livingRoomCo2, msg.sleepingRoomCo2]);
            });
        }, 30);
    }
}
