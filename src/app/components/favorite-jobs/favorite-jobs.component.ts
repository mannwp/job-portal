import { Component, OnInit } from '@angular/core';
import { Job } from '../../model/job.model';
import { JobService } from '../../services/job.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobCardComponent } from '../job-card/job-card.component';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-favorite-jobs',
  imports: [RouterModule, CommonModule, JobCardComponent, ButtonComponent],
  templateUrl: './favorite-jobs.component.html',
  styleUrl: './favorite-jobs.component.css',
})
export class FavoriteJobsComponent implements OnInit {
  favoriteJobs: Job[] = [];

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit() {
    const favoriteIds: string[] = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    this.jobService.getJobs().subscribe((jobs) => {
      this.favoriteJobs = jobs.filter((job) => favoriteIds.includes(job.id));
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.classList.add(`${savedTheme}-theme`);
  }

  removeFavorite(jobId: string) {
    const favoriteIds: string[] = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    const updatedFavorites = favoriteIds.filter((id) => id !== jobId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    this.favoriteJobs = this.favoriteJobs.filter((job) => job.id !== jobId);
  }

  applyForJob(jobId: string) {
    this.router.navigate(['/apply', jobId]);
  }

  goToJobs() {
    this.router.navigate(['/jobs']);
  }

  navigateToDetail(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }
}
