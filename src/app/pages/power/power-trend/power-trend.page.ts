import {Component, Input, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {boost} from 'highcharts/modules/boost';
import * as Moment from 'moment';
import * as mTZ from 'moment-timezone';

import {DataProviderWs, HomePowerData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';

@Component({
    selector: 'power-trend',
    templateUrl: 'power-trend.page.html',
    styleUrls: ['power-trend.page.scss']
})
export class PowerTrendPage implements OnInit {

    constructor(private dataProvider: DataProviderWs) {
        Moment.locales();
        mTZ();
    }

    @Input() lastMessage: HomePowerData = new HomePowerData();
    showDebug = false;
    msgCount = 0;
    myChart;
    homePowerData: Subscription;
    heatBuffer = new Array();
    loadBuffer = new Array();
    pvBuffer = new Array();
    gridBuffer = new Array();

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
                // width: '100%',
                // height: '100%',
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
            plotOptions: {
                series: {
                    fillOpacity: 0.1,
                    dataLabels: {
                        format: '{point.y:.2f}',
                        enabled: true,
                        allowOverlap: false,
                        shadow: false,
                        style: {
                            textOutline: null,
                            color: 'black'
                        }
                    }
                }
            },
            time: {
                timezone: 'Europe/Berlin'
            },
            series: PowerTrendPage.getSeries()
        };

        this.myChart = chart('chart', areaChartOptions);
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
                this.myChart.series[0].addPoint([date, msg.heatpumpConsumption]);
                this.myChart.series[1].addPoint([date, msg.powerLoad]);
                this.myChart.series[2].addPoint([date, msg.powerPv]);
                this.myChart.series[3].addPoint([date, msg.powerGrid]);
            }
            if (this.msgCount === 40) {
                this.myChart.series[0].setData(this.heatBuffer, true);
                this.myChart.series[1].setData(this.loadBuffer, true);
                this.myChart.series[2].setData(this.pvBuffer, true);
                this.myChart.series[3].setData(this.gridBuffer, true);
            }
        });
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.heatBuffer = new Array();
        this.loadBuffer = new Array();
        this.pvBuffer = new Array();
        this.gridBuffer = new Array();
        this.myChart.update({
            series: PowerTrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }
}
