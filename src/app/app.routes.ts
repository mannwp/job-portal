import { Routes } from '@angular/router';
import { JobListComponent } from './components/job-list/job-list.component';
import { HeroComponent } from './components/hero/hero.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { JobApplyComponent } from './components/job-apply/job-apply.component';
import { ApplicationSuccessComponent } from './components/application-success/application-success.component';
import { FavoriteJobsComponent } from './components/favorite-jobs/favorite-jobs.component';
import { AppliedJobsComponent } from './components/applied-jobs/applied-jobs.component';
export const routes: Routes = [
  { path: 'jobs', component: JobListComponent },
  { path: '', component: HeroComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'apply/:id', component: JobApplyComponent },
  { path: 'applied', component: ApplicationSuccessComponent },
  { path: 'favorites', component: FavoriteJobsComponent },
  { path: 'applications', component: AppliedJobsComponent },
];
