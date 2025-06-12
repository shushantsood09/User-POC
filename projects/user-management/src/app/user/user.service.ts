import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  userName: string;
  locations: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'Shushant',
      email: 'shushant@synoptek.com',
      role: 'Admin',
      phone: '9876789890',
      userName: 'shushant123',
      locations: ['Mumbai'],
    },
    {
      id: 2,
      name: 'Amit',
      email: 'amit@synoptek.com',
      role: 'User',
      phone: '8787879090',
      userName: 'amit123',
      locations: ['Mumbai'],

    },
    {
      id: 3,
      name: 'Sumit',
      email: 'sumit@synoptek.com',
      role: 'Manager',
      phone: '90876789098',
      userName: 'sumit123',
      locations: ['Mumbai'],

    },
  ];

  getUsers(): User[] {
    return [...this.users];
  }

  getUser(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  addUser(user: User) {
    this.users.push({ ...user, id: Date.now() });
  }

  updateUser(updated: User) {
    const i = this.users.findIndex((u) => u.id === updated.id);
    if (i > -1) this.users[i] = updated;
  }

  deleteUser(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
