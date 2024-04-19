import {Injectable} from '@angular/core';
import {Days} from "../home/models/days";
import {CalendarServiceHttp} from "./calendar-service.http";
import {CalEvents} from "../models/cal-events";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private calendarHttpService: CalendarServiceHttp) {
  }

  populateCalendarData(): Observable<any> {
    let monthEvents: any[] = [];
    let calendarData = localStorage.getItem('calendars');
    let lastUpdated = localStorage.getItem('lastUpdated');

    let oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (calendarData && calendarData != 'null' && lastUpdated && new Date(lastUpdated) > oneDayAgo) {
      var data = JSON.parse(calendarData);
      return new Observable(subscriber => {
        subscriber.next(this.computeDataForCalendar(data, monthEvents, new Date()));
        subscriber.complete();
      });
    } else {
      return this.getHttpCalendarData(monthEvents, new Date());
    }
  }

  getHttpCalendarData(monthEvents: any[], currentDate: Date): Observable<any> {
    return new Observable((observer) => {
      this.calendarHttpService
        .findCalendars(
          localStorage.getItem('serverAddress')!,
          localStorage.getItem('username')!,
          localStorage.getItem('password')!
        )
        .subscribe({
          next: (data: any[]) => {
            localStorage.setItem('calendars', JSON.stringify(data));
            localStorage.setItem('lastUpdated', new Date().toISOString());
            const computedData = this.computeDataForCalendar(data, monthEvents, currentDate);
            observer.next(computedData);
            observer.complete();
          }, error: (error) => observer.error(error)
        });
    });
  }


  computeDataForCalendar(data: any[], monthEvents: any[], currentDate: Date): any {
    data.forEach((calendar) => {
      const events: CalEvents[] = calendar.vcalendar.events;
      monthEvents.push(...this.findEventsForCurrentMonth(events, currentDate));
    })

    return monthEvents.reduce((acc, event: CalEvents) => {
      // Use the day as the key
      let key = event.day;

      // If this key doesn't exist in the accumulator, create it
      if (!acc[key]) {
        acc[key] = [];
      }

      // Push the current event into the array for this day
      acc[key].push(event);

      // Return the updated accumulator
      return acc;
    }, {});
  }

  findEventsForCurrentMonth(events: CalEvents[], currentDate: Date) {
    let filteredEvents = events.filter(event => {
      let eventDate = new Date(event.dtstart);
      return eventDate.getMonth() + 1 === currentDate.getMonth() + 1 && eventDate.getFullYear() === currentDate.getFullYear();
    }).map(value => {
      let eventDate = new Date(value.dtstart);
      value.day = eventDate.getDate();
      value.month = eventDate.getMonth() + 1;
      value.hour = eventDate.getUTCHours().toString().padStart(2, '0');
      value.minute = eventDate.getMinutes().toString().padStart(2, '0');
      value.seconds = eventDate.getSeconds().toString().padStart(2, '0');
      return value;
    });
    return filteredEvents;
  }

  getDaysInMonth(date: Date): number {
    // Create a new date object for the given date (to avoid modifying the original date)
    const tempDate = new Date(date.getTime());

    // Set the date to the first day of the next month
    tempDate.setMonth(tempDate.getMonth() + 1);
    tempDate.setDate(1);

    // Subtract one day to go back to the last day of the original month
    tempDate.setDate(tempDate.getDate() - 1);

    // Return the day number, which is the total number of days in the month
    return tempDate.getDate();
  }

  getLastDayOfPreviousMonth(date: Date): number {
    // Create a new date object for the given date (to avoid modifying the original date)
    const tempDate = new Date(date.getFullYear(), date.getMonth(), 1);

    // Subtract one day to get the last day of the previous month
    tempDate.setDate(tempDate.getDate() - 1);

    // Return the day of the month, which is the last day of the previous month
    return tempDate.getDate();
  }

  getLastDayOfMonth(currentDate: Date): number {
    // Create a new date object from the current date to avoid mutating it
    const tempDate = new Date(currentDate.getTime());

    // Move to the first day of the next month
    tempDate.setMonth(tempDate.getMonth() + 1);
    tempDate.setDate(1);

    // Subtract one day to find the last day of the current month
    tempDate.setDate(tempDate.getDate() - 1);

    // Return the date part of the new Date object
    return tempDate.getDate();
  }

  getDateForPreviousMonth(currentDate: Date, dayOfMonth: number): Days {
    // Get year and month from the current date
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    // Adjust month and year for the previous month
    if (month === 0) {
      month = 11; // December of the previous year
      year -= 1; // Decrease the year by one
    } else {
      month -= 1; // Just decrease the month by one
    }

    // Return the new date object for the dayOfMonthø of the previous month
    let date = new Date(year, month, dayOfMonth);
    return new Days(dayOfMonth, date);
  }

  getDateForNextMonth(currentDate: Date, dayOfMonth: number): Days {
    // Get year and month from the current date
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    // Adjust month and year for the previous month
    if (month === 0) {
      month = 11; // December of the previous year
      year += 1; // Decrease the year by one
    } else {
      month += 1; // Just decrease the month by one
    }

    // Return the new date object for the dayOfMonthø of the previous month
    let date = new Date(year, month, dayOfMonth);
    return new Days(dayOfMonth, date);
  }

  populateDaysArray(currentDate: Date): Days[] {
    const daysArray: Days[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Find the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    // Loop through all days of the month
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dayInstance = new Days(day, dayDate);
      daysArray.push(dayInstance);
    }

    return daysArray;
  }
}
