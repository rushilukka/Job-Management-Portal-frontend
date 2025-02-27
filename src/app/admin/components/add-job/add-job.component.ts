import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { HttpResponse } from '@angular/common/http';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { take } from 'rxjs';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import {TOASTER_MESSAGES} from '../../constants/toasterMessages.constant'
@Component({
  selector: 'app-add-job',
  standalone: false,
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss'
})
export class AddJobComponent {
  jobForm: FormGroup = {} as FormGroup;
  jobSkills: string[] = []; 
  newSkill: string = '';   

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

   addSkill(skill: string): void {
    const trimmedSkill = skill.trim();
    const skillRegex = /^[A-Za-z]+$/;
    
    if (!trimmedSkill) {
      this.toaster.error(TOASTER_MESSAGES.SKILL_EMPTY, 'Error');
      return;
    }
    
    if (trimmedSkill.length > 10) {
      this.toaster.error(TOASTER_MESSAGES.SKILL_LENGTH_EXCEEDED, 'Error');
      return;
    }
    
    if (!skillRegex.test(trimmedSkill)) {
      this.toaster.error(TOASTER_MESSAGES.SKILL_INVALID, 'Error');
      return;
    }
    
    if (this.jobSkills.includes(trimmedSkill.toLowerCase())) {
      this.toaster.error(TOASTER_MESSAGES.SKILL_ALREADY_ADDED, 'Error');
      return;
    }
    
    if (!this.jobSkills.includes(trimmedSkill)) {    
      this.jobSkills.push(trimmedSkill.toLowerCase());
      this.newSkill = '';  
    }
  }

 
  removeSkill(skill: string): void {
    this.jobSkills = this.jobSkills.filter(s => s !== skill);
  }

  async onSubmit(): Promise<void> {
    if (this.jobForm.invalid) {
      return;
    } else {
      const formData = {
        ...this.jobForm.value,
        jobSkills: this.jobSkills 
      };

      await this.adminService.addJob(formData).pipe(take(1)).subscribe(
        (response: HttpResponse<StandardResponse<{LoginTokenJWT: string}>>) => {
          this.jobForm.reset();
          this.jobSkills = [];  

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
