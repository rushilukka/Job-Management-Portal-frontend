import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-apply-for-job',
  standalone: false,
  templateUrl: './apply-for-job.component.html',
  styleUrl: './apply-for-job.component.scss'
})
export class ApplyForJobComponent {

  jobId: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.queryParamMap.get('jobId');
  }

  applyJob(): void {
    if (!this.jobId) return;

    this.http.post(API_ENDPOINTS.APPLY_JOB, { jobId: this.jobId }).subscribe({
      next: () => console.log(TOASTER_MESSAGES.JOB_APPLIED),
      error: () => console.error(MESSAGES.APPLY_JOB_ERROR)
    });
  }
}

