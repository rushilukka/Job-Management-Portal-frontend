import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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



    logout() {
      localStorage.removeItem('authToken'); // 🔥 Clear token
      this.router.navigate(['/auth/login']); // 🔄 Redirect to login
    }
}
