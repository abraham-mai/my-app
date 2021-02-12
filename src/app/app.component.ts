import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { forkJoin, Subscription } from 'rxjs';
import { QueryService } from './services/query.service';
import { ContentService } from './services/content.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBarMessage, SnackbarService } from './services/snackbar.service';
import { LoginStates, MatSnackbarStyle } from './enums';
import { UserService } from './services/user.service';
import { FilteringsService } from './services/filterings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Jet Simplifier';
  private _authSub: Subscription = new Subscription();
  private _refetchSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private queryService: QueryService,
    private userService: UserService,
    private filterService: FilteringsService,
    private snackBar: MatSnackBar,
    private contentService: ContentService,
    private snackBarService: SnackbarService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.snackBarService.newMessage.subscribe((newMessage) => {
      this.openSnackBar(newMessage);
    });

    this._authSub = this.authService.loginStatus.subscribe((loginState) => {
      if (loginState === LoginStates.loggedIn) {
        this.fetchData();
      }
    });

    this._refetchSub = this.contentService.refetch.subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    this._authSub?.unsubscribe();
  }

  public fetchData(): void {
    forkJoin({ activities: this.queryService.getActivities(), entries: this.queryService.getEntries() }).subscribe(
      (content) => {
        this.filterService.activities = content.activities;
        this.filterService.entries = content.entries;
        this.filterService.startFilterData();
      }
    );
  }

  openSnackBar(matMessage: MatSnackBarMessage): void {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.panelClass = matMessage.style;
    snackBarConfig.duration = 2000;
    snackBarConfig.verticalPosition = 'bottom';
    snackBarConfig.horizontalPosition = 'center';
    this.zone.run(() => {
      this.snackBar.open(matMessage.message, '', snackBarConfig);
    });
  }
}
