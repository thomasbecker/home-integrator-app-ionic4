import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { chart } from "highcharts";
import { DataProvider, Day } from "../../dataProvider";
import * as moment from "moment";
import { timestamp } from "rxjs/operators";

@Component({
  selector: "heating-current-temperature",
  templateUrl: "heatpump-pv-coverage.html",
  styleUrls: ["heatpump-pv-coverage.page.scss"],
})
export class HeatpumpPvCoveragePage implements OnInit {
  months: string[] = moment.months();
  years: number[] = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  currentMonth: number = moment().month() + 1;
  currentYear: number = moment().year();
  private currentBarChart: chart;

  constructor(private dataProvider: DataProvider) {}

  ngOnInit() {
    window.setTimeout(() => {
      // hack to get responsive width working on initial load
      this.renderGraph();
    }, 300);
  }

  getMonthBy(name: string) {
    return moment().month(name).format("M");
  }

  renderGraph(
    month: number = this.currentMonth,
    year: number = this.currentYear,
  ) {
    let tickinterval;
    if (month === -1) {
      tickinterval = 28 * 24 * 3600 * 1000;
    } else {
      tickinterval = 24 * 3600 * 1000;
    }

    this.currentBarChart = chart("heatpumppvcoverage", {
      chart: {
        type: "column",
        height: 600,
      },
      title: {
        text: "",
      },
      xAxis: {
        type: "datetime",
        tickinterval: tickinterval,
        labels: {
          rotation: -45,
          align: "right",
        },
        dateTimeLabelFormats: {
          // don't display the dummy year
          day: "%e. %b",
        },
      },
      yAxis: {
        min: 0,
        max: 105,
        endOnTick: false,
        title: {
          text: "Total heatpump consumption",
        },
        stackLabels: {
          enabled: true,
          formatter: function () {
            return this.total.toFixed(2);
          },
        },
      },
      tooltip: {
        valueDecimals: 2,
      },
      plotOptions: {
        series: {
          stacking: "percent",
          pointRange: tickinterval, // one day
        },
      },
    });

    this.getDataFor(month, year);
  }

  private getDataFor(month: number, year: number) {
    this.dataProvider
      .getHeatpumpPvCoverage(month, year)
      .subscribe((msg: Array<Day>) => {
        const consumptions = [];
        const coveredByPvs = [];

        for (const day of msg) {
          const date = new Date(day.timestamp * 1000);
          const consumption = day.heatPumpPvCoverage.consumption;
          const coveredByPv = day.heatPumpPvCoverage.coveredByPv;
          const notCoveredByPv = consumption - coveredByPv;
          consumptions.push([day.timestamp * 1000, notCoveredByPv]);
          coveredByPvs.push([day.timestamp * 1000, coveredByPv]);
        }

        this.currentBarChart.addSeries({
          name: "consumption",
          data: consumptions,
          color: "#ff2400",
        });
        this.currentBarChart.addSeries({
          name: "coveredByPv",
          data: coveredByPvs,
          color: "#00ff00",
        });
      });
  }

  private daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
}
