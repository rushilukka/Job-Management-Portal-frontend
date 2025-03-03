import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
 
import { ROUTES } from '../../auth/constants/Routes.constant';
 
import { environment } from '../../../environments/environments';

interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  exp?: number; // Optional expiration timestamp
}

@Component({
  selector: 'app-landingpage',
  standalone: false,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
  
export class LandingpageComponent implements OnInit {
  countdown = 2; // Initial countdown value

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Countdown Timer
    const interval = setInterval(() => {
      this.countdown--;
      document.getElementById('countdown')!.textContent = this.countdown.toString();
      
      if (this.countdown === 0) {
        clearInterval(interval);
        const token = localStorage.getItem(environment.LOCALSTORAGE.AUTH_TOKEN);
        if(token){
         const decoded = jwtDecode<JwtPayload>(token); 
         if(decoded.exp){
          const expiry = decoded.exp * 1000; // Convert expiry to milliseconds
          if(Date.now() > expiry) // Compare expiry time with current time
          this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN}`]);
          else if(decoded.isAdmin){
             this.router.navigate([ROUTES.ADMIN.DASHBOARD]); 
          }
          else if (!decoded.isAdmin){
            this.router.navigate([ROUTES.USERS.DASHBOARD]);
          }
         
        }
        }
        else {   
          this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN}`]);
          }
      }
    }, 1000); // Update every second
  }
}

