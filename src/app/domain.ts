// Auth
export interface GetAccessTokenRequest {
  apiKey: string;
  apiSecret: string;
}

export interface GetAccessTokenResponse {
  token: string;
}

// Content
export interface GetActivitiesResponse {
  activities: Activity[];
  inactiveActivities: Activity[];
  archivedActivities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  color: string;
  integration: string;
  spaceId: string;
  deviceSide: number;
}

export interface GetEntriesResponse {
  timeEntries: TimeEntry[];
}

export interface TimeEntry {
  id: string;
  activityId: string;
  duration: Duration;
  note: Note;
}

export interface Duration {
  startedAt: string;
  stoppedAt: string;
}

export interface Note {
  text: string;
  tags: string[];
  mentions: string[];
}

export interface Credentials {
  username: string;
  password: string;
}
