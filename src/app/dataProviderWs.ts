import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {addHours, getTime, subHours} from 'date-fns';
import {WebsocketService} from './websocket.service';
import {map} from 'rxjs/operators';

const POWER_SERVER_URL = 'ws://little:9000';
const ENVIRONMENT_SERVER_URL = 'ws://little:9001';
const POWER_WITH_HISTORY_URL = POWER_SERVER_URL + '/api/homePowerData/60?from=';
const POWER_LIVE_URL = POWER_SERVER_URL + '/api/homePowerData/live/3';
const ENVIRONMENT_WITH_HISTORY_URL = ENVIRONMENT_SERVER_URL + '/api/homeEnvironmentData/120?from=';
const ENVIRONMENT_LIVE_URL = ENVIRONMENT_SERVER_URL + '/api/homeEnvironmentData/live/120';

export class HomePowerData {
  date: Date;
  powerPv: number;
  powerGrid: number;
  powerLoad: number;
  heatpumpConsumption: number;
}

export class HomeEnvironmentData {
  date: Date;
  officeTemp: number;
  livingRoomCo2: number;
  livingRoomTemp: number;
  livingRoomHumidity: number;
  sleepingRoomCo2: number;
  sleepingRoomTemp: number;
  sleepingRoomHumidity: number;
}

@Injectable()
export class DataProviderWs {

  constructor(wsService: WebsocketService) {
    this.wsService = wsService;
  }
  private wsService: WebsocketService;

  private static mapEnvironment(data): HomeEnvironmentData {
    const date = addHours(new Date(data.timestamp), 1);
    const officeTemp = parseFloat(data.officeTemp.toFixed(2));
    const livingRoomCo2 = parseFloat(data.livingRoomCo2.toFixed(2));
    const livingRoomTemp = parseFloat(data.livingRoomTemp.toFixed(2));
    const livingRoomHumidity = parseFloat(data.livingRoomHumidity.toFixed(2));
    const sleepingRoomCo2 = parseFloat(data.sleepingRoomCo2.toFixed(2));
    const sleepingRoomTemp = parseFloat(data.sleepingRoomTemp.toFixed(2));
    const sleepingRoomHumidity = parseFloat(data.sleepingRoomHumidity.toFixed(2));
    return {
      date: date,
      officeTemp: officeTemp,
      livingRoomCo2: livingRoomCo2,
      livingRoomTemp: livingRoomTemp,
      livingRoomHumidity: livingRoomHumidity,
      sleepingRoomCo2: sleepingRoomCo2,
      sleepingRoomTemp: sleepingRoomTemp,
      sleepingRoomHumidity: sleepingRoomHumidity
    };
  }

  public getEnvironmentMessages(): Subject<HomeEnvironmentData> {
    return <Subject<HomeEnvironmentData>>this.wsService
      .connect(ENVIRONMENT_LIVE_URL)
      .pipe(map((response: MessageEvent): HomeEnvironmentData => {
        const data = JSON.parse(response.data);
        return DataProviderWs.mapEnvironment(data);
      }));
  }

  public getEnvironmentMessagesWithHistory(timestampStartHistory): Subject<HomeEnvironmentData> {
    return <Subject<HomeEnvironmentData>>this.wsService
      .connect(ENVIRONMENT_WITH_HISTORY_URL + timestampStartHistory)
      .pipe(map((response: MessageEvent): HomeEnvironmentData => {
        const data = JSON.parse(response.data);
        return DataProviderWs.mapEnvironment(data);
      }));
  }

  public getPowerMessages(): Subject<HomePowerData> {
    return <Subject<HomePowerData>>this.wsService
      .connect(POWER_LIVE_URL)
      .pipe(map((response: MessageEvent): HomePowerData => {
        const data = JSON.parse(response.data);
        return this.mapPower(data);
      }));
  }

  public getPowerMessagesWithHistory(timestampStartHistory): Subject<HomePowerData> {
    return <Subject<HomePowerData>>this.wsService
      .connect(POWER_WITH_HISTORY_URL + timestampStartHistory)
      .pipe(map((response: MessageEvent): HomePowerData => {
        const data = JSON.parse(response.data);
        return this.mapPower(data);
      }));
  }

  public getTimestampOfNowSubstracting(hours) {
    const startHistoryDate = subHours(new Date(), hours);
    const timestampStartHistory = getTime(startHistoryDate);
    const timestampStartHistorySeconds = Math.floor(timestampStartHistory / 1000);
    return timestampStartHistorySeconds;
  }

  private mapPower(data): HomePowerData {
    const date = addHours(new Date(data.timestamp), 1);
    // let date = data.timestamp;
    let powerPv = data.powerPv == null ? 0 : data.powerPv;
    const powerGrid = data.powerGrid == null ? 0 : data.powerGrid;
    let powerLoad = data.powerLoad == null ? 0 : data.powerLoad;
// var selfConsumption = data.powerFlowSite.selfConsumption == null ? 0 : data.powerFlowSite.selfConsumption;
// var autonomy = data.powerFlowSite.autonomy == null ? 0 : data.powerFlowSite.autonomy;
    powerPv = Math.abs(powerPv.toFixed(2));
    // powerGrid = parseFloat(powerGrid).toFixed(2);
    powerLoad = Math.abs(powerLoad.toFixed(2));
    const heatpumpConsumption = data.heatpumpCurrentPowerConsumption * 1000;
    return {
      date: date,
      powerPv: powerPv,
      powerGrid: powerGrid,
      powerLoad: powerLoad,
      heatpumpConsumption: heatpumpConsumption
    };
  }
}
