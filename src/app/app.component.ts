import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Subscription} from 'rxjs';
import {QueryService} from './services/query.service';
import {ContentService} from './services/content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-app';
  private authSub: Subscription | undefined;
  private activitySub: Subscription | undefined;
  private entrySub: Subscription | undefined;

  constructor(private authService: AuthService, private queryService: QueryService, private contentService: ContentService) {
  }

  ngOnInit(): void {
    this.authSub = this.authService.ACCESS_TOKEN.subscribe(x => {
      if (x) {
        this.activitySub = this.queryService.getActivities().subscribe(activities => {
          console.log(activities);
        });
        this.entrySub = this.queryService.getEntries().subscribe(entries => {
          console.log(entries);
        });
      }
    });
    this.authService.triggerLogin();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.activitySub?.unsubscribe();
    this.entrySub?.unsubscribe();
  }
}
