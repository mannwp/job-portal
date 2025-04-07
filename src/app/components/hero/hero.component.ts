import { Component } from '@angular/core';
import { ButtonComponent } from '../ui/button/button.component';
import { FeaturedJobsComponent } from '../featured-jobs/featured-jobs.component';
import { CtaComponent } from '../cta/cta.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonComponent, FeaturedJobsComponent, CtaComponent],
  templateUrl: './hero.component.html',
})
export class HeroComponent {}
