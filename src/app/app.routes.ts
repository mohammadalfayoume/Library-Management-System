import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {
    path: 'books',
    loadComponent: () => import('./features/books/books-page.component')
      .then(m => m.BooksPageComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories-page.component')
      .then(m => m.CategoriesPageComponent)
  }
];
