import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilteringsService } from 'src/app/services/filterings.service';
import {months} from './months';


export interface DateObject {
  month: number;
  year: number;
}


@Component({
  selector: 'calendar-bar',
  templateUrl: './calendar-bar.component.html',
  styleUrls: ['./calendar-bar.component.scss']
})

export class CalendarBarComponent implements OnInit {
  public months = months;
  public chosenMonth;
  public chosenYear;

  constructor(private filterService: FilteringsService) {
    const currentDate = new Date();
    this.chosenMonth = currentDate.getMonth() + 1;
    this.chosenYear = currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.emit();
  }

  setMonth(value: number): void {
    this.chosenMonth = value;
    this.emit()
  }
  
  emit(){
    this.filterService.date = {month: this.chosenMonth, year: this.chosenYear};
  }
}
