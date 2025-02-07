import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { LoginStates, MatSnackbarStyle } from '../../enums';
import { Router } from '@angular/router';
import { FilteringsService } from 'src/app/services/filterings.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

export interface JetDataArrayElement {
  date: Date;
  text: string;
  category: string;
  duration: string;
  note: string;
  id: string;
  activity?: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  public entries = '';
  public chosenMonth: number;
  public chosenYear: number;
  public statusShown = false;
  public status = 'Copied Entries';
  public userConfig = false;

  activityMap = new Map<string, string>();
  private _authSub: Subscription = new Subscription();
  private _userCheckedSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private filterService: FilteringsService,
    private userService: UserService
  ) {
    this.chosenMonth = 0;
    this.chosenYear = 0;
  }
  ngOnInit(): void {
    if (this.authService.loginStatus.value === LoginStates.loggedIn) {
      this._userCheckedSub = this.userService.userChecked.subscribe((checked) => {
        if (checked) {
          this.userConfig = this.userService.userFound;
          this.filterService.filteredEntries.subscribe((filteredEntries) => {
            this.entries = filteredEntries;
          });
        }
      });
    }
    this._authSub = this.authService.loginStatus.subscribe((status) => {
      if (status !== LoginStates.loggedIn) {
        this.router.navigate(['login']);
      }
    });
  }
  ngOnDestroy(): void {
    this._authSub?.unsubscribe();
  }

  copyEntries(): void {
    if (!this.entries) {
      return;
    }
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = selBox.style.top = selBox.style.opacity = '0';
    selBox.value = this.entries;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbarService.sendNewMessage('Copied to Clipboard', MatSnackbarStyle.Success);
  }

  onLogOutClick(): void {
    this.authService.logout();
    this.userService.resetUser();
  }
  onConfigClick() {
    this.router.navigate(['/config']);
  }
}
