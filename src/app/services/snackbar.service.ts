import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  public newMessage = new ReplaySubject<string>();

  constructor() {
  }

  public sendNewMessage(message: string): void {
    this.newMessage.next(message);
  }
}
