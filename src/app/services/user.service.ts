import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { UserConfigItem } from '../domain';
import { QueryService } from './query.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userKey = '';
  public userId = 0;
  public userConfig: UserConfigItem[] = [];
  public userFound = false;
  public userChecked = new ReplaySubject<boolean>();

  constructor(private queryService: QueryService) {}

  set userKey(key: string) {
    this.setUser(key);
  }
  get userKey() {
    return this._userKey;
  }

  setUser(key: string) {
    this._userKey = key;
    this.queryService.getUsers().subscribe((users) => {
      const currentUser = users.find((x) => x.userKey === this.userKey);
      if (currentUser) {
        this.userId = currentUser.id;
        this.userConfig = currentUser.userConfig;
        this.userFound = true;
      } else {
        this.userFound = false;
      }
      this.userChecked.next(true);
    });
  }
  resetUser() {
    this.userFound = false;
    this.userId = 0;
    this.userConfig = [];
    this.userChecked.next(false);
  }
}
