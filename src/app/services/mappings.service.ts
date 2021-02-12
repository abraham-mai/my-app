import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  constructor(private userService: UserService) {}

  getCategory(activityId: string): string {
    return this.userService.userConfig.find((x) => x.activityId === activityId)?.category || '';
  }

  getText(activityId: string): string {
    return this.userService.userConfig.find((x) => x.activityId === activityId)?.defaultIssue || '';
  }

  getNote(activityId: string): string {
    return `// ${this.userService.userConfig.find((x) => x.activityId === activityId)?.defaultComment || ''}`;
  }
}
