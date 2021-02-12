import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Activity, CreateUserConfigRequest, GetUserConfigResponse, UserConfigItem } from 'src/app/domain';
import { LoginStates, MatSnackbarStyle } from 'src/app/enums';
import { AuthService } from 'src/app/services/auth.service';
import { QueryService } from 'src/app/services/query.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { categoryDropdownData, DefaultValues } from './configAssets';

export interface ActivityFormGroupItem {
  activityId: string;
  formGroup: FormGroup;
}
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit, OnDestroy {
  public activities: Activity[] = [];
  public activityFormGroupItems: ActivityFormGroupItem[] = [];
  public newConfig = false;

  private activityConfigMap: Map<string, DefaultValues> = new Map();
  private _authSub: Subscription = new Subscription();
  private _userCheckedSub: Subscription = new Subscription();

  categoryDropdownData = categoryDropdownData;

  constructor(
    private queryService: QueryService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    if (this.authService.loginStatus.value === LoginStates.loggedIn) {
      this._userCheckedSub = this.userService.userChecked.subscribe((checked) => {
        if (checked) {
          this.fetchUserConfig();
        }
      });
    } else {
      this.router.navigate(['login']);
    }

    this._authSub = this.authService.loginStatus.subscribe((status) => {
      if (status !== LoginStates.loggedIn) {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnDestroy(): void {
    this._authSub?.unsubscribe();
    this._userCheckedSub?.unsubscribe();
  }

  private fetchUserConfig() {
    this.queryService.getActivities().subscribe((data) => {
      if (this.userService.userFound) {
        this.newConfig = false;
        this.createActivityConfigMap(this.userService.userConfig);
      } else {
        this.newConfig = true;
      }
      this.createformGroups(data.activities);
      this.activities = data.activities;
    });
  }
  private createformGroups(activities: Activity[]): void {
    this.activityFormGroupItems = [];
    for (const activity of activities) {
      const formGroup = new FormGroup({});
      formGroup.addControl(
        'category',
        this.formBuilder.control(this.activityConfigMap.get(activity.id)?.category || '')
      );
      formGroup.addControl(
        'issue',
        this.formBuilder.control(this.activityConfigMap.get(activity.id)?.defaultIssue || '')
      );
      formGroup.addControl(
        'comment',
        this.formBuilder.control(this.activityConfigMap.get(activity.id)?.defaultComment || '')
      );
      this.activityFormGroupItems.push({ activityId: activity.id, formGroup: formGroup });
    }
  }

  private createActivityConfigMap(configs: UserConfigItem[]): void {
    configs.forEach((activity) => {
      this.activityConfigMap.set(activity.activityId, {
        category: activity.category,
        defaultIssue: activity.defaultIssue,
        defaultComment: activity.defaultComment,
      });
    });
  }

  onSaveClick(): void {
    const newUserConfig: UserConfigItem[] = this.createUserConfigItems();
    const sendObj: CreateUserConfigRequest = {
      userKey: this.userService.userKey,
      userName: 'test',
      userConfig: newUserConfig,
    };
    if (this.newConfig) {
      this.queryService.createUser(sendObj).subscribe((newUser) => {
        this.userService.userKey = newUser.userKey;
        this.snackbarService.sendNewMessage('Config successfully created', MatSnackbarStyle.Success);
        this.router.navigate(['main']);
      });
    } else {
      this.queryService.putUser(this.userService.userId, newUserConfig).subscribe(() => {
        this.userService.userKey = this.userService.userKey;
        this.snackbarService.sendNewMessage('Config successfully updated', MatSnackbarStyle.Success);
      });
    }
  }

  onBackClick(): void {
    this.router.navigate(['main']);
  }

  onLogOutClick(): void {
    this.authService.logout();
    this.userService.resetUser();
  }

  private createUserConfigItems(): UserConfigItem[] {
    return this.activities.map((activity) => {
      const currentFormGroup = this.activityFormGroupItems.find((x) => x.activityId === activity.id)?.formGroup;
      return {
        activityId: activity.id,
        defaultIssue: currentFormGroup?.get('issue')?.value || '',
        defaultComment: currentFormGroup?.get('comment')?.value || '',
        category: currentFormGroup?.get('category')?.value || '',
      };
    });
  }
}
