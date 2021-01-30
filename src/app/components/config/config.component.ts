import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Activity, UserConfig } from 'src/app/domain';
import { LoginStates } from 'src/app/enums';
import { AuthService } from 'src/app/services/auth.service';
import { QueryService } from 'src/app/services/query.service';
import { categoryDropdownData, DefaultValues } from './configAssets';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  activities: Activity[] = [];
  activityConfigMap: Map<string, DefaultValues> = new Map();
  formGroup: FormGroup = new FormGroup({});

  categoryDropdownData = categoryDropdownData;

  constructor(
    private queryService: QueryService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.loginStatus.value === LoginStates.loggedIn) {
      forkJoin({
        activities: this.queryService.getActivities(),
        config: this.queryService.getUserConfig(),
      }).subscribe((data) => {
        this.createActivityConfigMap(data.config.userConfig);
        this.createFormGroup(data.activities.activities);
        this.activities = data.activities.activities;
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  private createFormGroup(activities: Activity[]): void {
    console.log(this.activityConfigMap);
    for (const activity of activities) {
      this.formGroup.addControl(
        `${activity.id}-category`,
        this.formBuilder.control(this.activityConfigMap.get(activity.id)?.category || '')
      );
      this.formGroup.addControl(
        `${activity.id}-issue`,
        this.formBuilder.control(this.activityConfigMap.get(activity.id)?.defaultIssue || '')
      );
      this.formGroup.addControl(
        `${activity.id}-comment`,
        this.formBuilder.control(this.activityConfigMap.get(activity.id)?.defaultComment || '')
      );
    }
  }

  private createActivityConfigMap(configs: UserConfig[]): void {
    configs.forEach((activity) => {
      this.activityConfigMap.set(activity.activityConfig.id, {
        category: activity.activityConfig.category,
        defaultIssue: activity.activityConfig.defaultIssue,
        defaultComment: activity.activityConfig.defaultComment,
      });
    });
  }

  onSaveClick(): void {
    console.log(this.formGroup.getRawValue());
  }

  onBackClick(): void {
    this.router.navigate(['/main']);
  }
}
