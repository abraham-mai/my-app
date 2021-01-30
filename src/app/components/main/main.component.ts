import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { LoginStates, MatSnackbarStyle } from '../../enums';
import { Router } from '@angular/router';
import { FilteringsService } from 'src/app/services/filterings.service';

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
export class MainComponent implements OnInit {
  public entries = '';
  public chosenMonth: number;
  public chosenYear: number;
  public statusShown = false;
  public status = 'Copied Entries';

  activityMap = new Map<string, string>();

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private filterService: FilteringsService
  ) {
    this.chosenMonth = 0;
    this.chosenYear = 0;
  }

  ngOnInit(): void {
    if (this.authService.loginStatus.value === LoginStates.loggedIn) {
      this.filterService.filteredEntries.subscribe((filteredEntries) => {
        this.entries = filteredEntries;
      });
    }
    this.authService.loginStatus.subscribe((status) => {
      if (status !== LoginStates.loggedIn) {
        this.router.navigate(['login']);
      }
    });
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

  logout(): void {
    this.authService.logout();
  }
  onConfigClick() {
    this.router.navigate(['/config']);
  }
}
