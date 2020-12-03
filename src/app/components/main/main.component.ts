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
  id: string;
  activity?: string;
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
    task = task?.toLocaleLowerCase();
    if (task?.includes('frontend') && !task?.includes('gilde') || task?.includes('configurator') || task?.includes('libary')) {
      return 'implementierung';
    } else if (task?.includes('gilde')) {
      return '';
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
    activity = activity?.toLocaleLowerCase();
    if (activity?.includes('scrum')) {
      return '//scrum planung';
    } else if (activity?.includes('gilde') && activity?.includes('frontend')) {
      return '//gilde frontend';
    } else if (activity?.includes('gilde')) {
      return '//gilde agile methoden';
    } else if (activity?.includes('configurator')) {
      return '//configurator';
    } else if (activity?.includes('frontend')) {
      return '//frontend-main';
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
      this.entries = this.mapToJetLines(this.lookForSameDayActivity(this.mapData(this.filterForDate(content[1].timeEntries))));
    });
  }

  filterForDate(data: any[]): any {
    return data.filter(entry => {
      const date = new Date(entry.duration.startedAt);
      return (date.getMonth() === this.chosenMonth - 1) && (date.getFullYear() === this.chosenYear);
    });
  }

  mapData(data: any[]): JetDataArrayElement[] {
    return data.map((filteredEntry) => {
      const start = new Date(filteredEntry.duration.startedAt);
      const end = new Date(filteredEntry.duration.stoppedAt);
      // @ts-ignore
      const duration = (end - start) / (1000 * 3600);
      const hours = duration.toString();
      const activity = this.activityMap.get(filteredEntry.activityId);
      const date = start.toLocaleDateString();
      return {
        date: date.toString(),
        text: filteredEntry.note.text?.toLowerCase() || this.getText(activity),
        category: this.getCategory(activity),
        duration: hours,
        note: this.getNote(activity),
        id: date.toString() + (filteredEntry.note.text?.toLowerCase() || activity),
        activity
      };
    });
  }

  lookForSameDayActivity(data: JetDataArrayElement[]): JetDataArrayElement[] {
    let newData = {};
    const filteredData: JetDataArrayElement[] = [];
    newData = data.reduce((c: any, i) => {
      c[i.id] = (c[i.id] || 0) + parseFloat(i.duration);
      return c;
    }, {});
    Object.keys(newData).forEach(key => {
      data.find(element => {
        if (element.id === key) {
          const newElement = element;
          // @ts-ignore
          newElement.duration = newData[key];
          if (!filteredData.find(x => x.id === newElement.id)) {
            filteredData.push(newElement);
          }
        }
      });
    });
    return filteredData;
  }

  mapToJetLines(data: JetDataArrayElement[]): string {
    return data.map(element => {
      if (Number(element.duration) > 0.2) {
        return `${element.date} ${element.text} ${element.category} ${Number(element.duration).toFixed(1).toString().replace('.', ',')}h ${element.note}`;
      } else {
        return false;
      }
    }).filter((x => x !== false)).sort().join('\n');
  }

  setMonth(value: number): void {
    this.chosenMonth = value;
    this.getData();
  }
}
