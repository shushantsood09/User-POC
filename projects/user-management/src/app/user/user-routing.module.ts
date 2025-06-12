import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';


const routes: Routes = [
   { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UserComponent },
  { path: 'details', component: UserDetailComponent },
  { path: 'details/:id', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
