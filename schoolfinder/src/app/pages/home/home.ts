import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  constructor(private router: Router)
  {

  }
    selectedCity = '';
  selectedBoard = '';
  searchText = '';

  // searchSchools() {
  //   console.log('City:', this.selectedCity);
  //   console.log('Board:', this.selectedBoard);
  //   console.log('Search:', this.searchText);
  // }

   searchSchools() {

    this.router.navigate(['/schools'], {
      queryParams: {
        city: this.selectedCity,
        board: this.selectedBoard,
        search: this.searchText
      }
    });

  }
}
