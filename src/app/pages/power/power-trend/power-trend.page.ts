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

    @Input() lastMessage: HomePowerData = new HomePowerData();
    showDebug = false;
    msgCount = 0;
    powerTrendChart;
    homePowerData: Subscription;
    heatBuffer = [];
    loadBuffer = [];
    pvBuffer = [];
    gridBuffer = [];

    private static getSeries() {
        return [{
            boostThreshold: 1,
            boostDebug: true,
            marker: false,
            name: 'Heatpump Power Consumption',
            color: '#ff0000',
            data: []
        }, {
            boostThreshold: 1,
            boostDebug: true,
            marker: false,
            name: 'House Energy Consumption',
            color: '#0099ff',
            data: []
        }, {
            boostThreshold: 1,
            boostDebug: true,
            marker: false,
            name: 'PV Production',
            color: '#66ff33',
            data: []
        }, {
            boostThreshold: 1,
            boostDebug: true,
            marker: false,
            name: 'Power Grid',
            color: '#000000',
            data: []
        }];
    }

    ngOnInit() {
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
            boost: {
                useGPUTranslations: true,
                boostDebug: true
            },
            rangeSelector: {
                selected: 1
            },
            plotOptions: CommonHighChartsSettings.getTrendPlotOptions(),
            time: {
                timezone: 'Europe/Berlin'
            },
            series: PowerTrendPage.getSeries()
        };

        this.powerTrendChart = chart('chart', areaChartOptions);
        this.subscribeDataProvider();
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        if (this.homePowerData) {
            this.homePowerData.unsubscribe();
        }

        this.homePowerData = this.dataProvider.getPowerMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
            const date = msg.date.getTime();
            this.lastMessage = msg;
            this.msgCount++;
            console.log('adding: ' + msg.date);
            if (this.msgCount < 40) {
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
            if (this.msgCount === 40) {
                this.powerTrendChart.series[0].setData(this.heatBuffer, true);
                this.powerTrendChart.series[1].setData(this.loadBuffer, true);
                this.powerTrendChart.series[2].setData(this.pvBuffer, true);
                this.powerTrendChart.series[3].setData(this.gridBuffer, true);
            }
        });
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.heatBuffer = [];
        this.loadBuffer = [];
        this.pvBuffer = [];
        this.gridBuffer = [];
        this.powerTrendChart.update({
            series: PowerTrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }
}
