import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './landingpage.component';
import { Router, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: LandingpageComponent } // Ensure this route is set correctly
];



@NgModule({
  declarations: [
    LandingpageComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild([{path:'',component:LandingpageComponent}])  
  ]
})
export class LandingpageModule { }
