import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class AuthComponent implements OnInit {
  serverAddress: string = '';
  username: string = '';
  password: string = '';

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('serverAddress') && localStorage.getItem('username') && localStorage.getItem('password')) {
      this.router.navigate(['/home']);
    }
  }

  setupServer() {
    localStorage.setItem('serverAddress', this.serverAddress);
    localStorage.setItem('username', this.username);
    localStorage.setItem('password', this.password);
    this.router.navigate(['/home']);
  }

}
