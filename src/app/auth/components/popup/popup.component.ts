import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/Routes.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';

@Component({
  selector: 'app-popup',
  standalone: false,
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  readonly TWO_FA_ROUTE = '/auth/enable-2fa'; //   Constant for 2FA route

  @Input() Token: string = ''; 
  @Output() closePopup = new EventEmitter<void>(); 

  constructor(private authService: AuthService, private router: Router) {}

  enable2FA() {
     this.router.navigate([this.TWO_FA_ROUTE]);  
     
  }

  disable2FA() {
    const newToken = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN) ?? '';
    
    this.authService.disable2FA(newToken || this.Token).subscribe(() => {
      this.closePopup.emit(); 
    });
  }

  close() {
    this.closePopup.emit(); 
  }
}
