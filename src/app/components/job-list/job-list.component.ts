import { Component, OnInit } from '@angular/core';
import { Job } from '../../model/job.model';
import { JobService } from '../../services/job.service';
import { JobCardComponent } from '../job-card/job-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-job-list',
  imports: [
    JobCardComponent,
    FormsModule,
    CommonModule,
    RouterModule,
    ButtonComponent,
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css',
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  paginatedJobs: Job[] = [];
  favorites: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
  appliedJobs: string[] = JSON.parse(
    localStorage.getItem('applications') || '[]'
  ).map((app: any) => app.jobId);

  selectedCategory = '';
  selectedLocation = '';
  selectedExperience = '';
  searchQuery = '';

  categories: string[] = [];
  locations: string[] = [];
  experiences: string[] = [];

  currentPage = 1;
  pageSize = 6;

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit() {
    this.jobService.getJobs().subscribe((jobs) => {
      this.jobs = jobs;
      this.categories = [...new Set(jobs.map((job) => job.category))];
      this.locations = [...new Set(jobs.map((job) => job.location))];
      this.experiences = [...new Set(jobs.map((job) => job.experience))];
      this.applyFilters();
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.classList.add(`${savedTheme}-theme`);
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(
      (job) =>
        (!this.selectedCategory || job.category === this.selectedCategory) &&
        (!this.selectedLocation || job.location === this.selectedLocation) &&
        (!this.selectedExperience ||
          job.experience === this.selectedExperience) &&
        (!this.searchQuery ||
          job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedJobs = this.filteredJobs.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredJobs.length / this.pageSize);
  }

  changePage(delta: number) {
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePagination();
    }
  }

  toggleFavorite(jobId: string) {
    const index = this.favorites.indexOf(jobId);
    if (index === -1) {
      this.favorites.push(jobId);
    } else {
      this.favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.applyFilters(); // Refresh to update UI
  }

  applyForJob(jobId: string) {
    this.router.navigate(['/apply', jobId]);
  }

  navigateToDetail(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }
}
