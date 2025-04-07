import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobCardComponent } from '../job-card/job-card.component';
import { Job } from '../../model/job.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, JobCardComponent],
  templateUrl: './featured-jobs.component.html',
})
export class FeaturedJobsComponent {
  featuredJobs: Job[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      category: 'Development',
      experience: 'Mid Level',
      salary: '$80,000 - $100,000',
      description:
        'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing web applications.',
      responsibilities: [],
      requirements: [],
      postedDate: 'May 15, 2023',
      logo: '/placeholder.svg?height=80&width=80',
    },
    {
      id: '2',
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'San Francisco',
      category: 'Design',
      experience: 'Senior Level',
      salary: '$110,000 - $130,000',
      description:
        "We're seeking a talented UX Designer to create amazing user experiences. The ideal candidate should have a strong portfolio.",
      responsibilities: [],
      requirements: [],
      postedDate: 'May 10, 2023',
      logo: '/placeholder.svg?height=80&width=80',
    },
    {
      id: '3',
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'New York',
      category: 'Marketing',
      experience: 'Senior Level',
      salary: '$90,000 - $120,000',
      description:
        'We are looking for a Marketing Manager to lead our marketing efforts and drive brand awareness and growth.',
      responsibilities: [],
      requirements: [],
      postedDate: 'May 5, 2023',
      logo: '/placeholder.svg?height=80&width=80',
    },
  ];

  constructor(private router: Router) {}

  toggleFavorite(jobId: string) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(jobId);

    if (index === -1) {
      favorites.push(jobId);
    } else {
      favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  navigateToDetail(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }

  applyForJob(jobId: string) {
    this.router.navigate(['/apply', jobId]);
  }
}
