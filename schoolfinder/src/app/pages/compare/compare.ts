import { Component, OnInit } from '@angular/core';
import { CompareService } from '../../services/compare-service';

@Component({
  imports: [],
  selector: 'app-compare',
  styleUrl: './compare.css',
  templateUrl: './compare.html',
})
export class Compare implements OnInit{
  selectedSchools: any[] = [];
  constructor(private compareService: CompareService)
  {debugger
    console.log('COMPARE SERVICE:', this.compareService);

  }
ngOnInit() {

  const data = sessionStorage.getItem('compareSchools');

  if (data) {
    this.selectedSchools = JSON.parse(data);
  }

  console.log('Compare Page Schools:', this.selectedSchools);
}
}
