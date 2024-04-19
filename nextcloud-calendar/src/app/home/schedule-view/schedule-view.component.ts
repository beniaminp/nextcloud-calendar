import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss'],
  standalone: true
})
export class ScheduleViewComponent  implements OnInit {
  startingDate: Date = new Date();

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService) { }

  async ngOnInit() {
    await this.loadingService.presentLoading('Loading schedule...');
    this.route.params.subscribe(params => {
      let day = params['startingDay'];
      let month = params['startingMonth'];
      let year = params['startingYear'];
      this.startingDate = new Date(day, month, year);
      this.loadingService.dismissLoading();
    });
  }

}
