import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomePowerData} from '../../../dataProviderWs';
import {Platform} from '@ionic/angular';
import {AppSettings} from '../../../app.settings';

@Component({
    selector: 'current-power',
    templateUrl: 'current-power.page.html',
    styleUrls: ['current-power.page.scss']
})
export class CurrentPowerPage implements OnInit {

    lastMessage: HomePowerData = new HomePowerData();
    msgCount = 0;
    private barChart: chart;

    constructor(private dataProvider: DataProviderWs, private platform: Platform) {
        this.platform.resume.subscribe(() => {
            this.subscribeToBackend();
        });
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const categories = ['Power Grid', 'House Consumption', 'Heatpump Consumption', 'PV Production'];
            this.barChart = chart('powerbarchart', {
                chart: {
                    type: 'bar',
                    height: AppSettings.current_chart_height
                },
                title: {
                    text: 'Current Consumption/Yield'
                },
                xAxis: {
                    categories: categories,
                    reversed: false,
                    labels: {
                        step: 1
                    }
                },
                tooltip: {
                    valueSuffix: 'W'
                },
                plotOptions: {
                    dataLabels: {
                        enabled: true
                    },
                    series: {
                        stacking: 'normal'
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Consumption / Yield',
                    data: [
                        {y: -500, color: '#000000'},
                        {y: -500, color: '#0099ff'},
                        {y: -500, color: '#ff0000'},
                        {y: -500, color: '#00ff00'}]
                }],
            });
            this.subscribeToBackend();
        }, 300);
    }

    private subscribeToBackend() {
        this.dataProvider.getPowerMessages().subscribe(msg => {
            this.lastMessage = msg;
            this.msgCount++;
            this.barChart.series[0].setData([msg.powerGrid, msg.powerLoad, msg.heatpumpConsumption, msg.powerPv]);
        });
    }
}
