import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';
import {Rooms} from '../../rooms';

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
    private utilityRoom = [];
    private preloading = true;

    constructor(private dataProvider: DataProviderWs) {
    }

    private static getSeries() {
        return [{
            name: 'Living room',
            color: Rooms.living.getColor(),
            fillOpacity: 0.3,
            data: []
        }, {
            name: 'Sleeping room',
            color: Rooms.sleeping.getColor(),
            fillOpacity: 0.6,
            data: []
        }, {
            name: 'Basement',
            color: Rooms.basement.getColor(),
            fillOpacity: 0.2,
            data: []
        }, {
            name: 'UtilityRoom',
            color: Rooms.utilityRoom.getColor(),
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
        this.utilityRoom = [];
        this.preloading = true;
        this.humidityTrendChart.update({
            series: HumidityTrendPage.getSeries()
        });
        this.dataProvider.resetEnvironmentWithHistorySubscription();
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        this.homeEnvironmentData = this.dataProvider.getEnvironmentMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
            const date = msg.date.getTime();
            this.msgCount++;
            this.lastMessage = msg;
            if (msg.officeTemp === 9999.0) {
                this.preloading = false;
                this.humidityTrendChart.series[0].setData(this.living, true);
                this.humidityTrendChart.series[1].setData(this.sleeping, true);
                this.humidityTrendChart.series[2].setData(this.basement, true);
                this.humidityTrendChart.series[3].setData(this.utilityRoom, true);
            } else if (this.preloading) {
                this.living.push([date, msg.livingRoomHumidity]);
                this.sleeping.push([date, msg.sleepingRoomHumidity]);
                this.basement.push([date, msg.basementHumidity]);
                this.utilityRoom.push([date, msg.utilityRoomHumidity]);
            } else {
                this.humidityTrendChart.series[0].addPoint([date, msg.livingRoomHumidity]);
                this.humidityTrendChart.series[1].addPoint([date, msg.sleepingRoomHumidity]);
                this.humidityTrendChart.series[2].addPoint([date, msg.basementHumidity]);
                this.humidityTrendChart.series[3].addPoint([date, msg.utilityRoomHumidity]);
            }
        });
    }
}
