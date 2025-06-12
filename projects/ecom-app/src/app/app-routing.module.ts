import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { UserManagementComponent } from './user-management/user-management.component';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';

const USER_APP_URL = 'http://localhost:4201/remoteEntry.js';
const ROLE_APP_URL = 'http://localhost:4300/remoteEntry.js';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () => {
      return loadRemoteModule({
        remoteEntry: USER_APP_URL,
        remoteName: 'userManagement',
        exposedModule: './UserModule',
      }).then((m) => m.UserModule);
    },
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],
    loadChildren: () => {
      return loadRemoteModule({
        remoteEntry: ROLE_APP_URL,
        remoteName: 'roleManagement',
        exposedModule: './RoleModule',
      }).then((m) => m.RoleModule);
    },
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingCompArray = [HomeComponent];
