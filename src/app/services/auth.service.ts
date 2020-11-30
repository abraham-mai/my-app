import {Injectable} from '@angular/core';
import {QueryService} from './query.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public ACCESS_TOKEN = new BehaviorSubject<string>('');

  constructor(private queryService: QueryService) {
  }

  public triggerLogin(): void {
    this.queryService.getAccessToken().subscribe(object => {
      this.accessToken = object.token;
    });
  }

  public get accessToken(): string {
    return this.ACCESS_TOKEN.value;
  }

  public set accessToken(newToken: string) {
    this.ACCESS_TOKEN.next(newToken);
  }

}
