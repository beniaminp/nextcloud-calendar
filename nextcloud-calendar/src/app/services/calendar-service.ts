import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private http: HttpClient) {

  }

  getCalendarData(url: string, username: string, password: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Accept': 'text/calendar'
    });

    return this.http.get(url, {headers: headers, responseType: 'text'});
  }

  findCalendars(): Observable<any> {
    return this.http.get('http://localhost:3000/calendars/');
  }
}
