import {DatePipe, NgClass, NgFor, NgIf, NgStyle} from '@angular/common';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  GestureController,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import {Days} from './models/days';
import {ActivatedRoute, Router} from "@angular/router";
import {CalEvents} from "../models/cal-events";
import {EventComponent} from "../event/event.component";
import {Gesture} from "@ionic/angular";
import {CalendarService} from "../services/calendar.service";
import {LoadingService} from "../services/loading.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, DatePipe, NgIf, NgFor, NgClass, NgStyle],
})
export class HomePage implements OnInit, AfterViewInit {
  // @ts-ignore
  @ViewChild('swipeContainer') swipeContainer: ElementRef;

  currentDate = new Date();
  showDropMenu = false;
  noOfDaysInMonth: number = 0;
  lastDayOfMonth: number = 0;

  lastDayOfPrevMonth: number = 0;
  last5DaysOfPrevMonth: Days[] = [];
  dayForTheNextMonth: Days[] = [];
  currentMonthDays: Days[] = [];
  thisMonthEvents: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private modalController: ModalController,
              private gestureCtrl: GestureController,
              private loadingService: LoadingService,
              private calendarService: CalendarService) {
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

  ngAfterViewInit(): void {
    this.setupSwipeGesture();
  }

  async initMonth() {
    this.noOfDaysInMonth = this.calendarService.getDaysInMonth(this.currentDate);
    this.lastDayOfPrevMonth = this.calendarService.getLastDayOfPreviousMonth(this.currentDate);
    this.lastDayOfMonth = this.calendarService.getLastDayOfMonth(this.currentDate);

    const noOfDayForPrevMonth = this.lastDayOfPrevMonth == 31 ? 5 : 6;
    this.last5DaysOfPrevMonth = [];
    for (let i = this.lastDayOfPrevMonth; i > this.lastDayOfPrevMonth - noOfDayForPrevMonth; i--) {
      this.last5DaysOfPrevMonth.push(this.calendarService.getDateForPreviousMonth(this.currentDate, i));
    }
    this.last5DaysOfPrevMonth.sort((a, b) => a.dayNo - b.dayNo);


    let noOfDayForNextMonth = this.lastDayOfMonth == 31 ? 6 : 7;
    noOfDayForNextMonth = this.lastDayOfMonth == 30 ? noOfDayForNextMonth + 1 : noOfDayForNextMonth;
    this.dayForTheNextMonth = [];
    for (let i = 1; i < noOfDayForNextMonth; i++) {
      this.dayForTheNextMonth.push(this.calendarService.getDateForNextMonth(this.currentDate, i));
    }

    this.currentMonthDays = this.calendarService.populateDaysArray(this.currentDate);

    await this.loadingService.presentLoading('Please wait, loading calendar data...');
    this.calendarService.populateCalendarData().subscribe({
      next: (value: any) => {
        this.thisMonthEvents = value;
        this.loadingService.dismissLoading();
      }, error: err => {
        console.error(err);
        this.loadingService.dismissLoading();
      }
    });
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

  goToToday() {
    this.currentDate = new Date(); // Set currentDate to the current date
    const month = this.currentDate.getMonth(); // Get the current month
    const year = this.currentDate.getFullYear(); // Get the current year
    const pathParam = `${month}-${year}`; // Create the path parameter
    this.router.navigate(['/home', pathParam]); // Navigate to the current month and year
  }

  setupSwipeGesture() {
    const gesture: Gesture = this.gestureCtrl.create({
      el: this.swipeContainer.nativeElement,
      gestureName: 'swipe',
      onStart: detail => console.log('Swipe start', detail),
      onMove: detail => console.log('Moving', detail),
      onEnd: detail => {
        console.log('End', detail);
        if (detail.deltaX < -150) {
          // Swipe left
          console.log('Swipe left');
          this.goToMonth(1);
          // Implement your logic here, for example:
          // this.goToNextPage();
        } else if (detail.deltaX > 150) {
          // Swipe right
          console.log('Swipe right');
          this.goToMonth(-1);
          // Implement your logic here, for example:
          // this.goBack();
        }
      }
    });

    gesture.enable();
  }

  goToScheduleView(date: Date) {
    this.router.navigate(['/schedule', date.getDate(), date.getMonth(), date.getFullYear()]);
  }

  async openEventModal(event: CalEvents) {
    const modal = await this.modalController.create({
      component: EventComponent, // Your component here
      componentProps: {event: event},
      cssClass: 'modal-custom-class'
    });

    return await modal.present();
  }

  protected readonly Number = Number;
}
