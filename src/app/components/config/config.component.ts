import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Activity } from 'src/app/domain';
import { QueryService } from 'src/app/services/query.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  activities: Activity[] = [];
  formGroup: FormGroup | undefined;

  constructor(private queryService: QueryService) {}

  ngOnInit(): void {
    this.queryService.getActivities().subscribe((activities) => {
      this.activities = activities.activities;
      this.createFormGroups();
    });
  }
  createFormGroups() {}
}
