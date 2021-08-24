import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';
import {Rooms} from '../../rooms';


@Component({
    selector: 'co2-trend',
    templateUrl: 'co2-trend.page.html',
    styleUrls: ['co2-trend.page.scss']
})
export class Co2TrendPage implements OnInit {
    lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    msgCount = 0;
    private co2TrendChart;
    private homeEnvironmentData: Subscription;
    private living = [];
    private sleeping = [];
    private mobile = [];
    private preloading = true;

    constructor(private dataProvider: DataProviderWs) {
    }

    private static getSeries() {
        return [{
            name: Rooms.living.getName(),
            color: Rooms.living.getColor(),
            data: []
        }, {
            name: Rooms.sleeping.getName(),
            color: Rooms.sleeping.getColor(),
            data: []
        }, {
            name: Rooms.mobile.getName(),
            color: Rooms.mobile.getColor(),
            data: []
        }];
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
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
                plotOptions: CommonHighChartsSettings.getTrendPlotOptions(),
                series: Co2TrendPage.getSeries()
            };

            this.co2TrendChart = chart('co2trendchart', areaChartOptions);

            this.subscribeDataProvider();
        }, 30);
    }

    changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.living = [];
        this.sleeping = [];
        this.mobile = [];
        this.preloading = true;
        this.co2TrendChart.update({
            series: Co2TrendPage.getSeries()
        });
        this.dataProvider.resetEnvironmentWithHistorySubscription();
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        this.homeEnvironmentData =
            this.dataProvider.getEnvironmentMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
                const date = msg.date.getTime();
                this.msgCount++;
                this.lastMessage = msg;
                if (msg.officeTemp === 9999.0) {
                    console.log('Terminator found, setting data and rendering chart');
                    this.preloading = false;
                    this.co2TrendChart.series[0].setData(this.living, true);
                    this.co2TrendChart.series[1].setData(this.sleeping, true);
                    this.co2TrendChart.series[2].setData(this.mobile, true);
                } else if (this.preloading) {
                    this.living.push([date, msg.livingRoomCo2]);
                    this.sleeping.push([date, msg.sleepingRoomCo2]);
                    this.mobile.push([date, msg.mobileCo2]);
                } else {
                    this.co2TrendChart.series[0].addPoint([date, msg.livingRoomCo2]);
                    this.co2TrendChart.series[1].addPoint([date, msg.sleepingRoomCo2]);
                    this.co2TrendChart.series[2].addPoint([date, msg.mobileCo2]);
                }
            });

    }
}
