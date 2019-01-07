import {Component, Input, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {boost} from 'highcharts/modules/boost';

import {DataProviderWs, HomePowerData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';

@Component({
    selector: 'power-trend',
    templateUrl: 'power-trend.page.html',
    styleUrls: ['power-trend.page.scss']
})
export class PowerTrendPage implements OnInit {

    constructor(private dataProvider: DataProviderWs) {
    }

    private lastMessage: HomePowerData = new HomePowerData();
    private showDebug = false;
    private msgCount = 0;
    private powerTrendChart;
    private homePowerData: Subscription;
    private heatBuffer = [];
    private loadBuffer = [];
    private pvBuffer = [];
    private gridBuffer = [];
    private preloading = true;

    private static getSeries() {
        return [{
            name: 'Heatpump Power Consumption',
            color: '#ff0000',
            data: []
        }, {
            name: 'House Energy Consumption',
            color: '#0099ff',
            data: []
        }, {
            name: 'PV Production',
            color: '#66ff33',
            data: []
        }, {
            name: 'Power Grid',
            color: '#000000',
            data: []
        }];
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const areaChartOptions = {
                title: {
                    text: 'Power'
                },
                chart: {
                    type: 'areaspline',
                    zoomType: 'x'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    plotLines: [{
                        color: 'red', // Color value
//                                dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                        value: 0, // Value of where the line will appear
                        width: 2 // Width of the line
                    }],
                    title: {
                        text: 'Watt'
                    }
                },
                // boost: {
                //     useGPUTranslations: true,
                //     boostDebug: true
                // },
                rangeSelector: {
                    selected: 1
                },
                plotOptions: CommonHighChartsSettings.getTrendPlotOptions(),
                time: {
                    timezone: 'Europe/Berlin'
                },
                series: PowerTrendPage.getSeries()
            };

            this.powerTrendChart = chart('powertrendchart', areaChartOptions);
            this.subscribeDataProvider();
        }, 300);
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        if (this.homePowerData) {
            this.homePowerData.unsubscribe();
        }

        this.homePowerData = this.dataProvider.getPowerMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
            const date = msg.date.getTime();
            this.lastMessage = msg;
            this.msgCount++;
            console.log('adding: ' + msg.date + ' grid: ' + msg.powerGrid);
            if (msg.powerGrid === 9999.0) {
                console.log('Terminator found, setting data and rendering chart');
                this.preloading = false;
                this.powerTrendChart.series[0].setData(this.heatBuffer, true);
                this.powerTrendChart.series[1].setData(this.loadBuffer, true);
                this.powerTrendChart.series[2].setData(this.pvBuffer, true);
                this.powerTrendChart.series[3].setData(this.gridBuffer, true);
            } else if (this.preloading) {
                this.heatBuffer.push([date, msg.heatpumpConsumption]);
                this.loadBuffer.push([date, msg.powerLoad]);
                this.pvBuffer.push([date, msg.powerPv]);
                this.gridBuffer.push([date, msg.powerGrid]);
            } else {
                this.powerTrendChart.series[0].addPoint([date, msg.heatpumpConsumption]);
                this.powerTrendChart.series[1].addPoint([date, msg.powerLoad]);
                this.powerTrendChart.series[2].addPoint([date, msg.powerPv]);
                this.powerTrendChart.series[3].addPoint([date, msg.powerGrid]);
            }
        });
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.heatBuffer = [];
        this.loadBuffer = [];
        this.pvBuffer = [];
        this.gridBuffer = [];
        this.preloading = true;
        this.powerTrendChart.update({
            series: PowerTrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }
}
