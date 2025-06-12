import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './roles/role/role.component';

const routes: Routes = [
  {path: '', redirectTo: '/roles', pathMatch: 'full'},
  {path: 'roles', component: RoleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
