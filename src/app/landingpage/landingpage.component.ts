import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
        this.router.navigate(['/auth/login']);
      }
    }, 1000); // Update every second
  }
}

