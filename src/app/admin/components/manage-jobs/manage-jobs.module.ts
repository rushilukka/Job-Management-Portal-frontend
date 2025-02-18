import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageJobsComponent } from './manage-jobs.component';
import { HeaderComponent } from '../header/header.component';
import { AdminProfileComponent } from '../admin-profile/admin-profile.component';
import { FooterComponent } from '../footer/footer.component';


@NgModule({
  declarations: [
    ManageJobsComponent,
     AdminProfileComponent,
        FooterComponent,
        HeaderComponent
  ],
  imports: [
    CommonModule, 
  ]
})
export class ManageJobsModule { }
