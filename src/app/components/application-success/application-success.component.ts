import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-success',
  imports: [],
  templateUrl: './application-success.component.html',
  styleUrl: './application-success.component.css',
})
export class ApplicationSuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.add(`${savedTheme}-theme`);
    }
  }

  goToJobs() {
    this.router.navigate(['/jobs']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
