import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
import { getAuthToken } from '../auth/auth.repository';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';

interface UserActionRequestData {
  authToken: string;
  data: {
    duid: string | null;
    action: string;
    functionality: string;
    platform: string | null;
    connectionType: string;
  };
}

interface UserActionDetails {
  action: 'OPEN';
  functionality: string;
}


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(
    @Inject('environment')
    private environment: any,
    private http: HttpClient,
  ) {}

  public onFunctionalityOpened(statisticName: string) {
    if(!statisticName) {
      return;
    }

    this.postUserActionStatistic({
      action: 'OPEN',
      functionality: statisticName
    }).subscribe();
  }

  private postUserActionStatistic(userActionDetails: UserActionDetails): Observable<void> {
    const url = `${this.environment.apiEndpoint}/statistics/user-action`;

    return combineLatest([getAuthToken(), from(Device.getId()), from(Network.getStatus())]).pipe(
      first(),
      switchMap(([authToken, deviceId, connectionStatus]) => {
        const data: UserActionRequestData = {
          authToken,
          data: {
            duid: deviceId.identifier,
            action: userActionDetails.action,
            functionality: userActionDetails.functionality,
            platform: Capacitor.getPlatform(),
            connectionType: connectionStatus.connectionType
          }
        };

        return this.http.post<void>(url, data);
      }),
      catchError(() => of(null))
    );
  }
}
