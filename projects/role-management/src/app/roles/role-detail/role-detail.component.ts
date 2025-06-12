import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, RolesService } from '../../role.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss'],
})
export class RoleDetailComponent implements OnInit {
  roleForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.roleForm = this.fb.group({
      roleId: ['', Validators.required],
      role: ['', Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const existingRole = this.rolesService.getRole(id);
      if (existingRole) {
        this.roleForm.patchValue(existingRole);
        this.isEditMode = true;
      } else {
        alert('Role not found');
        this.router.navigate(['/roles']);
      }
    }
  }

  onSubmit() {
    if (this.roleForm.invalid) return;

    const roleData: Role = {
      ...this.roleForm.value,
      id: this.isEditMode ? this.rolesService.getRole(Number(this.route.snapshot.paramMap.get('id')))?.id || 0 : 0,
    };

    if (this.isEditMode) {
      this.rolesService.updateRole(roleData);
    } else {
      this.rolesService.addRole(roleData);
    }

    this.router.navigate(['/roles']);
  }
}
