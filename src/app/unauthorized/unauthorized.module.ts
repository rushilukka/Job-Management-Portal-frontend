import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './unauthorized.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: UnauthorizedComponent } // Ensure this route is set correctly
];

@NgModule({
  declarations: [
    UnauthorizedComponent
  ],
    imports: [CommonModule, RouterModule.forChild(routes)], // Import RouterModule
  })
export class UnauthorizedModule { }
