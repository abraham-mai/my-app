import {Component, OnInit} from '@angular/core';
import {ContentService} from '../../services/content.service';
import {GetActivitiesResponse} from '../../domain';
import {forkJoin} from 'rxjs';
import {QueryService} from '../../services/query.service';
import {AuthService} from '../../services/auth.service';

export interface JetDataArrayElement {
  date: string;
  text: string;
  category: string;
  duration: string;
  note: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public activities: GetActivitiesResponse | undefined;
  public entries = '';
  public chosenMonth: number;
  public chosenYear: number;
  public statusShown = false;
  public status = 'Copied Entries';

  activityMap = new Map<string, string>();
  public months = [{name: 'Jan', value: 1}, {name: 'Feb', value: 2}, {name: 'Mar', value: 3}, {name: 'Apr', value: 4},
    {name: 'May', value: 5}, {name: 'Jun', value: 6}, {name: 'Jul', value: 7}, {name: 'Aug', value: 8},
    {name: 'Sep', value: 9}, {name: 'Oct', value: 10}, {name: 'Nov', value: 11}, {name: 'Dec', value: 12}];

  constructor(private contentService: ContentService, private queryService: QueryService, private authService: AuthService) {
    const currentDate = new Date();
    this.chosenMonth = currentDate.getMonth() + 1;
    this.chosenYear = currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.authService.tokenIsReady.subscribe(() => {
      this.getData();
    });
  }

  getCategory(task: string | undefined): string {
    if (task?.toLocaleLowerCase().includes('frontend') && !task?.includes('gilde') || task?.includes('configurator') || task?.includes('libary')) {
      return 'implementierung';
    } else if (task?.toLocaleLowerCase().includes('gilde')) {
      return 'sonstiges';
    } else {
      return 'planung';
    }
  }


  getText(activity: string | undefined): string {
    if (activity?.toLocaleLowerCase().includes('planung')) {
      return 'VSS-400';
    } else {
      return 'sonstiges';
    }
  }

  getNote(activity: string | undefined): string {
    if (activity?.toLocaleLowerCase().includes('scrum')) {
      return '//scrum planung';
    } else if (activity?.toLocaleLowerCase().includes('gilde') && activity?.toLocaleLowerCase().includes('frontend')) {
      return '//gilde frontend';
    } else if (activity?.toLocaleLowerCase().includes('gilde')) {
      return '//gilde agile methoden';
    } else {
      return '';
    }
  }


  copyEntries(): void {
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

    this.statusShown = true;

    setTimeout(() => {
      this.statusShown = false;
    }, 2000);
  }

  getData(): void {
    forkJoin([this.queryService.getActivities(), this.queryService.getEntries()]).subscribe(content => {
      this.activities = content[0];
      this.activities.activities.forEach(activity => {
        this.activityMap.set(activity.id, activity.name);
      });
      this.entries = this.mapToJetLines(this.mapData(this.filterForDate(content[1].timeEntries)));
    });
  }

  filterForDate(data: any[]): any {
    return data.filter(entry => {
      const date = new Date(entry.duration.startedAt);
      return (date.getMonth() === this.chosenMonth - 1) && (date.getFullYear() === this.chosenYear);
    });
  }

  mapData(data: any[]): JetDataArrayElement[] {
    return data.map(filteredEntry => {
      const start = new Date(filteredEntry.duration.startedAt);
      const end = new Date(filteredEntry.duration.stoppedAt);
      // @ts-ignore
      const duration = Math.round((end - start) / (1000 * 3600) * 10) / 10;
      const hours = duration.toString() + 'h';
      const activity = this.activityMap.get(filteredEntry.activityId);
      return {
        date: start.toLocaleDateString(),
        text: filteredEntry.note.text?.toLowerCase() || this.getText(activity),
        category: this.getCategory(activity),
        duration: hours.replace('.', ','),
        note: this.getNote(activity),
      };
    });
  }

  lookForSameDayActivity(data: JetDataArrayElement[]): JetDataArrayElement[] {
    return data;
  }

  mapToJetLines(data: any[]): string {
    return data.map(element => {
      return `${element.date} ${element.text} ${element.category} ${element.duration} ${element.note}`;
    }).join('\n');
  }

  setMonth(value: number): void {
    this.chosenMonth = value;
    this.getData();
  }
}
