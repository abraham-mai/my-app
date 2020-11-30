import {Injectable} from '@angular/core';
import {GetActivitiesResponse} from '../domain';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  public activities: GetActivitiesResponse | undefined;

  constructor() {
  }


}
