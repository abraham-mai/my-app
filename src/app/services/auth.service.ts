import {Injectable} from '@angular/core';
import {QueryService} from './query.service';
import {BehaviorSubject, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private ACCESS_TOKEN = '';
  public tokenIsReady = new ReplaySubject();

  constructor(private queryService: QueryService) {
  }

  public triggerLogin(): void {
    this.queryService.getAccessToken().subscribe(object => {
      this.accessToken = object.token;
    });
  }

  public get accessToken(): string {
    return this.ACCESS_TOKEN;
  }

  public set accessToken(newToken: string) {
    this.ACCESS_TOKEN = newToken;
    this.tokenIsReady.next();
  }

}
