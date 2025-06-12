import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ecom-app';
  isLoginPage = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url === '/login';
      }
    });
  }

  ngOnInit(): void {

  }

   goHome() {
    this.router.navigate(['/home']);
  }

  logout(){
    this.authService.logout();
  }
}
