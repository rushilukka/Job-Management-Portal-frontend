import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-applied-job',
  standalone: false,
  templateUrl: './applied-job.component.html',
  styleUrl: './applied-job.component.scss'
})
export class AppliedJobComponent {
   
  jobDetail: any;
  constructor(private http: HttpClient,private userService: UserService) {}

  ngOnInit(): void {
      this.jobDetail = this.userService.getJobData();
    console.log('jobDetail -  ------', this.jobDetail);
   
  }


}
