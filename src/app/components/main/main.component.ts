import {Component, OnInit} from '@angular/core';
import {GetActivitiesResponse, GetEntriesResponse} from '../../domain';
import {forkJoin} from 'rxjs';
import {QueryService} from '../../services/query.service';
import {AuthService} from '../../services/auth.service';
import {SnackbarService} from '../../services/snackbar.service';
import {LoginStates, MatSnackbarStyle} from '../../enums';
import {Router} from '@angular/router';
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
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public entries = '';
  public chosenMonth: number;
  public chosenYear: number;
  public statusShown = false;
  public status = 'Copied Entries';



  activityMap = new Map<string, string>();

  constructor(private queryService: QueryService, private authService: AuthService,
              private snackbarService: SnackbarService, private router: Router, private filterService: FilteringsService) {
                this.chosenMonth = 0;
                this.chosenYear = 0;
  }

  ngOnInit(): void {
    if (this.authService.loginStatus.value === LoginStates.loggedIn) {
      this.getData();
      this.filterService.filteredEntries.subscribe(filteredEntries => {
        this.entries = filteredEntries;
      })
    }
    this.authService.loginStatus.subscribe(status => {
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
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.entries;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbarService.sendNewMessage('Copied to Clipboard', MatSnackbarStyle.Success);
  }

  getData(): void {
    forkJoin([this.queryService.getActivities(), this.queryService.getEntries()]).subscribe(content => {
      this.filterService.activities = content[0];
      this.filterService.entries = content[1];
      this.filterService.startFilterData();
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
