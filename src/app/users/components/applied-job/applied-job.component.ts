import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { MESSAGES } from '../../constants/Messages.constant';

@Component({
  selector: 'app-applied-job',
  standalone: false,
  templateUrl: './applied-job.component.html',
  styleUrl: './applied-job.component.scss'
})
export class AppliedJobComponent {
  appliedJobs: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
  }
}
