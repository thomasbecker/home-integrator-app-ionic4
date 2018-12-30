import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';


@Component({
    selector: 'temperature-trend',
    templateUrl: 'temperature-trend.page.html',
    styleUrls: ['temperature-trend.page.scss']
})
export class TemperatureTrendPage implements OnInit {

    constructor(private dataProvider: DataProviderWs) {
    }
    msgCount = 0;
    myChart;
    homeEnvironmentData: Subscription;

    private static getSeries() {
        return [{
            name: 'Office',
            color: '#02FE18',
            data: []
        }, {
            name: 'Living room',
            color: '#0099ff',
            data: []
        }, {
            name: 'Sleeping room',
            color: '#D37515',
            data: []
        }];
    }

    ngOnInit() {
        const areaChartOptions = {
            title: {
                text: 'Temperature'
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
                    text: 'Celsius'
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
            series: TemperatureTrendPage.getSeries()
        };

        this.myChart = chart('temptrendchart', areaChartOptions);
        this.subscribeDataProvider();

    }

    public changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.myChart.update({
            series: TemperatureTrendPage.getSeries()
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
            console.log('adding: ' + date);
            this.myChart.series[0].addPoint([date, msg.officeTemp]);
            this.myChart.series[1].addPoint([date, msg.livingRoomTemp]);
            this.myChart.series[2].addPoint([date, msg.sleepingRoomTemp]);
        });

    }
}
