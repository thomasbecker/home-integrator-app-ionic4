import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';
import {Rooms} from '../../rooms';


@Component({
    selector: 'temperature-trend',
    templateUrl: 'temperature-trend.page.html',
    styleUrls: ['temperature-trend.page.scss']
})
export class TemperatureTrendPage implements OnInit {

    private lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    private msgCount = 0;
    private tempChart;
    private homeEnvironmentData: Subscription;
    private office = [];
    private living = [];
    private sleeping = [];
    private basement = [];
    private utilityRoom = [];
    private preloading = true;

    constructor(private dataProvider: DataProviderWs) {
    }

    private static getSeries() {
        return [{
            name: 'Office',
            color: Rooms.office.getColor(),
            data: []
        }, {
            name: 'Living room',
            color: Rooms.living.getColor(),
            data: []
        }, {
            name: 'Sleeping room',
            color: Rooms.sleeping.getColor(),
            data: []
        }, {
            name: 'Basement',
            color: Rooms.basement.getColor(),
            data: []
        }, {
            name: 'UtilityRoom',
            color: Rooms.utilityRoom.getColor(),
            data: []
        }];
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
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
        }, 300);
    }

    public changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.office = [];
        this.living = [];
        this.sleeping = [];
        this.basement = [];
        this.utilityRoom = [];
        this.preloading = true;
        this.tempChart.update({
            series: TemperatureTrendPage.getSeries()
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
                    this.tempChart.series[0].setData(this.office, true);
                    this.tempChart.series[1].setData(this.living, true);
                    this.tempChart.series[2].setData(this.sleeping, true);
                    this.tempChart.series[3].setData(this.basement, true);
                    this.tempChart.series[4].setData(this.utilityRoom, true);
                } else if (this.preloading) {
                    this.office.push([date, msg.officeTemp]);
                    this.living.push([date, msg.livingRoomTemp]);
                    this.sleeping.push([date, msg.sleepingRoomTemp]);
                    this.basement.push([date, msg.basementTemp]);
                    this.utilityRoom.push([date, msg.utilityRoomTemp]);
                } else {
                    this.tempChart.series[0].addPoint([date, msg.officeTemp]);
                    this.tempChart.series[1].addPoint([date, msg.livingRoomTemp]);
                    this.tempChart.series[2].addPoint([date, msg.sleepingRoomTemp]);
                    this.tempChart.series[3].addPoint([date, msg.basementTemp]);
                    this.tempChart.series[4].addPoint([date, msg.utilityRoomTemp]);
                }
            });
    }
}
