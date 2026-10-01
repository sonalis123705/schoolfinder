import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { CompareService } from '../../services/compare-service';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [FormsModule, RouterLink,CommonModule],
  templateUrl: './school-list.html',
  styleUrl: './school-list.css'
})
export class SchoolList implements OnInit {
  selectedSchools: any[] = [];

  constructor(private route: ActivatedRoute,private http: HttpClient,private compareService: CompareService, private router: Router) {
    this.route.queryParams.subscribe(params => {

      this.searchText = params['search'] || '';
      this.selectedCity = params['city'] || '';
      this.selectedBoard = params['board'] || '';
       this.getSchools();

    });
   
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  searchText = '';
  
  selectedCity = '';
  selectedBoard = '';
  // apiUrl = 'http://localhost:3000/api/schools';
  apiUrl="https://schoolfinder-3moq.vercel.app/api/schools"

 schools: any[] = [];


//  getSchools() {debugger
//   this.http.get<any[]>(this.apiUrl).subscribe(data => {
//     this.schools = data;
//   });
// }

getSchools() {debugger
  this.http.get<any[]>(this.apiUrl).subscribe(data => {

    console.log('API DATA:', data);

    this.schools = data;

     console.log('SCHOOLS LENGTH:', this.schools.length);
    console.log('FILTERED LENGTH:', this.filteredSchools.length);

  });
}

  get filteredSchools() {

    return this.schools.filter(school => {

      const searchMatch =
        !this.searchText ||
        school.name.toLowerCase().includes(
          this.searchText.toLowerCase()
        ) ||
        school.location.toLowerCase().includes(
          this.searchText.toLowerCase()
        );

      const cityMatch =
        !this.selectedCity ||
        school.city === this.selectedCity;

      const boardMatch =
        !this.selectedBoard ||
        school.board === this.selectedBoard;

      return searchMatch && cityMatch && boardMatch;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.selectedCity = '';
    this.selectedBoard = '';
  }

addToCompare(school: any) {debugger

  if (this.selectedSchools.length >= 2) {
    alert('You can compare only 2 schools at a time.');
    return;
  }

  const alreadySelected = this.selectedSchools.some(
    item => item.id === school.id
  );

  if (alreadySelected) {
    alert('School already selected.');
    return;
  }

  this.selectedSchools.push(school);

  this.compareService.addSchool(school);
  sessionStorage.setItem(
  'compareSchools',
  JSON.stringify(this.compareService.getSchools())
);
  

  console.log('Selected schools:', this.selectedSchools);
  if (this.compareService.getSchools().length === 2) {
  this.router.navigate(['/compare']);
}
}



}