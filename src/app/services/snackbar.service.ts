import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MatSnackbarStyle } from '../enums';

export interface MatSnackBarMessage {
  message: string;
  style?: MatSnackbarStyle;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public newMessage = new ReplaySubject<MatSnackBarMessage>();

  constructor() {}

  public sendNewMessage(message: string, style?: MatSnackbarStyle): void {
    console.log(message);
    this.newMessage.next({ message, style });
  }
}
