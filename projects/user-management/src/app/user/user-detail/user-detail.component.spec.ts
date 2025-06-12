import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { RolesService } from 'projects/role-management/src/app/role.service';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DebugElement } from '@angular/core';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  const mockActivatedRoute = {
    snapshot: { params: {} },
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  const mockUserService = {
    getUser: jasmine.createSpy('getUser').and.returnValue(null),
    updateUser: jasmine.createSpy('updateUser'),
    addUser: jasmine.createSpy('addUser'),
  };

  const mockRolesService = {
    getRoles: jasmine
      .createSpy('getRoles')
      .and.returnValue([{ role: 'Admin' }, { role: 'Manager' }]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        InputTextModule,
        DropdownModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        MultiSelectModule,
      ],
      declarations: [UserDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: RolesService, useValue: mockRolesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in add mode if userId is null', () => {
    component.userId = null;
    component.ngOnChanges();

    expect(component.isEditMode).toBeFalse();
    expect(component.user.name).toBe('');
  });

  it('should initialize in edit mode if userId is provided and user exists', () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'Admin',
      phone: '1234567890',
      userName: 'testuser',
      locations: ['Delhi'],
    };
    mockUserService.getUser.and.returnValue(mockUser);

    component.userId = 1;
    component.ngOnChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.user.name).toBe('Test User');
  });

  it('should call addUser on valid form submit in add mode', () => {
    spyOn(component.closeDialog, 'emit');
    component.userId = null;
    component.ngOnChanges();

    component.user = {
      id: 0,
      name: 'New User',
      email: 'new@example.com',
      role: 'Admin',
      phone: '1234567890',
      userName: 'newuser',
      locations: ['Mumbai'],
    };

    const mockForm: any = {
      valid: true,
      controls: {
        name: { markAsTouched: () => {} },
        email: { markAsTouched: () => {} },
        role: { markAsTouched: () => {} },
        phone: { markAsTouched: () => {} },
        userName: { markAsTouched: () => {} },
        locations: { markAsTouched: () => {} },
      },
    };

    component.triggerValidation(mockForm);
    expect(mockUserService.addUser).toHaveBeenCalled();
    expect(component.closeDialog.emit).toHaveBeenCalled();
  });

  it('should not call addUser or updateUser if form is invalid', () => {
    mockUserService.addUser.calls.reset();
    mockUserService.updateUser.calls.reset();
    const mockForm: any = {
      valid: false,
      controls: {
        name: { markAsTouched: () => {} },
        email: { markAsTouched: () => {} },
        role: { markAsTouched: () => {} },
        phone: { markAsTouched: () => {} },
        userName: { markAsTouched: () => {} },
        locations: { markAsTouched: () => {} },
      },
    };

    component.triggerValidation(mockForm);
    expect(mockUserService.addUser).not.toHaveBeenCalled();
    expect(mockUserService.updateUser).not.toHaveBeenCalled();
  });

  it('should call updateUser on valid form submit in edit mode', () => {
    spyOn(component.closeDialog, 'emit');
    component.userId = 2;
    const existingUser = {
      id: 2,
      name: 'Existing',
      email: 'existing@example.com',
      role: 'Manager',
      phone: '9876543210',
      userName: 'existinguser',
      locations: ['Bangalore'],
    };
    mockUserService.getUser.and.returnValue(existingUser);

    component.ngOnChanges(); // to set isEditMode and populate user

    const mockForm: any = {
      valid: true,
      controls: {
        name: { markAsTouched: () => {} },
        email: { markAsTouched: () => {} },
        role: { markAsTouched: () => {} },
        phone: { markAsTouched: () => {} },
        userName: { markAsTouched: () => {} },
        locations: { markAsTouched: () => {} },
      },
    };

    component.triggerValidation(mockForm);
    expect(mockUserService.updateUser).toHaveBeenCalled();
    expect(component.closeDialog.emit).toHaveBeenCalled();
  });
});
