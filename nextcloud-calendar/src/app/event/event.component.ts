import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular/standalone";
import {CalEvents} from "../models/cal-events";
import {DatePipe, NgIf} from "@angular/common";
import {EditEventComponent} from "./edit-event/edit-event.component";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  standalone: true,
  imports: [DatePipe, NgIf]
})
export class EventComponent implements OnInit {
  @Input()
  event!: CalEvents;

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    console.error('Event:', this.event);
  }

  async openEditEventModal() {
    this.dismissModal();
    const modal = await this.modalController.create({
      component: EditEventComponent, // Your component here
      componentProps:  { event: this.event },
      cssClass: 'modal-custom-class'
    });

    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true,
      'data': 'Any data you want to pass back' // Pass back any data you want
    });
  }
}
