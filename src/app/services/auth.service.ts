import {Injectable} from '@angular/core';
import {QueryService} from './query.service';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {Credentials} from '../domain';
import {LoginStates} from '../enums';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private ACCESS_TOKEN = '';
  public tokenIsReady = new ReplaySubject();
  private credentials: Credentials;
  public loginStatus = new BehaviorSubject<LoginStates>(LoginStates.loggedOut);

  constructor(private queryService: QueryService) {
    this.credentials = {username: 'an.mai', password: 'test1235'};
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

  public logIn(credentialsInput: Credentials): void {
    if (this.credentials.username === credentialsInput.username && this.credentials.password === credentialsInput.password) {
      this.loginStatus.next(LoginStates.loggedIn);
    } else {
      this.loginStatus.next(LoginStates.wrongCredentials);
    }
  }

  public logout(): void {
    this.loginStatus.next(LoginStates.loggedOut);
  }
}
