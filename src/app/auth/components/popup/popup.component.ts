import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/Routes.constant';
import { take } from 'rxjs';

@Component({
  selector: 'app-popup',
  standalone: false,
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  @Input() Token: string = ''; 
  @Output() closePopup = new EventEmitter<void>(); 

  constructor(private authService: AuthService, private router: Router) {}

  enable2FA() {
     this.router.navigate([ROUTES.AUTH.TWO_FA_ROUTE]);    
  }

  disable2FA() {
    this.authService.disable2FA().pipe(take(1)).subscribe(() => {
      this.closePopup.emit(); 
    });
  }

  close() {
    this.closePopup.emit(); 
  }
}
