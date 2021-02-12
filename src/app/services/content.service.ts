import { Injectable } from '@angular/core';
import { GetActivitiesResponse, GetEntriesResponse } from '../domain';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private ACTIVITIES: GetActivitiesResponse | undefined;
  private ENTRIES: GetEntriesResponse | undefined;
  public contentReady = new ReplaySubject();
  public refetch = new ReplaySubject();

  constructor() {}

  get activities(): GetActivitiesResponse | undefined {
    return this.ACTIVITIES;
  }

  set activities(newActivities) {
    this.ACTIVITIES = newActivities;
  }

  get entries(): GetEntriesResponse | undefined {
    return this.ENTRIES;
  }

  set entries(newEntries) {
    this.ENTRIES = newEntries;
  }
}
