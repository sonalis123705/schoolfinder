import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompareService } from '../../services/compare-service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './compare.html',
  styleUrl: './compare.css'
})
export class Compare implements OnInit {

  selectedSchools: any[] = [];

  constructor(
    private compareService: CompareService
  ) {}

  ngOnInit(): void {

    // First check service
    this.selectedSchools =
      this.compareService.getSchools();

    // If service is empty, get data from sessionStorage
    if (this.selectedSchools.length === 0) {

      const savedSchools =
        sessionStorage.getItem('compareSchools');

      if (savedSchools) {

        this.selectedSchools =
          JSON.parse(savedSchools);

        // Put data back into service
        this.selectedSchools.forEach(school => {
          this.compareService.addSchool(school);
        });

      }

    }

    console.log(
      'Compare Page Schools:',
      this.selectedSchools
    );

  }

  removeSchool(schoolId: number): void {debugger

  this.selectedSchools =
    this.selectedSchools.filter(
      school => school.id !== schoolId
    );

  // Update service
  this.compareService.clearSchools();

  this.selectedSchools.forEach(school => {
    this.compareService.addSchool(school);
  });

  // Update sessionStorage
  sessionStorage.setItem(
    'compareSchools',
    JSON.stringify(this.selectedSchools)
  );

}

}