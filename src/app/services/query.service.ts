import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
  CreateUserConfigRequest,
  GetAccessTokenRequest,
  GetAccessTokenResponse,
  GetActivitiesResponse,
  GetEntriesResponse,
  GetUserConfigResponse,
  UserConfigItem,
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

  private userApi = 'http://ec2-52-212-173-130.eu-west-1.compute.amazonaws.com:3000';

  constructor(private http: HttpClient) {}

  // GET
  public getAccessToken(credentialsInput: GetAccessTokenRequest): Observable<GetAccessTokenResponse> {
    return this.http.post<GetAccessTokenResponse>(`${this.baseUrl}${this.api}/developer/sign-in`, credentialsInput);
  }

  public getActivities(): Observable<GetActivitiesResponse> {
    return this.http.get<GetActivitiesResponse>(`${this.baseUrl}${this.api}/activities`);
  }

  public getEntries(): Observable<GetEntriesResponse> {
    return this.http.get<GetEntriesResponse>(`${this.baseUrl}${this.api}/time-entries/${this.date}`);
  }

  public getUserById(userId: number): Observable<GetUserConfigResponse> {
    return this.http.get<GetUserConfigResponse>(`${this.userApi}/users/${userId}`);
  }

  public getUsers(): Observable<GetUserConfigResponse[]> {
    return this.http.get<GetUserConfigResponse[]>(`${this.userApi}/users`);
  }

  // POST
  public createUser(userData: CreateUserConfigRequest): Observable<GetUserConfigResponse> {
    return this.http.post<GetUserConfigResponse>(`${this.userApi}/users/`, userData);
  }

  // PUT
  public putUser(userId: number, userData: UserConfigItem[]): Observable<GetUserConfigResponse> {
    return this.http.put<GetUserConfigResponse>(`${this.userApi}/users/${userId}/config`, userData);
  }
}
