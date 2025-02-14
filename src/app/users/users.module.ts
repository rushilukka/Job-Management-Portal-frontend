import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { usersRoutes } from './user.routes';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    RouterModule.forChild(usersRoutes),
    CommonModule,

  ],
  exports: [RouterModule]
})
export class UsersModule { }
