import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {forkJoin, Subscription} from 'rxjs';
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

  constructor(private authService: AuthService, private queryService: QueryService, private contentService: ContentService) {
  }

  ngOnInit(): void {
    this.authService.triggerLogin();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
