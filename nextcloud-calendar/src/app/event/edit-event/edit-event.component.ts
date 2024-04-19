import {Component, Input, OnInit} from '@angular/core';
import {CalEvents} from "../../models/cal-events";
import {IonDatetime} from "@ionic/angular/standalone";
import {NgFor} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  standalone: true,
  imports: [IonDatetime, NgFor, FormsModule]
})
export class EditEventComponent  implements OnInit {
  @Input()
  event!: CalEvents;

  constructor() { }

  ngOnInit() {}

}
