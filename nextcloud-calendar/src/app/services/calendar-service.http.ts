import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CalendarServiceHttp {
  constructor(private http: HttpClient) {

  }

  getCalendarData(url: string, username: string, password: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Accept': 'text/calendar'
    });

    return this.http.get(url, {headers: headers, responseType: 'text'});
  }

  findCalendars(serverUrl: string, username: string, password: string): Observable<any> {
    const body = {serverUrl, username, password};
    return this.http.post(environment.URL, body);
  }
}
