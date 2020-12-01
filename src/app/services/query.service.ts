import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GetAccessTokenRequest, GetAccessTokenResponse, GetActivitiesResponse, GetEntriesResponse} from '../domain';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private baseUrl = 'https://api.timeular.com';
  private api = '/api/v3';
  private date = '2020-01-01T00:00:00.000/2030-12-31T23:59:59.999';

  private API_KEY = 'OTI0NjRfYmQyYzg2YWQzN2U3NGRkN2IwNWY5ZWFkMGFmMmQ2NGM=';
  private API_SECRET = 'OTRiN2I5ZWMzZmMxNDVhYTk1M2VhODBiYWEzYmYxYjk=';

  constructor(private http: HttpClient) {
  }

  public getAccessToken(): Observable<GetAccessTokenResponse> {
    const sendObj: GetAccessTokenRequest = {
      apiKey: this.API_KEY,
      apiSecret: this.API_SECRET
    };
    return this.http.post<GetAccessTokenResponse>(`${this.baseUrl}${this.api}/developer/sign-in`, sendObj);
  }

  public getActivities(): Observable<GetActivitiesResponse> {
    return this.http.get<GetActivitiesResponse>(`${this.baseUrl}${this.api}/activities`);
  }

  public getEntries(): Observable<GetEntriesResponse> {
    return this.http.get<GetEntriesResponse>(`${this.baseUrl}${this.api}/time-entries/${this.date}`);
  }
}
