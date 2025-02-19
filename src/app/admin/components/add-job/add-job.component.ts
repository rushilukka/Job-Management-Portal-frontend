import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { HttpResponse } from '@angular/common/http';
import { ToasterService } from '../../../core/components/toaster.service';

@Component({
  selector: 'app-add-job',
  standalone: false,
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss'
})
export class AddJobComponent {
  jobForm: FormGroup = {} as FormGroup;
  jobSkills: string[] = []; // Array to hold the skills
  newSkill: string = '';  // Add this line to define newSkill

  constructor(private fb: FormBuilder, private adminService: AdminService, private toaster: ToasterService) {}

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

  // Add skill to the jobSkills array with validation
  addSkill(skill: string): void {
    // Trim leading/trailing spaces and check conditions
    const trimmedSkill = skill.trim();

    // Custom validation: alphabets only, no special characters, max 10 characters
    const skillRegex = /^[A-Za-z]+$/;
    
    if (!trimmedSkill) {
      this.toaster.error('Skill cannot be empty.', 'Error');
      return;
    }

    if (trimmedSkill.length > 10) {
      this.toaster.error('Skill cannot exceed 10 characters.', 'Error');
      return;
    }

    if (!skillRegex.test(trimmedSkill)) {
      this.toaster.error('Skill must contain only alphabets (no spcaing or special characters).', 'Error');
      return;
    }
    if (this.jobSkills.includes(trimmedSkill.toLowerCase())) {
      this.toaster.error('Skill already Added.', 'Error');
      return;
    }


    // Add to the skills array if valid and not already present
    if (!this.jobSkills.includes(trimmedSkill)) {
      
      this.jobSkills.push(trimmedSkill.toLowerCase());
      this.newSkill = '';  // Reset the input after adding the skill
    }
  }

  // Remove skill from the jobSkills array
  removeSkill(skill: string): void {
    this.jobSkills = this.jobSkills.filter(s => s !== skill);
  }

  // Event handler for form validation on submit
  async onSubmit(): Promise<void> {
    if (this.jobForm.invalid) {
      console.log('Form is invalid');
      return;
    } else {
      // Include the jobSkills array before submitting
      const formData = {
        ...this.jobForm.value,
        jobSkills: this.jobSkills // Include jobSkills
      };

      await this.adminService.addJob(formData).subscribe(
        (response: HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>) => {
          console.log(response.body?.data);
          console.log('Form Submitted:', this.jobForm.value);
          this.jobForm.reset();
          this.jobSkills = []; // Reset skills after submission

          // Reinitialize form
          this.jobForm = this.fb.group({
            jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
            jobDescription: ['', [Validators.required, Validators.maxLength(500)]],
            salaryRange: ['', [Validators.required, this.salaryRangeValidator]],
            location: ['', [Validators.required, Validators.maxLength(100)]]
          });
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
}
