import { Component, OnInit } from '@angular/core';
import { Job } from '../../model/job.model';
import { JobService } from '../../services/job.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobCardComponent } from '../job-card/job-card.component';
import { ButtonComponent } from '../ui/button/button.component';
interface Application {
  jobId: string;
  name: string;
  email: string;
  experience: string;
  resume: string;
  coverLetter: string;
  date: string;
}
@Component({
  selector: 'app-applied-jobs',
  imports: [RouterModule, CommonModule, JobCardComponent, ButtonComponent],
  templateUrl: './applied-jobs.component.html',
  styleUrl: './applied-jobs.component.css',
})
export class AppliedJobsComponent implements OnInit {
  appliedJobs: (Application & { job: Job })[] = [];
  loading: boolean = true;
  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit() {
    const applications: Application[] = JSON.parse(
      localStorage.getItem('applications') || '[]'
    );
    if (applications.length > 0) {
      this.jobService.getJobs().subscribe(
        (jobs) => {
          this.appliedJobs = applications
            .map((app) => ({
              ...app,
              job: jobs.find((job) => job.id === app.jobId)!,
            }))
            .filter(
              (app): app is Application & { job: Job } => app.job !== undefined
            );
          this.loading = false;
        },
        () => {
          this.loading = false; // Handle error case
        }
      );
    } else {
      this.loading = false;
    }
  }

  goToJobs() {
    this.router.navigate(['/jobs']);
  }

  navigateToDetail(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }
}
