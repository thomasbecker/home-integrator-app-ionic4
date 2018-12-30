import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';

@Component({
    selector: 'humidity-trend',
    templateUrl: 'humidity-trend.page.html',
    styleUrls: ['humidity-trend.page.scss']
})
export class HumidityTrendPage implements OnInit {

    constructor(private dataProvider: DataProviderWs) {

    }

    msgCount = 0;
    myChart;
    homeEnvironmentData: Subscription;

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
            plotOptions: {
                series: {
                    fillOpacity: 0.1,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: HumidityTrendPage.getSeries()
        };

        this.myChart = chart('humiditytrendchart', areaChartOptions);
        this.subscribeDataProvider();
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.myChart.update({
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
            this.myChart.series[0].addPoint([date, msg.livingRoomHumidity]);
            this.myChart.series[1].addPoint([date, msg.sleepingRoomHumidity]);
        });
    }
}
