export class CalEvents {
  dtstamp: string;
  dtstart: string;
  dtend: string;
  uid: string;
  rrule: {
    freq: string;
  };
  summary: string;
  transp: string;
  'x-nextcloud-bc-field-type': string;
  'x-nextcloud-bc-unknown-year': string;
  day: number;
  month?: number;
  hour?: string;
  minute?: string;
  seconds?: string;
  description: string;

  constructor() {
    this.dtstamp = '';
    this.dtstart = '';
    this.dtend = '';
    this.uid = '';
    this.rrule = {
      freq: ''
    };
    this.summary = '';
    this.transp = '';
    this['x-nextcloud-bc-field-type'] = '';
    this['x-nextcloud-bc-unknown-year'] = '';
    this.day = 0;
    this.description = '';
  }
}
