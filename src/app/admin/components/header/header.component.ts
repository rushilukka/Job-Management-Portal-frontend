import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { ROUTES } from '../../constants/Routes.constants';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router) {}
  isDropdownVisible: boolean = false;

  @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef;

  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Prevents the event from bubbling up
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    if (this.dropdownMenu && !this.dropdownMenu.nativeElement.contains(event.target)) {
      this.isDropdownVisible = false;
    }
  }

  settings() {
     this.router.navigate([ROUTES.SETTINGS]);
  }
  myprofile() {
     this.router.navigate([ROUTES.PROFILE]);
  }

  logout() {
      localStorage.removeItem(environment.LOCALSTORAGE.AUTH_TOKEN);  
      localStorage.removeItem(environment.LOCALSTORAGE.VERIFICATION_PENDING);  
      localStorage.removeItem(environment.LOCALSTORAGE.JOB_DATA);  
      localStorage.removeItem(environment.LOCALSTORAGE.USER_DATA);  
      localStorage.removeItem(environment.LOCALSTORAGE.ADMIN_DATA);  
      this.router.navigate([ROUTES.LOGIN]);  
    }
}
