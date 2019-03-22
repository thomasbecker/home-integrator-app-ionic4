import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

const HEATPUMPPVCOVERAGEURL = 'http://little:9000/api/homePowerData/heatpumpPvCoverage/';

export interface Day {
    timestamp: number;
    heatPumpPvCoverage: HeatPumpPvCoverage;
}

export interface HeatPumpPvCoverage {
    consumption: number;
    coveredByPv: number;
    pv: number;
}

@Injectable()
export class DataProvider {
    constructor(private http: HttpClient) {
    }

    getHeatpumpPvCoverage(month: number, year: number) {
        if (month === -1) {
            return this.http.get<Array<Day>>(HEATPUMPPVCOVERAGEURL + `${year}`);
        } else {
            return this.http.get<Array<Day>>(HEATPUMPPVCOVERAGEURL + `${year}/${month}`);
        }
    }
}
