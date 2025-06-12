import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../../../ecom-app/src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent {
  users = this.userService.getUsers();
  searchQuery: string | { label: string } | null = '';
  filteredSuggestions: any[] = [];

  globalFilterValue = '';
  displayDialog = false;
  selectedUserId: number | null = null;
  isEditMode = false;

  constructor(
    private router: Router,
    private userService: UserService,
    public authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
    console.log(this.users);
  }

  // goToDetails(id: number) {
  //   this.router.navigate(['/users/details', id]);
  // }

  deleteUser(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(id);
        this.users = this.userService.getUsers();
      },
    });
  }

  filterUsers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSuggestions = this.users
      .flatMap((user) => [
        { label: user.name, type: 'Name' },
        { label: user.email, type: 'Email' },
        { label: user.role, type: 'Role' },
      ])
      .filter(
        (item, index, self) =>
          item.label?.toLowerCase().includes(query) &&
          self.findIndex((i) => i.label === item.label) === index
      );
  }

  get searchQueryValue(): string {
    if (typeof this.searchQuery === 'string') {
      return this.searchQuery;
    }
    return this.searchQuery?.label ?? '';
  }

  applyGlobalFilter() {
    let value: string;

    if (typeof this.searchQuery === 'string') {
      value = this.searchQuery;
    } else if (
      this.searchQuery &&
      typeof this.searchQuery === 'object' &&
      'label' in this.searchQuery
    ) {
      value = this.searchQuery.label;
    } else {
      value = '';
    }

    (document.querySelector('p-table') as any)?.filterGlobal(value, 'contains');
  }

  // addUser() {
  //   this.router.navigate(['/users/details']);
  // }

  goToDetails(id: number) {
    this.selectedUserId = id;
    this.isEditMode = true;
    this.displayDialog = true;
  }

  addUser() {
    this.selectedUserId = null; // signal for "add" mode
    this.isEditMode = false;
    this.displayDialog = true;
  }

  onDialogClose() {
    this.displayDialog = false;
    this.selectedUserId = null;
  }

  onDialogHide() {
    this.displayDialog = false;
    this.selectedUserId = null;
    this.users = this.userService.getUsers(); // refresh
  }
}
