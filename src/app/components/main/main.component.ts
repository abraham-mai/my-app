import {Component, OnInit} from '@angular/core';
import {ContentService} from '../../services/content.service';
import {GetActivitiesResponse, GetEntriesResponse} from '../../domain';
import {forkJoin} from 'rxjs';
import {QueryService} from '../../services/query.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public activities: GetActivitiesResponse | undefined;
  public entries: GetEntriesResponse | undefined;
  public chosenMonth = 0;

  activityMap = new Map<string, string>();
  private filteredEntries: any[] | undefined;

  constructor(private contentService: ContentService, private queryService: QueryService) {
  }

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    this.chosenMonth = currentMonth;
  }

  getCategory(task: string | undefined): string {
    if (task?.includes('Frontend') && !task?.includes('Gilde') || task?.includes('Configurator') || task?.includes('Ui Libary')) {
      return 'Implementierung';
    } else if (task?.includes('Gilde')) {
      return 'Sonstiges';
    } else {
      return 'Planung';
    }
  }

  getData(): void {
    forkJoin([this.queryService.getActivities(), this.queryService.getEntries()]).subscribe(content => {
      this.activities = content[0];
      this.activities.activities.forEach(activity => {
        this.activityMap.set(activity.id, activity.name);
      });

      this.entries = content[1];


      // @ts-ignore
      this.filteredEntries = this.entries.timeEntries.filter(entry => {
        if (entry.duration.startedAt.includes(`2020-${this.chosenMonth}`)) {
          return true;
        }
      }).map(filteredEntry => {
        const start = new Date(filteredEntry.duration.startedAt);
        const end = new Date(filteredEntry.duration.stoppedAt);
        // @ts-ignore
        const duration = Math.round((end - start) / (1000 * 3600) * 10) / 10;
        const hours = duration.toString() + 'h';

        return {
          date: start.toLocaleDateString(),
          text: this.getCategory(this.activityMap.get(filteredEntry.activityId)) === 'Planung' ? 'VSS-400 ' : filteredEntry.note.text || 'Sonstiges',
          category: this.getCategory(this.activityMap.get(filteredEntry.activityId)),
          duration: hours,
          note: this.activityMap.get(filteredEntry.activityId),
        };
      });
      console.log(this.filteredEntries);

    });
  }
}
