import {AfterViewChecked, Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoadingService} from "../../services/loading.service";
import {CalendarService} from "../../services/calendar.service";
import {AsyncPipe, DatePipe, NgClass, NgForOf} from "@angular/common";
import {EventByDate} from "../../models/event-by-date";
import {IonicModule} from "@ionic/angular";
import {Subject} from 'rxjs';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss'],
  imports: [
    NgForOf,
    IonicModule,
    DatePipe,
    NgClass,
    AsyncPipe
  ],
  standalone: true
})
export class ScheduleViewComponent implements OnInit, AfterViewChecked {
  startingDate: Date = new Date();
  allEvents: Subject<EventByDate[]> = new Subject<EventByDate[]>();
  private hasScrolledToSelectedDay = false;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private calendarService: CalendarService,
              private renderer: Renderer2) {
  }

  async ngOnInit() {
    await this.loadingService.presentLoading('Loading schedule...');
    this.route.params.subscribe(params => {
      let day = params['startingDay'];
      let month = params['startingMonth'];
      let year = params['startingYear'];
      this.startingDate = new Date(year, month, day);
      this.calendarService.getAllCalendarEventsByDayAndMonth(this.startingDate).subscribe({
        next: (value) => {
          this.allEvents.next(value);
          this.loadingService.dismissLoading();
        }, error: (err) => {
          console.error(err);
          this.loadingService.dismissLoading();
        }
      })
    });
  }

  scrollToSelectedDay() {
    // Use Angular's Renderer2 service to access the DOM
    const element = this.renderer.selectRootElement('.selectedDay', true);

    // Use the native scrollIntoView method to scroll to the element
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
    }
  }

  ngAfterViewChecked(): void {
    if (!this.hasScrolledToSelectedDay) {
      setTimeout(() => {
        this.scrollToSelectedDay();
        this.hasScrolledToSelectedDay = true;
      }, 0);
    }
  }

}
