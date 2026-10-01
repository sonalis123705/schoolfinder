import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home')
        .then(m => m.Home)
  },

  {
    path: 'schools',
    loadComponent: () =>
      import('./pages/school-list/school-list')
        .then(m => m.SchoolList)
  },
  {
  path: 'schools/:id',
  loadComponent: () =>
    import('./pages/school-details/school-details')
      .then(m => m.SchoolDetails)
},

{
  path: 'compare',
  loadComponent: () =>
    import('./pages/compare/compare')
      .then(m => m.Compare)
}
];