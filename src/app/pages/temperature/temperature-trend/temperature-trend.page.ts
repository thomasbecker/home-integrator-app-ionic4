import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';


@Component({
    selector: 'temperature-trend',
    templateUrl: 'temperature-trend.page.html',
    styleUrls: ['temperature-trend.page.scss']
})
export class TemperatureTrendPage implements OnInit {

    msgCount = 0;
    tempChart;
    homeEnvironmentData: Subscription;
    office = [];
    living = [];
    sleeping = [];

    constructor(private dataProvider: DataProviderWs) {
    }

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
            plotOptions: CommonHighChartsSettings.getTrendPlotOptions(),
            series: TemperatureTrendPage.getSeries()
        };

        this.tempChart = chart('temptrendchart', areaChartOptions);
        this.subscribeDataProvider();

    }

    public changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.office = [];
        this.living = [];
        this.sleeping = [];
        this.tempChart.update({
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
                this.msgCount++;
                if (this.msgCount < 40) {
                    this.office.push([date, msg.officeTemp]);
                    this.living.push([date, msg.livingRoomTemp]);
                    this.sleeping.push([date, msg.sleepingRoomTemp]);
                } else {
                    this.tempChart.series[0].addPoint([date, msg.officeTemp]);
                    this.tempChart.series[1].addPoint([date, msg.livingRoomTemp]);
                    this.tempChart.series[2].addPoint([date, msg.sleepingRoomTemp]);
                }
                if (this.msgCount === 40) {
                    this.tempChart.series[0].setData(this.office, true);
                    this.tempChart.series[1].setData(this.living, true);
                    this.tempChart.series[2].setData(this.sleeping, true);
                }
            });
    }
}
