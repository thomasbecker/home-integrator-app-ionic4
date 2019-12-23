import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';

@Component({
    selector: 'humidity-trend',
    templateUrl: 'humidity-trend.page.html',
    styleUrls: ['humidity-trend.page.scss']
})
export class HumidityTrendPage implements OnInit {
    private msgCount = 0;
    private lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    private humidityTrendChart;
    private homeEnvironmentData: Subscription;
    private living = [];
    private sleeping = [];
    private basement = [];
    private preloading = true;

    constructor(private dataProvider: DataProviderWs) {
    }

    private static getSeries() {
        return [{
            name: 'Living room',
            color: '#0099ff',
            fillOpacity: 0.3,
            data: []
        }, {
            name: 'Sleeping room',
            color: '#FFE4C4',
            fillOpacity: 0.6,
            data: []
        }, {
            name: 'Basement',
            color: '#8B4513',
            fillOpacity: 0.2,
            data: []
        }];
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const areaChartOptions = {
                title: {
                    text: 'Humidity'
                },
                chart: {
                    type: 'areaspline',
                    zoomType: 'x'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: '%'
                    }
                },
                rangeSelector: {
                    selected: 1
                },
                plotOptions: CommonHighChartsSettings.getTrendPlotOptions(),
                series: HumidityTrendPage.getSeries()
            };

            this.humidityTrendChart = chart('humiditytrendchart', areaChartOptions);
            this.subscribeDataProvider();
        }, 300);
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.sleeping = [];
        this.living = [];
        this.basement = [];
        this.preloading = true;
        this.humidityTrendChart.update({
            series: HumidityTrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        // if (this.homeEnvironmentData) {
        //     this.homeEnvironmentData.unsubscribe();
        // }
        this.homeEnvironmentData = this.dataProvider.getEnvironmentMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
            const date = msg.date.getTime();
            this.msgCount++;
            this.lastMessage = msg;
            if (msg.officeTemp === 9999.0) {
                this.preloading = false;
                this.humidityTrendChart.series[0].setData(this.living, true);
                this.humidityTrendChart.series[1].setData(this.sleeping, true);
                this.humidityTrendChart.series[2].setData(this.basement, true);
            } else if (this.preloading) {
                this.living.push([date, msg.livingRoomHumidity]);
                this.sleeping.push([date, msg.sleepingRoomHumidity]);
                this.basement.push([date, msg.basementHumidity]);
            } else {
                this.humidityTrendChart.series[0].addPoint([date, msg.livingRoomHumidity]);
                this.humidityTrendChart.series[1].addPoint([date, msg.sleepingRoomHumidity]);
                this.humidityTrendChart.series[2].addPoint([date, msg.basementHumidity]);
            }
        });
    }
}
