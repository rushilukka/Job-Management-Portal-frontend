import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName:string = '';
  constructor(private router: Router,private userService: UserService) {}
  ngOnInit() {
    const userDetails = this.userService.getUserData();
    this.userName = userDetails?.name?? '';
  }
  settings() {
    this.router.navigate(['/users/settings']);
  }
  myprofile() {
    this.router.navigate(['/users/profile']);
  }

  logout() {
   localStorage.removeItem(environment.LOCALSTORAGE.AUTH_TOKEN); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.VERIFICATION_PENDING); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.JOB_DATA); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.USER_DATA); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.ADMIN_DATA); // 🔥 Clear token
       
  
    this.router.navigate(['/auth/login']); // 🔄 Redirect to login
  }
}
