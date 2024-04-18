import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular/standalone";
import {CalEvents} from "../models/cal-events";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  @Input()
  event!: CalEvents;

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    console.error('Event:', this.event);
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true,
      'data': 'Any data you want to pass back' // Pass back any data you want
    });
  }
}
