import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';


@Component({
    selector: 'co2-trend',
    templateUrl: 'co2-trend.page.html',
    styleUrls: ['co2-trend.page.scss']
})
export class Co2TrendPage implements OnInit {
    msgCount = 0;
    myChart;
    homeEnvironmentData: Subscription;

    constructor(private dataProvider: DataProviderWs) {
    }

    private static getSeries() {
        return [{
            name: 'Living room Co2',
            color: '#ff0000',
            data: []
        }, {
            name: 'Sleeping room Co2',
            color: '#0099ff',
            data: []
        }];
    }

    ngOnInit() {
        const areaChartOptions = {
            title: {
                text: 'Co2'
            },
            chart: {
                type: 'areaspline',
                zoomType: 'x'
            },
            xAxis: {
                type: 'datetime',
            },
            yAxis: {
                title: {
                    text: 'ppm'
                }
            },
            rangeSelector: {
                selected: 1
            },
            animation: false,
            plotOptions: {
                series: {
                    fillOpacity: 0.1,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: Co2TrendPage.getSeries()
        };

        this.myChart = chart('co2trendchart', areaChartOptions);

        this.subscribeDataProvider();
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.myChart.update({
            series: Co2TrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        if (this.homeEnvironmentData) {
            this.homeEnvironmentData.unsubscribe();
        }

        this.homeEnvironmentData =
            this.dataProvider.getEnvironmentMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
                const date = msg.date.getTime();
                this.msgCount++;
                console.log('adding: ' + date);
                this.myChart.series[0].addPoint([date, msg.livingRoomCo2]);
                this.myChart.series[1].addPoint([date, msg.sleepingRoomCo2]);
            });

    }
}
