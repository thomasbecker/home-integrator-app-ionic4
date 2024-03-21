import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { addHours, getTime, subHours } from "date-fns";
import { WebsocketService } from "./websocket.service";
import { map } from "rxjs/operators";

const POWER_SERVER_URL = "ws://192.168.188.55:9000";
const ENVIRONMENT_SERVER_URL = "ws://192.168.188.55:9001";
const POWER_WITH_HISTORY_URL = POWER_SERVER_URL + "/api/homePowerData/5?from=";
const POWER_LIVE_URL = POWER_SERVER_URL + "/api/homePowerData/live/1";
const ENVIRONMENT_WITH_HISTORY_URL =
  ENVIRONMENT_SERVER_URL + "/api/homeEnvironmentData/10?from=";
const ENVIRONMENT_LIVE_URL =
  ENVIRONMENT_SERVER_URL + "/api/homeEnvironmentData/live/20";

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
  mobileCo2: number;
  mobileTemp: number;
  mobileHumidity: number;
  basementTemp: number;
  basementHumidity: number;
  heatingLeading: number;
  heatingInlet: number;
  waterTankMiddle: number;
  waterTankBottom: number;
  utilityRoomTemp: number;
  utilityRoomHumidity: number;
}

@Injectable()
export class DataProviderWs {
  private static homeEnvironmentSubject: Observable<HomeEnvironmentData>;
  private static homeEnvironmentWithHistorySubject: Observable<HomeEnvironmentData>;
  private static homePowerSubject: Observable<HomePowerData>;
  private static homePowerWithHistorySubject: Observable<HomePowerData>;

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
    const sleepingRoomHumidity = parseFloat(
      data.sleepingRoomHumidity.toFixed(2),
    );
    const mobileCo2 = parseFloat(data.mobileCo2.toFixed(2));
    const mobileTemp = parseFloat(data.mobileTemp.toFixed(2));
    const mobileHumidity = parseFloat(data.mobileHumidity.toFixed(2));
    const basementTemp = parseFloat(data.basementTemp.toFixed(2));
    const basementHumidity = parseFloat(data.basementHumidity.toFixed(2));
    const heatingLeading = parseFloat(data.heatingLeading.toFixed(2));
    const heatingInlet = parseFloat(data.heatingInlet.toFixed(2));
    const waterTankMiddle = parseFloat(data.waterTankMiddle.toFixed(2));
    const waterTankBottom = parseFloat(data.waterTankBottom.toFixed(2));
    const utilityRoomTemp = parseFloat(data.utilityRoomTemp.toFixed(2));
    const utilityRoomHumidity = parseFloat(data.utilityRoomHumidity.toFixed(2));
    return {
      date: date,
      officeTemp: officeTemp,
      livingRoomCo2: livingRoomCo2,
      livingRoomTemp: livingRoomTemp,
      livingRoomHumidity: livingRoomHumidity,
      sleepingRoomCo2: sleepingRoomCo2,
      sleepingRoomTemp: sleepingRoomTemp,
      sleepingRoomHumidity: sleepingRoomHumidity,
      mobileCo2: mobileCo2,
      mobileTemp: mobileTemp,
      mobileHumidity: mobileHumidity,
      basementTemp: basementTemp,
      basementHumidity: basementHumidity,
      heatingLeading: heatingLeading,
      heatingInlet: heatingInlet,
      waterTankMiddle: waterTankMiddle,
      waterTankBottom: waterTankBottom,
      utilityRoomTemp: utilityRoomTemp,
      utilityRoomHumidity: utilityRoomHumidity,
    };
  }

  public getEnvironmentMessages(): Observable<HomeEnvironmentData> {
    return DataProviderWs.homeEnvironmentSubject
      ? DataProviderWs.homeEnvironmentSubject
      : this.getHomeEnvironmentDataObservable();
  }

  private getHomeEnvironmentDataObservable() {
    const replaySubject = new ReplaySubject(1);
    const webSocketSubject = this.wsService.connect(ENVIRONMENT_LIVE_URL);
    webSocketSubject.subscribe(replaySubject);
    DataProviderWs.homeEnvironmentSubject = replaySubject.pipe(
      map((msg): HomeEnvironmentData => {
        return DataProviderWs.mapEnvironment(msg);
      }),
    );
    return DataProviderWs.homeEnvironmentSubject;
  }

  public resetEnvironmentWithHistorySubscription(): void {
    DataProviderWs.homeEnvironmentWithHistorySubject = undefined;
  }

  public getEnvironmentMessagesWithHistory(
    timestampStartHistory,
  ): Observable<HomeEnvironmentData> {
    return DataProviderWs.homeEnvironmentWithHistorySubject
      ? DataProviderWs.homeEnvironmentWithHistorySubject
      : this.getHomeEnvironmentDataWithHistoryObservable(timestampStartHistory);
  }

  private getHomeEnvironmentDataWithHistoryObservable(
    timestampStartHistory,
  ): Observable<HomeEnvironmentData> {
    const replaySubject = new ReplaySubject(1000);
    const webSocketSubject = this.wsService.connect(
      ENVIRONMENT_WITH_HISTORY_URL + timestampStartHistory,
    );
    webSocketSubject.subscribe(replaySubject);
    DataProviderWs.homeEnvironmentWithHistorySubject = replaySubject.pipe(
      map((msg): HomeEnvironmentData => {
        return DataProviderWs.mapEnvironment(msg);
      }),
    );
    return DataProviderWs.homeEnvironmentWithHistorySubject;
  }

  public getPowerMessages(): Observable<HomePowerData> {
    DataProviderWs.homePowerSubject = this.wsService
      .connect(POWER_LIVE_URL)
      .pipe(
        map((msg): HomePowerData => {
          return this.mapPower(msg);
        }),
      );
    return DataProviderWs.homePowerSubject;
  }

  public getPowerMessagesWithHistory(
    timestampStartHistory,
  ): Observable<HomePowerData> {
    DataProviderWs.homePowerWithHistorySubject = <Subject<HomePowerData>>(
      this.wsService
        .connect(POWER_WITH_HISTORY_URL + timestampStartHistory)
        .pipe(
          map((msg): HomePowerData => {
            return this.mapPower(msg);
          }),
        )
    );
    return DataProviderWs.homePowerWithHistorySubject;
  }

  public getTimestampOfNowSubstracting(hours) {
    const startHistoryDate = subHours(new Date(), hours);
    const timestampStartHistory = getTime(startHistoryDate);
    const timestampStartHistorySeconds = Math.floor(
      timestampStartHistory / 1000,
    );
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
      heatpumpConsumption: heatpumpConsumption,
    };
  }
}
