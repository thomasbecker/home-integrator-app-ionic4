import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';
import {Rooms} from '../../rooms';


@Component({
    selector: 'watertank-temperature-trend',
    templateUrl: 'watertank-temperature-trend.page.html',
    styleUrls: ['watertank-temperature-trend.page.scss']
})
export class WatertankTemperatureTrendPage implements OnInit {

    lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    msgCount = 0;
    private tempChart;
    private homeEnvironmentData: Subscription;
    private middle = [];
    private bottom = [];
    private preloading = true;

    constructor(private dataProvider: DataProviderWs) {
    }

    private static getSeries() {
        return [{
            name: 'Middle Sensor',
            color: Rooms.watertankMiddle.getColor(),
            data: []
        }, {
            name: 'Bottom Sensor',
            color: Rooms.watertankBottom.getColor(),
            data: []
        }];
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const areaChartOptions = {
                title: {
                    text: 'Watertank Temperature'
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
                series: WatertankTemperatureTrendPage.getSeries()
            };

            this.tempChart = chart('watertanktemptrendchart', areaChartOptions);
            this.subscribeDataProvider();
        }, 300);
    }

    public changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.middle = [];
        this.bottom = [];
        this.preloading = true;
        this.tempChart.update({
            series: WatertankTemperatureTrendPage.getSeries()
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
                    this.tempChart.series[0].setData(this.middle, true);
                    this.tempChart.series[1].setData(this.bottom, true);
                } else if (this.preloading) {
                    this.middle.push([date, msg.waterTankMiddle]);
                    this.bottom.push([date, msg.waterTankBottom]);
                } else {
                    this.tempChart.series[0].addPoint([date, msg.waterTankMiddle]);
                    this.tempChart.series[1].addPoint([date, msg.waterTankBottom]);
                }
            });
    }
}
