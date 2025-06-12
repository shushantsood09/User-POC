import { Injectable } from '@angular/core';

export interface Role {
  id: number;
  roleId: number;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  private roles: Role[] = [
    { id: 1, roleId: 101, role: 'Admin' },
    { id: 2, roleId: 102, role: 'role' },
    { id: 3, roleId: 103, role: 'Manager' },
  ];

  getRoles(): Role[] {
    return [...this.roles];
  }

  getRole(id: number): Role | undefined {
    return this.roles.find((role) => role.id === id);
  }

  addRole(role: Role) {
    this.roles.push({ ...role, id: Date.now() });
  }

  updateRole(updated: Role) {
    const i = this.roles.findIndex((u) => u.id === updated.id);
    if (i > -1) this.roles[i] = updated;
  }

  deleteRole(id: number) {
    this.roles = this.roles.filter((u) => u.id !== id);
  }
}
