import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  password: string;
  role: 'Admin' | 'Manager';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users: User[] = [
    { username: 'admin', password: 'admin', role: 'Admin' },
    { username: 'manager', password: 'manager', role: 'Manager' }
  ];

  private currentUser: User | null = null;

  constructor(private router: Router) {
    // Load user from localStorage
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(username: string, password: string): boolean {
    const foundUser = this.users.find(
      u => u.username === username && u.password === password
    );
    if (foundUser) {
      this.currentUser = foundUser;
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getRole(): 'Admin' | 'Manager' | null {
    return this.currentUser?.role ?? null;
  }

  getUsername(): string | null {
    return this.currentUser?.username ?? null;
  }
}
