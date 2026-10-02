import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
imports: [FormsModule, RouterLink],
selector: 'app-home',
styleUrl: './home.css',
templateUrl: './home.html',
})
export class Home implements OnInit {
user: any = null;
selectedCity = '';
selectedBoard = '';
searchText = '';

// Backend URL
//apiUrl = 'http://localhost:3000';
apiUrl='https://schoolfinder-3moq.vercel.app'

// City and Board data
cities: string[] = [];
boards: string[] = [];

// Mobile menu
menuOpen = false;

constructor(
private router: Router,
private http: HttpClient
) {}

ngOnInit(): void {
this.getCities();
this.getBoards();
 const userData = localStorage.getItem('user');

  if (userData) {
    this.user = JSON.parse(userData);
  }
}

// Get cities from backend
getCities() {


this.http
  .get<string[]>(`${this.apiUrl}/api/cities`)
  .subscribe(data => {

    console.log('HOME CITIES:', data);

    this.cities = data;

  });


}

// Get boards from backend
getBoards() {


this.http
  .get<string[]>(`${this.apiUrl}/api/boards`)
  .subscribe(data => {

    console.log('HOME BOARDS:', data);

    this.boards = data;

  });


}

// Search schools
searchSchools() {


console.log('City:', this.selectedCity);
console.log('Board:', this.selectedBoard);
console.log('Search:', this.searchText);

this.router.navigate(['/schools'], {

  queryParams: {
    city: this.selectedCity,
    board: this.selectedBoard,
    search: this.searchText
  }

});




}

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  this.user = null;

  this.router.navigate(['/login']);
}

}
