import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../../role.service';
import { AuthService } from '../../../../../ecom-app/src/app/services/auth.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent {
  roles = this.roleService.getRoles();

  globalFilterValue = '';

  constructor(
    private router: Router,
    private roleService: RolesService,
    public authService: AuthService
  ) {}

  goToDetails(id: number) {
    this.router.navigate(['/roles/details', id]);
  }

  deleteRole(id: number) {
    if (confirm('Are you sure you want to delete?')) {
      this.roleService.deleteRole(id);
      this.roles = this.roleService.getRoles();
    }
  }

  addRole() {
    this.router.navigate(['/roles/details']);
  }
}
