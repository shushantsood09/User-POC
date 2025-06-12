import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../../../ecom-app/src/app/services/auth.service';

class MockAuthService {
  getRole() {
    return 'Admin';
  }
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let mockUserService: any;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockUserService = {
      getUsers: () => [
        { id: 1, name: 'John Doe', userName: 'john_doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', userName: 'jane_smith', email: 'jane@example.com', role: 'User' },
      ],
      deleteUser: jasmine.createSpy('deleteUser'),
    };

    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ConfirmDialogModule,
        AutoCompleteModule,
        NoopAnimationsModule,
      ],
      providers: [
        ConfirmationService,
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users from the service', () => {
    expect(component.users.length).toBe(2);
  });

  it('should set isEditMode and selectedUserId when goToDetails is called', () => {
    component.goToDetails(1);
    expect(component.isEditMode).toBeTrue();
    expect(component.selectedUserId).toBe(1);
    expect(component.displayDialog).toBeTrue();
  });

  it('should reset selectedUserId and open dialog when addUser is called', () => {
    component.addUser();
    expect(component.isEditMode).toBeFalse();
    expect(component.selectedUserId).toBeNull();
    expect(component.displayDialog).toBeTrue();
  });

  it('should call deleteUser from service when confirmed', () => {
    const confirmationService = TestBed.inject(ConfirmationService);
    spyOn(confirmationService, 'confirm').and.callFake((options: Confirmation) => {
      options.accept?.();
      return confirmationService;
    });

    component.deleteUser(1);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should NOT call deleteUser from service when cancelled', () => {
    const confirmationService = TestBed.inject(ConfirmationService);
    spyOn(confirmationService, 'confirm').and.callFake((options: Confirmation) => {
      options.reject?.();
      return confirmationService;
    });

    component.deleteUser(1);
    expect(mockUserService.deleteUser).not.toHaveBeenCalled();
  });

  it('should reset dialog and selected user on onDialogClose', () => {
    component.selectedUserId = 2;
    component.displayDialog = true;

    component.onDialogClose();
    expect(component.displayDialog).toBeFalse();
    expect(component.selectedUserId).toBeNull();
  });

  it('should refresh users on onDialogHide', () => {
    component.onDialogHide();
    expect(component.users.length).toBe(2);
    expect(component.displayDialog).toBeFalse();
    expect(component.selectedUserId).toBeNull();
  });

  it('should populate filteredSuggestions in filterUsers', () => {
    component.filterUsers({ query: 'john' });
    expect(component.filteredSuggestions.some(s => s.label.toLowerCase().includes('john'))).toBeTrue();
  });

  it('should apply global filter when searchQuery is string', () => {
    component.searchQuery = 'admin';

    const fakeTable = { filterGlobal: jasmine.createSpy('filterGlobal') };
    spyOn(document, 'querySelector').and.returnValue(fakeTable as any);

    component.applyGlobalFilter();
    expect(fakeTable.filterGlobal).toHaveBeenCalledWith('admin', 'contains');
  });

  it('should apply global filter when searchQuery is object with label', () => {
    component.searchQuery = { label: 'user' };

    const fakeTable = { filterGlobal: jasmine.createSpy('filterGlobal') };
    spyOn(document, 'querySelector').and.returnValue(fakeTable as any);

    component.applyGlobalFilter();
    expect(fakeTable.filterGlobal).toHaveBeenCalledWith('user', 'contains');
  });

  it('should apply global filter with empty string for null searchQuery', () => {
    component.searchQuery = null;

    const fakeTable = { filterGlobal: jasmine.createSpy('filterGlobal') };
    spyOn(document, 'querySelector').and.returnValue(fakeTable as any);

    component.applyGlobalFilter();
    expect(fakeTable.filterGlobal).toHaveBeenCalledWith('', 'contains');
  });

  it('should apply global filter with empty string when searchQuery is empty object', () => {
    component.searchQuery = { label: '' };

    const fakeTable = { filterGlobal: jasmine.createSpy('filterGlobal') };
    spyOn(document, 'querySelector').and.returnValue(fakeTable as any);

    component.applyGlobalFilter();
    expect(fakeTable.filterGlobal).toHaveBeenCalledWith('', 'contains');
  });

  it('should safely handle deleteUser even if confirm callbacks are missing', () => {
    const confirmationService = TestBed.inject(ConfirmationService);
    spyOn(confirmationService, 'confirm').and.callFake((options: Confirmation) => {
      expect(() => options.accept?.()).not.toThrow();
      expect(() => options.reject?.()).not.toThrow();
      return confirmationService;
    });

    component.deleteUser(1);
  });
});
