import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../user.service';
import { RolesService } from 'projects/role-management/src/app/role.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent {
  @Input() userId: number | null = null;
  @Output() closeDialog = new EventEmitter<void>();
  @ViewChild('userForm') userForm!: NgForm;
  locationsTouched: boolean = false;
  locations = [
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Bangalore', value: 'Bangalore' },
  ];

  user: User = {
    id: 0,
    name: '',
    email: '',
    role: '',
    phone: '',
    userName: '',
    locations: [],
  }; // Default for Add
  isEditMode = false;

  roles: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RolesService,
    private router: Router
  ) {}

  ngOnChanges() {
    this.roles = this.roleService.getRoles().map((role) => ({
      label: role.role,
      value: role.role,
    }));

    if (this.userId !== null) {
      const existingUser = this.userService.getUser(this.userId);
      if (existingUser) {
        const matchedRole = this.roles.find(
          (r: any) => r.value === existingUser.role
        );
        this.user = {
          ...existingUser,
          role: matchedRole ? matchedRole.value : '',
        };
        this.isEditMode = true;
      }
    } else {
      this.isEditMode = false;
      this.user = {
        id: 0,
        name: '',
        email: '',
        role: '',
        phone: '',
        userName: '',
        locations: [],
      };

      console.log(this.user)

      // Reset form after user object reset
      setTimeout(() => {
        this.userForm?.resetForm();
      });
    }
  }

  save() {
    this.user.name = this.user.name?.trim();
    this.user.email = this.user.email?.trim();
    const payload = {
      ...this.user,
      role: (this.user.role as any)?.value || this.user.role,
      locations: this.user.locations,
    };

    if (this.isEditMode) {
      this.userService.updateUser(payload);
    } else {
      this.userService.addUser(payload);
    }
  }

  triggerValidation(form: NgForm) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field];
      control.markAsTouched({ onlySelf: true });
    });

    this.locationsTouched = true;

    if (form.valid) {
      this.save(); // Save only if valid
      this.closeDialog.emit(); // Close dialog only after successful save
    }
  }
}
