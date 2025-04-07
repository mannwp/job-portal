import { Injectable } from '@angular/core';
import { Job } from '../model/job.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private jobsUrl = 'assets/data.json';
  constructor(private http: HttpClient) {}
  getJobs(): Observable<Job[]> {
    console.log('Fetching jobs from:', this.jobsUrl);
    return this.http.get<Job[]>(this.jobsUrl);
  }

  getJobById(id: string): Observable<Job | undefined> {
    return this.http
      .get<Job[]>(this.jobsUrl)
      .pipe(map((jobs) => jobs.find((job) => job.id === id)));
  }
}
