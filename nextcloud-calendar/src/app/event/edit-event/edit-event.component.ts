import {Component, Input, OnInit} from '@angular/core';
import {CalEvents} from "../../models/cal-events";

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent  implements OnInit {
  @Input()
  event!: CalEvents;

  constructor() { }

  ngOnInit() {}

}
