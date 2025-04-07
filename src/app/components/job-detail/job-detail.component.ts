import { Component, OnInit } from '@angular/core';
import { Job } from '../../model/job.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../ui/button/button.component';
import { JobCardComponent } from '../job-card/job-card.component';

@Component({
  selector: 'app-job-detail',
  imports: [CommonModule, ButtonComponent, JobCardComponent, RouterModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css',
})
export class JobDetailComponent implements OnInit {
  job: Job | undefined;
  isFavorite: boolean = false;
  currentUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.currentUrl = window.location.href;
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.jobService.getJobById(jobId).subscribe({
        next: (job) => {
          this.job = job;
          this.isFavorite = JSON.parse(
            localStorage.getItem('favorites') || '[]'
          ).includes(jobId);
          if (!job) {
            console.error(`Job with ID ${jobId} not found`);
            this.router.navigate(['/jobs']);
          }
        },
        error: (err) => {
          console.error('Error fetching job:', err);
          this.router.navigate(['/jobs']);
        },
      });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.classList.add(`${savedTheme}-theme`);
  }

  goBack() {
    this.router.navigate(['/jobs']);
  }

  applyForJob() {
    if (this.job) {
      this.router.navigate(['/apply', this.job.id]);
    }
  }

  toggleFavorite(jobId: string) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(jobId);
    if (index === -1) {
      favorites.push(jobId);
      this.isFavorite = true;
    } else {
      favorites.splice(index, 1);
      this.isFavorite = false;
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.currentUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  }
}
