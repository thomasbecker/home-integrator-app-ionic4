import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';

@Component({
    selector: 'humidity-trend',
    templateUrl: 'humidity-trend.page.html',
    styleUrls: ['humidity-trend.page.scss']
})
export class HumidityTrendPage implements OnInit {

    constructor(private dataProvider: DataProviderWs) {

    }

    msgCount = 0;
    humidityTrendChart;
    homeEnvironmentData: Subscription;
    living = [];
    sleeping = [];

    private static getSeries() {
        return [{
            name: 'Living room',
            color: '#ff0000',
            data: []
        }, {
            name: 'Sleeping room',
            color: '#0099ff',
            data: []
        }];
    }

    ngOnInit() {
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
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.sleeping = [];
        this.living = [];
        this.humidityTrendChart.update({
            series: HumidityTrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        if (this.homeEnvironmentData) {
            this.homeEnvironmentData.unsubscribe();
        }
        this.homeEnvironmentData = this.dataProvider.getEnvironmentMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
            const date = msg.date.getTime();
            this.msgCount++;
            console.log('adding: ' + date);
            if (this.msgCount < 40) {
                this.living.push([date, msg.livingRoomHumidity]);
                this.sleeping.push([date, msg.sleepingRoomHumidity]);
            } else {
                this.humidityTrendChart.series[0].addPoint([date, msg.livingRoomHumidity]);
                this.humidityTrendChart.series[1].addPoint([date, msg.sleepingRoomHumidity]);
            }
            if (this.msgCount === 40) {
                this.humidityTrendChart.series[0].setData(this.living, true);
                this.humidityTrendChart.series[1].setData(this.sleeping, true);
            }
        });
    }
}
