import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-resume',
  standalone: false,
  templateUrl: './upload-resume.component.html',
  styleUrl: './upload-resume.component.scss'
})
export class UploadResumeComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadResume(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('resume', this.selectedFile);

    this.http.post(API_ENDPOINTS.UPLOAD_RESUME, formData).subscribe({
      next: () => console.log(TOASTER_MESSAGES.RESUME_UPLOADED),
      error: () => console.error(MESSAGES.UPLOAD_ERROR)
    });
  }
}