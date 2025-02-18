import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UploadResumeComponent } from './components/upload-resume/upload-resume.component';
import { ApplyForJobComponent } from './components/apply-for-job/apply-for-job.component';
import { AppliedJobComponent } from './components/applied-job/applied-job.component';

export const usersRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'apply', component: ApplyForJobComponent },
  { path: 'upload-resume', component: UploadResumeComponent },
    { path: 'applied-job', component: AppliedJobComponent },

];
