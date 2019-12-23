import {Component, OnInit} from '@angular/core';
import {chart} from 'highcharts';
import {DataProviderWs, HomeEnvironmentData} from '../../../dataProviderWs';
import {Subscription} from 'rxjs';
import {CommonHighChartsSettings} from '../../CommonHighChartsSettings';


@Component({
    selector: 'heating-temperature-trend',
    templateUrl: 'heating-temperature-trend.page.html',
    styleUrls: ['heating-temperature-trend.page.scss']
})
export class HeatingTemperatureTrendPage implements OnInit {

    private lastMessage: HomeEnvironmentData = new HomeEnvironmentData();
    private msgCount = 0;
    private tempChart;
    private homeEnvironmentData: Subscription;
    private leading = [];
    private inlet = [];
    private preloading = true;

    constructor(private dataProvider: DataProviderWs) {
    }

    private static getSeries() {
        return [{
            name: 'Leading',
            color: '#02FE18',
            data: []
        }, {
            name: 'Inlet',
            color: '#D37515',
            data: []
        }];
    }

    ngOnInit() {
        window.setTimeout(() => { // hack to get responsive width working on initial load
            const areaChartOptions = {
                title: {
                    text: 'Heating Temperature'
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
                series: HeatingTemperatureTrendPage.getSeries()
            };

            this.tempChart = chart('heatingtemptrendchart', areaChartOptions);
            this.subscribeDataProvider();
        }, 300);
    }

    public changeHistoryHours(hours: number) {
        this.msgCount = 0;
        this.leading = [];
        this.inlet = [];
        this.preloading = true;
        this.tempChart.update({
            series: HeatingTemperatureTrendPage.getSeries()
        });
        this.subscribeDataProvider(this.dataProvider.getTimestampOfNowSubstracting(hours));
    }

    private subscribeDataProvider(newTimestampStartHistory = this.dataProvider.getTimestampOfNowSubstracting(4)) {
        // if (this.homeEnvironmentData) {
        //     this.homeEnvironmentData.unsubscribe();
        // }
        console.log('received heating trend');
        this.homeEnvironmentData =
            this.dataProvider.getEnvironmentMessagesWithHistory(newTimestampStartHistory).subscribe(msg => {
                const date = msg.date.getTime();
                this.msgCount++;
                this.lastMessage = msg;
                if (msg.officeTemp === 9999.0) {
                    this.preloading = false;
                    this.tempChart.series[0].setData(this.leading, true);
                    this.tempChart.series[1].setData(this.inlet, true);
                } else if (this.preloading) {
                    this.leading.push([date, msg.heatingLeading]);
                    this.inlet.push([date, msg.heatingInlet]);
                } else {
                    this.tempChart.series[0].addPoint([date, msg.heatingLeading]);
                    this.tempChart.series[1].addPoint([date, msg.heatingInlet]);
                }
            });
    }
}
