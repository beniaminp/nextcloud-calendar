import { Component } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader, IonIcon, IonItem,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar, MenuController
} from '@ionic/angular/standalone';
import {CalendarService} from "./services/calendar.service";
import {LoadingService} from "./services/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon],
})
export class AppComponent {
  constructor(private calendarService: CalendarService,
              private loadingService: LoadingService,
              private menuController: MenuController) {}

  refreshCalendarData() {
    localStorage.removeItem('calendars');
    this.loadingService.presentLoading('Refreshing calendar data...');
    this.calendarService.getCalendarDataForCurrentMonth().subscribe({
      next: (value) => {
        this.loadingService.dismissLoading();
        this.menuController.close('appMenu')
      }, error: (err) => {
        console.error(err);
        this.loadingService.dismissLoading();
      }
    });
  }
}
