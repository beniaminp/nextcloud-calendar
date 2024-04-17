import {DatePipe, NgClass, NgFor, NgIf, NgStyle} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {Days} from './models/days';
import {CalendarService} from '../services/calendar-service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, DatePipe, NgIf, NgFor, NgClass, NgStyle],
})
export class HomePage implements OnInit {
  currentDate = new Date();
  showDropMenu = false;
  noOfDaysInMonth: number = 0;
  lastDayOfMonth: number = 0;

  lastDayOfPrevMonth: number = 0;
  last5DaysOfPrevMonth: Days[] = [];
  dayForTheNextMonth: Days[] = [];
  currentMonthDays: Days[] = [];
  thisMonthEvents: any;

  constructor(private calendarService: CalendarService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        let parts = id.split('-');
        let month = Number(parts[0]);
        let year = parts[1];

        this.currentDate.setMonth(month);
        this.currentDate.setFullYear(year);
      }
    });

    this.initMonth();
  }

  initMonth() {
    this.noOfDaysInMonth = this.getDaysInMonth(this.currentDate);
    this.lastDayOfPrevMonth = this.getLastDayOfPreviousMonth(this.currentDate);
    this.lastDayOfMonth = this.getLastDayOfMonth(this.currentDate);

    const noOfDayForPrevMonth = this.lastDayOfPrevMonth == 31 ? 5 : 6;
    this.last5DaysOfPrevMonth = [];
    for (let i = this.lastDayOfPrevMonth; i > this.lastDayOfPrevMonth - noOfDayForPrevMonth; i--) {
      this.last5DaysOfPrevMonth.push(this.getDateForPreviousMonth(this.currentDate, i));
    }
    this.last5DaysOfPrevMonth.sort((a, b) => a.dayNo - b.dayNo);


    let noOfDayForNextMonth = this.lastDayOfMonth == 31 ? 6 : 7;
    noOfDayForNextMonth = this.lastDayOfMonth == 30 ? noOfDayForNextMonth + 1 : noOfDayForNextMonth;
    this.dayForTheNextMonth = [];
    for (let i = 1; i < noOfDayForNextMonth; i++) {
      this.dayForTheNextMonth.push(this.getDateForNextMonth(this.currentDate, i));
    }

    this.currentMonthDays = this.populateDaysArray(this.currentDate);

    this.populateCalendarData();
  }

  findEventsForCurrentMonth(events: any[]) {
    let filteredEvents = events.filter(event => {
      let eventDate = new Date(event.dtstart);
      return eventDate.getMonth() + 1 === this.currentDate.getMonth() + 1 && eventDate.getFullYear() === this.currentDate.getFullYear();
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

  goToMonth(monthNo: number) {
    const newDate = new Date(this.currentDate.getTime()); // Clone the current date to avoid mutation
    let pathParam = '';
    if (monthNo == 1) {
      if (newDate.getMonth() == 11) { // If current month is December
        newDate.setFullYear(newDate.getFullYear() + 1); // Go to the next year
        newDate.setMonth(0); // Set month to January
      } else {
        newDate.setMonth(newDate.getMonth() + 1); // Go to the next month
      }
      pathParam = `${Number(newDate.getMonth())}-${newDate.getFullYear()}`;
    } else if (monthNo == -1) {
      if (newDate.getMonth() == 0) { // If current month is January
        newDate.setFullYear(newDate.getFullYear() - 1); // Go to the previous year
        newDate.setMonth(11); // Set month to December
      } else {
        newDate.setMonth(newDate.getMonth() - 1); // Go to the previous month
      }
      pathParam = `${Number(newDate.getMonth())}-${newDate.getFullYear()}`;
    }
    this.router.navigate(['/home', pathParam]);
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

  goToToday() {
    this.currentDate = new Date(); // Set currentDate to the current date
    const month = this.currentDate.getMonth(); // Get the current month
    const year = this.currentDate.getFullYear(); // Get the current year
    const pathParam = `${month}-${year}`; // Create the path parameter
    this.router.navigate(['/home', pathParam]); // Navigate to the current month and year
  }

  private populateCalendarData() {
    let monthEvents: any[] = [];
    let calendarData = localStorage.getItem('calendars');
    let lastUpdated = localStorage.getItem('lastUpdated');

    let oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (calendarData && calendarData != 'null' &&lastUpdated && new Date(lastUpdated) > oneDayAgo) {
      var data = JSON.parse(calendarData);
      this.computeDataForCalendar(data, monthEvents);
    } else {
      this.getHttpCalendarData(monthEvents);
    }
  }

  private getHttpCalendarData(monthEvents: any[]) {
    this.calendarService.findCalendars(localStorage.getItem('serverAddress')!, localStorage.getItem('username')!, localStorage.getItem('password')!)
      .subscribe((data: any[]) => {
        localStorage.setItem('calendars', JSON.stringify(data));
        localStorage.setItem('lastUpdated', new Date().toISOString());
        this.computeDataForCalendar(data, monthEvents);
      })
  }

  private computeDataForCalendar(data: any[], monthEvents: any[]) {
    data.forEach((calendar) => {
      const events = calendar.vcalendar.events;
      monthEvents.push(...this.findEventsForCurrentMonth(events));
    })

    this.thisMonthEvents = monthEvents.reduce((acc, event) => {
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

  protected readonly Number = Number;
}
