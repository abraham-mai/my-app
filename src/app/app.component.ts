import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Subscription} from 'rxjs';
import {QueryService} from './services/query.service';
import {ContentService} from './services/content.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatSnackBarMessage, SnackbarService} from './services/snackbar.service';
import {MatSnackbarStyle} from './enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-app';
  private authSub: Subscription | undefined;

  constructor(private authService: AuthService, private queryService: QueryService,
              private contentService: ContentService, private snackBar: MatSnackBar, private snackBarService: SnackbarService) {
  }

  ngOnInit(): void {
    this.snackBarService.newMessage.subscribe(newMessage => {
      this.openSnackBar(newMessage);
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  openSnackBar(matMessage: MatSnackBarMessage): void {
    const snackBarConfig = {panelClass: [matMessage.style || ''], duration: 2000} as MatSnackBarConfig;
    this.snackBar.open(matMessage.message, '', snackBarConfig
    )
    ;
  }
}
