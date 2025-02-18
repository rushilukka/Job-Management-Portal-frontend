import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { ManageJobsComponent } from './components/manage-jobs/manage-jobs.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminSettingsComponent } from './components/settings/settings.component';
import { ReportsComponent } from './components/reports/reports.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddJobComponent } from './components/add-job/add-job.component';

export const adminRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: AdminProfileComponent  },
  { path: 'manage-jobs', component: ManageJobsComponent  },
  { path: 'job', component: JobDetailsComponent  },
  { path: 'add-job', component: AddJobComponent  },
  
  { path: 'manage-users', component: ManageUsersComponent  },
  { path: 'user', component: UserDetailsComponent  },
  
  { path: 'settings', component: AdminSettingsComponent  },
  { path: 'reports', component: ReportsComponent  },


];
