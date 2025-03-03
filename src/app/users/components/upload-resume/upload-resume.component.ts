import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import { ToasterService } from '../../../shared/Toaster/toaster.service';

@Component({
  selector: 'app-upload-resume',
  standalone: false,
  templateUrl: './upload-resume.component.html',
  styleUrl: './upload-resume.component.scss'
})
export class UploadResumeComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient,private userService: UserService,private toasterService:ToasterService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadResume(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.userService.uploadResume(formData).subscribe({
      next: () => this.toasterService.success(TOASTER_MESSAGES.RESUME_UPLOADED),
      error: () => console.error(MESSAGES.UPLOAD_ERROR)
    })
    // this.http.post(API_ENDPOINTS.UPLOAD_RESUME, formData).subscribe({
    //   next: () => console.log(TOASTER_MESSAGES.RESUME_UPLOADED),
    //   error: () => console.error(MESSAGES.UPLOAD_ERROR)
    // });
  }
}