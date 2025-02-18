import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-job',
  standalone: false,
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss'
})
export class AddJobComponent {
  jobForm: FormGroup= {} as FormGroup;

  constructor(private fb: FormBuilder,private adminService: AdminService) { }

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      jobDescription: ['', [Validators.required, Validators.maxLength(500)]],
      salaryRange: ['', [Validators.required, this.salaryRangeValidator]],
      location: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  // Custom validator to check salary range format (min-max)
  salaryRangeValidator(control: any) {
    const regex = /^(\d+)-(\d+)$/;
    if (!control.value || !regex.test(control.value)) {
      return { invalidSalaryFormat: true };
    }

    const [lower, upper] = control.value.split('-').map(Number);
    if (lower < 30000 || upper > 200000 || lower >= upper) {
      return { invalidSalaryRange: true };
    }

    return null;
  }






  // Event handler for form validation on submit
   async onSubmit(): Promise<void> {
    if (this.jobForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    else{
      
     await this.adminService.addJob(this.jobForm.value).subscribe(
       (response : HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>) => {
         console.log(response.body?.data);
         console.log('Form Submitted:', this.jobForm.value);
         this.jobForm.reset();
         this.jobForm = this.fb.group({
          jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
          jobDescription: ['', [Validators.required, Validators.maxLength(500)]], 
          salaryRange: ['', [Validators.required, this.salaryRangeValidator]],
          location: ['', [Validators.required, Validators.maxLength(100)]]
        });
       },
       (error:any) => {
         console.error(error);
       }
     ) 
      // this.jobForm = this.fb.group({
      //   jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      //   jobDescription: ['', [Validators.required, Validators.maxLength(500)]],
      //   salaryRange: ['', [Validators.required, this.salaryRangeValidator]],
      //   location: ['', [Validators.required, Validators.maxLength(100)]]
      // });
    }  
  }
}