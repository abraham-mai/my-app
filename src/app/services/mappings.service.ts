import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MappingsService {

  constructor() { }

  getCategory(task: string | undefined): string {
    task = task?.toLocaleLowerCase();
    if (task?.includes('frontend') && !task?.includes('gilde') || task?.includes('configurator') || task?.includes('libary')) {
      return 'implementierung';
    } else if (task?.includes('gilde: frontend')) {
      return 'GildeFrontend';
    } else if (task?.includes('agile methoden')) {
      return 'GildeAgileMethoden';
    } else if (task?.includes('sonstiges')) {
      return 'sonstiges';
    } else {
      return 'planung';
    }
  }


  getText(activity: string | undefined): string {
    if (activity?.toLocaleLowerCase().includes('planung') || activity?.toLocaleLowerCase().includes('frontend')
      && !activity?.toLocaleLowerCase().includes('gilde')) {
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

}
