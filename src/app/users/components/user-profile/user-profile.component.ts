import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { MESSAGES } from '../../constants/Messages.constant';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userResume: {} = {};
  userSkills: [] = [];
  appliedJobs: [] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.http.get<any>(API_ENDPOINTS.USER_RESUME).subscribe({
      next: (response) => (this.userResume = response.data),
      error: () => console.error(MESSAGES.USER_PROFILE_FETCH_ERROR)
    });

    this.http.get<any>(API_ENDPOINTS.USER_SKILLS).subscribe({
      next: (response) => (this.userSkills = response.data),
      error: () => console.error(MESSAGES.USER_PROFILE_FETCH_ERROR)
    });

    this.http.get<any>(API_ENDPOINTS.USER_APPLIED_JOBS).subscribe({
      next: (response) => (this.appliedJobs = response.data),
      error: () => console.error(MESSAGES.USER_PROFILE_FETCH_ERROR)
    });
  }
}