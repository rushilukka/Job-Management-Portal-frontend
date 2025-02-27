import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss'
})
export class AdminProfileComponent {
  name = 'Rushi Lukka';
  email = 'admin@gmail.com';
  is2FAEnabled = false; 
}