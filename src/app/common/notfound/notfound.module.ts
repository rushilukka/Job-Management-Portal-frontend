import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: NotfoundComponent } // Ensure this route is set correctly
];

@NgModule({
  declarations: [NotfoundComponent],
  imports: [CommonModule, RouterModule.forChild(routes)], // Import RouterModule
})
export class NotfoundModule {}
