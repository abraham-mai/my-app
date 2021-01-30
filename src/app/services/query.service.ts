import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
  GetAccessTokenRequest,
  GetAccessTokenResponse,
  GetActivitiesResponse,
  GetEntriesResponse,
  GetUserConfigResponse,
} from '../domain';
import { HttpClient } from '@angular/common/http';
import { FilteringsService } from './filterings.service';
@Injectable({
  providedIn: 'root',
})
export class QueryService {
  private baseUrl = 'https://api.timeular.com';
  private api = '/api/v3';
  private date = '2020-01-01T00:00:00.000/2030-12-31T23:59:59.999';

  constructor(private http: HttpClient, private filterService: FilteringsService) {}

  public fetchData(): void {
    forkJoin({ activities: this.getActivities(), entries: this.getEntries() }).subscribe((content) => {
      this.filterService.activities = content.activities;
      this.filterService.entries = content.entries;
      this.filterService.startFilterData();
    });
  }

  public getAccessToken(credentialsInput: GetAccessTokenRequest): Observable<GetAccessTokenResponse> {
    return this.http.post<GetAccessTokenResponse>(`${this.baseUrl}${this.api}/developer/sign-in`, credentialsInput);
  }

  public getActivities(): Observable<GetActivitiesResponse> {
    return this.http.get<GetActivitiesResponse>(`${this.baseUrl}${this.api}/activities`);
  }

  public getEntries(): Observable<GetEntriesResponse> {
    return this.http.get<GetEntriesResponse>(`${this.baseUrl}${this.api}/time-entries/${this.date}`);
  }

  public getUserConfig(): Observable<GetUserConfigResponse> {
    return this.http.get<GetUserConfigResponse>(`../../assets/userConfig.json`);
  }
}
