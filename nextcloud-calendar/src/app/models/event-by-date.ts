import {CalEvents} from "./cal-events";

export class EventByDate {
  day: number;
  month: number;
  year: number;
  date: Date;
  events: CalEvents[];

  constructor(day: number, month: number, year: number, date: Date, events: CalEvents[]) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.date = date;
    this.events = events;
  }
}
