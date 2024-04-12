import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class CalendarService {
    constructor(private http: HttpClient){

    }

    getCalendarData(url: string, username: string, password: string) {
        const headers = new HttpHeaders({
          'Authorization': 'Basic ' + btoa(username + ':' + password),
          'Accept': 'text/calendar'
        });
    
        return this.http.get(url, { headers: headers, responseType: 'text' });
      }

      /*private parseCalendarData(data: string) {
        const jCalData = ical.parse(data);
        const vcalendar = new ical.Component(jCalData);
        const events = vcalendar.getAllSubcomponents('vevent')
        .map((event: any) => {
          const vevent = new ical.Event(event);
          return {
            summary: vevent.summary,
            start: vevent.startDate.toString(),
            end: vevent.endDate.toString(),
            location: vevent.location,
            description: vevent.description
          };
        });
        return events;
      }
      */
  }