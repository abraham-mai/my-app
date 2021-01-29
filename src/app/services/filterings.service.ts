import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateObject } from '../components/main/calendar-bar/calendar-bar.component';
import { JetDataArrayElement } from '../components/main/main.component';
import { GetActivitiesResponse, GetEntriesResponse } from '../domain';
import { MappingsService } from './mappings.service';

@Injectable({
  providedIn: 'root',
})
export class FilteringsService {
  private activityMap = new Map<string, string>();
  private _date: DateObject;
  private _activities!: GetActivitiesResponse;
  private _entries!: GetEntriesResponse;

  filteredEntries = new BehaviorSubject<any>(null);

  constructor(private mappingService: MappingsService) {
    this._date = { month: 0, year: 0 };
  }

  public startFilterData() {
    this.activityMap.clear();
    this.activities.activities.forEach((activity) => {
      this.activityMap.set(activity.id, activity.name);
    });

    this.filteredEntries.next(
      this.mapToJetLines(this.lookForSameDayActivity(this.mapData(this.filterForDate(this.entries.timeEntries))))
    );
  }

  private filterForDate(data: any[]): any {
    return data.filter((entry) => {
      const date = new Date(entry.duration.startedAt);
      return date.getMonth() === this.date.month - 1 && date.getFullYear() === this.date.year;
    });
  }

  private mapData(data: any[]): JetDataArrayElement[] {
    return data.map((filteredEntry) => {
      const start = new Date(filteredEntry.duration.startedAt);
      const end = new Date(filteredEntry.duration.stoppedAt);
      // @ts-ignore
      const duration = (end - start) / (1000 * 3600);
      const hours = duration.toString();
      const activity = this.activityMap.get(filteredEntry.activityId);
      const date = start;
      return {
        date,
        text: filteredEntry.note.text?.toLowerCase().includes('vss')
          ? filteredEntry.note.text?.toLowerCase()
          : this.mappingService.getText(activity),
        category: this.mappingService.getCategory(activity),
        duration: hours,
        note:
          this.mappingService.getNote(activity) ||
          `//${filteredEntry.note.text?.toLowerCase()}` ||
          `//${this.mappingService.getText(activity)}`,
        id: date.toString() + (filteredEntry.note.text?.toLowerCase() || activity),
        activity,
      };
    });
  }

  private lookForSameDayActivity(data: JetDataArrayElement[]): JetDataArrayElement[] {
    let newData = {};
    const filteredData: JetDataArrayElement[] = [];
    newData = data.reduce((c: any, i) => {
      c[i.id] = (c[i.id] || 0) + parseFloat(i.duration);
      return c;
    }, {});
    Object.keys(newData).forEach((key) => {
      data.find((element) => {
        if (element.id === key) {
          const newElement = element;
          // @ts-ignore
          newElement.duration = newData[key];
          if (!filteredData.find((x) => x.id === newElement.id)) {
            filteredData.push(newElement);
          }
        }
      });
    });
    return filteredData;
  }

  private mapToJetLines(data: any[]): string {
    return data
      .sort((a, b) => {
        // @ts-ignore
        return new Date(b.date) - new Date(a.date);
      })
      .map((element) => {
        if (Number(element.duration) > 0.2) {
          return `${element.date.toLocaleDateString()} ${element.text} ${element.category} ${Number(element.duration)
            .toFixed(1)
            .toString()
            .replace('.', ',')}h ${element.note}`;
        } else {
          return false;
        }
      })
      .filter((x) => x !== false)
      .join('\n');
  }

  set date(date: DateObject) {
    this._date = date;
    if (this.entries && this.entries) {
      this.startFilterData();
    }
  }

  get date() {
    return this._date;
  }

  get entries() {
    return this._entries;
  }

  get activities() {
    return this._activities;
  }
  set entries(entries: GetEntriesResponse) {
    this._entries = entries;
  }

  set activities(activities: GetActivitiesResponse) {
    this._activities = activities;
  }
}
