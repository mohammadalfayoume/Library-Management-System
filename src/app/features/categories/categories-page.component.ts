import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { CategoryService } from '../../core/services/category.service';
import { CategoryBriefDto } from '../../shared/models/category.model';
import { CategoryFormDialogComponent } from './category-form-dialog.component';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { SuccessHandlerService } from '../../core/services/success-handler.service';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {
  categories: CategoryBriefDto[] = [];
  totalItems: number = 0;
  pageNumber: number = 0;
  pageSize: number = 0;
  displayedColumns: string[] = ['id', 'name', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<CategoryBriefDto>;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private errorHandlerService: ErrorHandlerService,
    private successHandlerService: SuccessHandlerService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = 1, pageSize: number = 10): void {
    this.loadingService.show();
    this.categoryService.getAllPaged(page, pageSize)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(response => {
        this.categories = response.items;
        this.totalItems = response.totalCount;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '400px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories(this.paginator.pageIndex + 1, this.paginator.pageSize);
      }
    });
  }

  openEditDialog(category: CategoryBriefDto): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '400px',
      data: { mode: 'edit', category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories(this.paginator.pageIndex + 1, this.paginator.pageSize);
      }
    });
  }

  deleteCategory(category: CategoryBriefDto): void {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
        this.loadingService.show();
        this.categoryService.delete(category.id)
          .pipe(finalize(() => this.loadingService.hide()))
          .subscribe({
            next: (res) => {
                this.successHandlerService.handleSuccess('Category deleted successfully')
                this.loadCategories(this.paginator.pageIndex + 1, this.paginator.pageSize);
            },
            error: (err) => {
                this.errorHandlerService.handleError(err);
            }
        })
    }
  }
}