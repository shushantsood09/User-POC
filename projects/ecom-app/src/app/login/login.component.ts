import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loginFailed = false;

  constructor(private router: Router, private auth: AuthService) {}

   onSubmit() {
    const success = this.auth.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/home']);
    } else {
      this.loginFailed = true;
    }
  }
}
