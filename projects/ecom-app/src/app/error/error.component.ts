import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {

  }

  goHome() {
    this.router.navigate(['/users']);
  }

}
