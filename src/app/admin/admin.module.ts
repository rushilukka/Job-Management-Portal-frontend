import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';

import { adminRoutes } from './admin.routes';
import {  RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ManageJobsComponent } from './components/manage-jobs/manage-jobs.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminSettingsComponent } from './components/settings/settings.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AddJobComponent } from './components/add-job/add-job.component'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { UserActionButtonComponent } from './components/user-action-button/user-action-button.component';
import { UserJobApplicationComponent } from './components/user-job-application/user-job-application.component';
import { ChartModule } from 'primeng/chart'; //  Import ChartModule


@NgModule({
  declarations: [
    ManageJobsComponent,
    ManageUsersComponent,
    AdminProfileComponent,
    AdminSettingsComponent,
    ReportsComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    JobDetailsComponent,
    UserDetailsComponent,
    AddJobComponent,
    UserActionButtonComponent,
    UserJobApplicationComponent,      
  ],
  imports: [
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
    RouterModule.forChild(adminRoutes),
    SharedModule,
    CommonModule,
    ChartModule
  ],
  exports:[RouterModule]
  
})
export class AdminModule { }
