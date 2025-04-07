import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../ui/button/button.component';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-apply',
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './job-apply.component.html',
  styleUrl: './job-apply.component.css',
  standalone: true,
})
export class JobApplyComponent implements OnInit {
  applyForm: FormGroup;
  jobId: string | null;
  job: any;
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.applyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneNumberValidator()]],
      experience: ['', [Validators.required, this.experienceValidator()]],
      resume: ['', [Validators.required]],
      coverLetter: ['', [Validators.required, Validators.minLength(100)]],
    });
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.add(`${savedTheme}-theme`);
    }

    if (this.jobId) {
      this.jobService.getJobById(this.jobId).subscribe((job) => {
        this.job = job;
      });
    }
  }

  phoneNumberValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      const isValid = phoneRegex.test(control.value?.replace(/[()-\s]/g, ''));
      return isValid ? null : { invalidPhone: true };
    };
  }

  experienceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const numberMatch = value?.match(/\d+/);
      if (!numberMatch) return { invalidExperience: true };

      const years = parseInt(numberMatch[0]);
      if (isNaN(years) || years < 0 || years > 50) {
        return { invalidExperience: true };
      }
      return null;
    };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Check file size
      if (file.size > this.maxFileSize) {
        this.applyForm.get('resume')?.setErrors({ fileTooLarge: true });
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.applyForm.get('resume')?.setErrors({ invalidFileType: true });
        return;
      }

      this.selectedFile = file;
      const fileInput = document.querySelector('.file-name') as HTMLElement;
      if (fileInput) {
        fileInput.textContent = file.name;
      }
      this.applyForm.get('resume')?.setErrors(null);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.applyForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength'])
      return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['invalidPhone']) return 'Please enter a valid phone number';
    if (errors['invalidExperience'])
      return 'Please enter a valid number of years of experience';
    if (errors['fileTooLarge']) return 'File size must be less than 5MB';
    if (errors['invalidFileType']) return 'Please upload a PDF or DOCX file';

    return '';
  }

  onSubmit() {
    if (this.applyForm.valid && this.jobId) {
      const formData = new FormData();
      Object.keys(this.applyForm.value).forEach((key) => {
        if (key === 'resume' && this.selectedFile) {
          formData.append(key, this.selectedFile);
        } else {
          formData.append(key, this.applyForm.value[key]);
        }
      });
      formData.append('jobId', this.jobId);
      formData.append('date', new Date().toISOString());

      // Store in localStorage (for demo purposes)
      const applications = JSON.parse(
        localStorage.getItem('applications') || '[]'
      );
      applications.push({
        jobId: this.jobId,
        ...this.applyForm.value,
        date: new Date().toISOString(),
      });
      localStorage.setItem('applications', JSON.stringify(applications));

      this.router.navigate(['/applied']);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.applyForm.controls).forEach((key) => {
        const control = this.applyForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/jobs', this.jobId]);
  }
}
