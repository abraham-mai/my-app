import { Injectable } from '@angular/core';
import { QueryService } from './query.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Credentials, GetAccessTokenRequest } from '../domain';
import { LoginStates } from '../enums';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ACCESS_TOKEN = '';
  public tokenIsReady = new ReplaySubject();
  public loginStatus = new BehaviorSubject<LoginStates>(LoginStates.loggedOut);

  constructor(private queryService: QueryService, private userService: UserService) {}

  public get accessToken(): string {
    return this.ACCESS_TOKEN;
  }

  public set accessToken(newToken: string) {
    this.ACCESS_TOKEN = newToken;
    this.tokenIsReady.next();
  }

  public logIn(credentialsInput: GetAccessTokenRequest): void {
    this.queryService.getAccessToken(credentialsInput).subscribe(
      (object) => {
        this.accessToken = object.token;
        this.loginStatus.next(LoginStates.loggedIn);
      },
      (error) => {
        this.loginStatus.next(LoginStates.wrongCredentials);
      }
    );
  }

  public logout(): void {
    this.loginStatus.next(LoginStates.loggedOut);
    this.accessToken = '';
  }
}
