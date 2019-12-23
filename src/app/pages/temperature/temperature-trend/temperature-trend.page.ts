import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';


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
    private preloading = true;

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
            color: '#FFE4C4',
            data: []
        }, {
            name: 'Basement',
            color: '#8B4513',
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
        this.preloading = true;
        this.tempChart.update({
            series: TemperatureTrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        // if (this.homeEnvironmentData) {
        //     this.homeEnvironmentData.unsubscribe();
        // }
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
                } else if (this.preloading) {
                    this.office.push([date, msg.officeTemp]);
                    this.living.push([date, msg.livingRoomTemp]);
                    this.sleeping.push([date, msg.sleepingRoomTemp]);
                    this.basement.push([date, msg.basementTemp]);
                } else {
                    this.tempChart.series[0].addPoint([date, msg.officeTemp]);
                    this.tempChart.series[1].addPoint([date, msg.livingRoomTemp]);
                    this.tempChart.series[2].addPoint([date, msg.sleepingRoomTemp]);
                    this.tempChart.series[3].addPoint([date, msg.basementTemp]);
                }
            });
    }
}
