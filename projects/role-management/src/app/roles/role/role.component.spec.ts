import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleComponent } from './role.component';
import { Router } from '@angular/router';
import { RolesService } from '../../role.service';
import { of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

describe('RoleComponent', () => {
  let component: RoleComponent;
  let fixture: ComponentFixture<RoleComponent>;
  let mockRouter: any;
  let mockRoleService: any;

  beforeEach(() => {
    // Mock Role Data
    const rolesMock = [
      { id: 1, label: 'Admin', value: 'admin' },
      { id: 2, label: 'Editor', value: 'editor' }
    ];

    // Mock Router
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    // Mock Role Service
    mockRoleService = {
      getRoles: jasmine.createSpy('getRoles').and.returnValue(rolesMock),
      deleteRole: jasmine.createSpy('deleteRole')
    };

    TestBed.configureTestingModule({
      declarations: [RoleComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RolesService, useValue: mockRoleService }
      ],
      imports: [TableModule, CardModule],
    });

    fixture = TestBed.createComponent(RoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', () => {
    expect(component.roles.length).toBe(2);
    expect(mockRoleService.getRoles).toHaveBeenCalled();
  });

  it('should navigate to details on edit', () => {
    component.goToDetails(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles/details', 1]);
  });

  it('should navigate to add role page', () => {
    component.addRole();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles/details']);
  });

  it('should delete role with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Simulate user clicking "OK"
    component.deleteRole(1);
    expect(mockRoleService.deleteRole).toHaveBeenCalledWith(1);
    expect(mockRoleService.getRoles).toHaveBeenCalled();
  });

  it('should not delete role if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false); // Simulate user clicking "Cancel"
    component.deleteRole(1);
    expect(mockRoleService.deleteRole).not.toHaveBeenCalled();
  });
});
