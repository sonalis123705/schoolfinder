import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-school-details',
  standalone: true,
  imports: [],
  templateUrl: './school-details.html',
  styleUrl: './school-details.css'
})
export class SchoolDetails implements OnInit {

  school = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    console.log('ID:', id);

    if (id) {

      this.http
        .get<any>(`http://localhost:3000/api/schools/${id}`)
        .subscribe({
          next: (data) => {

            console.log('API DATA:', data);

            this.school.set(data);

            console.log('SIGNAL DATA:', this.school());

          },

          error: (error) => {

            console.error('API ERROR:', error);

          }
        });

    }
  }
}