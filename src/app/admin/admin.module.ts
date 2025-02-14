import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';

import { adminRoutes } from './admin.routes';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AdminProfileComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
     RouterModule.forChild(adminRoutes),
      
    CommonModule
  ],
  exports:[RouterModule]
  
})
export class AdminModule { }
