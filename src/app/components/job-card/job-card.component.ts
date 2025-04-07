import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../model/job.model';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../ui/button/button.component';
@Component({
  selector: 'app-job-card',
  imports: [RouterModule, ButtonComponent, CommonModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css',
})
export class JobCardComponent {
  @Input() job!: Job;
  @Input() displayLogo: boolean = true;
  @Input() displayDetails: boolean = true;
  @Input() displayDescription: boolean = true;
  @Input() displaySalary: boolean = true;
  @Input() showFavorite: boolean = true;
  @Input() showActions: boolean = true;
  @Output() favorite = new EventEmitter<string>();
  @Output() apply = new EventEmitter<void>();
  @Output() cardClick = new EventEmitter<string>();
  get isFavorite(): boolean {
    return JSON.parse(localStorage.getItem('favorites') || '[]').includes(
      this.job.id
    );
  }

  get isApplied(): boolean {
    const applied = JSON.parse(localStorage.getItem('applications') || '[]');
    return applied.some((app: any) => app.jobId === this.job.id);
  }
  onCardClick(event: MouseEvent) {
    // Prevent navigation if clicking on buttons
    if (!(event.target as HTMLElement).closest('button')) {
      this.cardClick.emit(this.job.id);
    }
  }
  toggleFavorite() {
    this.favorite.emit(this.job.id);
  }

  applyForJob() {
    if (!this.isApplied) {
      this.apply.emit();
    }
  }
}
