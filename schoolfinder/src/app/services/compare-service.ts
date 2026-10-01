import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  selectedSchools: any[] = [];

  addSchool(school: any) {
    this.selectedSchools.push(school);
  }

  getSchools() {
    return this.selectedSchools;
  }

}