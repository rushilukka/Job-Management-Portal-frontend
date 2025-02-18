import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { usersRoutes } from './user.routes';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ApplyForJobComponent } from './components/apply-for-job/apply-for-job.component';
import { AppliedJobComponent } from './components/applied-job/applied-job.component';
import { UploadResumeComponent } from './components/upload-resume/upload-resume.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    ApplyForJobComponent,
    AppliedJobComponent,
    UploadResumeComponent,
    SettingsComponent
  ],
  imports: [
    RouterModule.forChild(usersRoutes),
    CommonModule,

  ],
  exports: [RouterModule]
})
export class UsersModule { }
