import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleDetailComponent } from './role-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../role.service';
import { of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';

describe('RoleDetailComponent', () => {
  let component: RoleDetailComponent;
  let fixture: ComponentFixture<RoleDetailComponent>;

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  };

  const rolesServiceMock = {
    getRole: jasmine.createSpy('getRole').and.callFake((id: number) => {
      if (id === 1) return { id: 1, roleId: 'R1', role: 'Admin' };
      return undefined;
    }),
    updateRole: jasmine.createSpy('updateRole'),
    addRole: jasmine.createSpy('addRole'),
  };

  describe('Edit mode (id is present)', () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'id') return '1';
            return null;
          },
        },
      },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [RoleDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: Router, useValue: routerMock },
          { provide: RolesService, useValue: rolesServiceMock },
        ],
        imports: [TableModule, CardModule, ReactiveFormsModule],
      }).compileComponents();

      fixture = TestBed.createComponent(RoleDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode).toBeTrue();
    });

    it('should call getRole on init', () => {
      expect(rolesServiceMock.getRole).toHaveBeenCalledWith(1);
    });

    it('should not submit when form is invalid', () => {
      component.roleForm.reset();
      component.roleForm.markAllAsTouched();
      component.onSubmit();
      expect(component.roleForm.valid).toBeFalse(); // 👈 Optional debug check
      expect(rolesServiceMock.updateRole).not.toHaveBeenCalled();
    });

    // it('should not submit when form is invalid', () => {
    //   component.roleForm.patchValue({ roleId: '', role: '' });
    //   component.roleForm.markAllAsTouched();
    //   component.roleForm.updateValueAndValidity();
    //   component.onSubmit();
    //   expect(rolesServiceMock.updateRole).not.toHaveBeenCalled();
    // });

    it('should submit and call updateRole when form is valid', () => {
      component.roleForm.patchValue({ roleId: 'R1', role: 'Admin' });
      component.onSubmit();
      expect(rolesServiceMock.updateRole).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/roles']);
    });
  });

  describe('Create mode (no id)', () => {
    const activatedRouteMockCreate = {
      snapshot: {
        paramMap: {
          get: (key: string) => null,
        },
      },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [RoleDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMockCreate },
          { provide: Router, useValue: routerMock },
          { provide: RolesService, useValue: rolesServiceMock },
        ],
        imports: [TableModule, CardModule, ReactiveFormsModule],
      }).compileComponents();

      fixture = TestBed.createComponent(RoleDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize in create mode', () => {
      expect(component.isEditMode).toBeFalse();
    });

    it('should call addRole on valid form submit', () => {
      component.roleForm.patchValue({ roleId: 'R2', role: 'Manager' });
      component.onSubmit();
      expect(rolesServiceMock.addRole).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/roles']);
    });

    it('should not call addRole if form is invalid', () => {
      component.roleForm.patchValue({ roleId: '', role: '' });
      component.roleForm.markAllAsTouched();
      component.roleForm.updateValueAndValidity();
      component.onSubmit();
      expect(rolesServiceMock.addRole).not.toHaveBeenCalled();
    });
  });

  describe('Missing role in edit mode', () => {
    const activatedRouteMockInvalidId = {
      snapshot: {
        paramMap: {
          get: (key: string) => '999', // simulate non-existing ID
        },
      },
    };

    beforeEach(async () => {
      spyOn(window, 'alert'); // spy on alert to prevent actual dialog

      await TestBed.configureTestingModule({
        declarations: [RoleDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMockInvalidId },
          { provide: Router, useValue: routerMock },
          { provide: RolesService, useValue: rolesServiceMock },
        ],
        imports: [TableModule, CardModule, ReactiveFormsModule],
      }).compileComponents();

      fixture = TestBed.createComponent(RoleDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should alert and navigate when role not found', () => {
      expect(window.alert).toHaveBeenCalledWith('Role not found');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/roles']);
    });
  });
});
