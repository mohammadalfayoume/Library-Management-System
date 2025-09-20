import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { finalize } from 'rxjs/operators';
import { BookService } from '../../core/services/book.service';
import { BookBriefDto } from '../../shared/models/book.model';
import { BookFormDialogComponent } from './book-form-dialog.component';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { SuccessHandlerService } from '../../core/services/success-handler.service';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.css']
})
export class BooksPageComponent implements OnInit {
  books: BookBriefDto[] = [];
  totalItems: number = 0;
  pageNumber: number = 0;
  pageSize: number = 0;
  displayedColumns: string[] = ['id', 'name', 'categories', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<BookBriefDto>;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private errorHandlerService: ErrorHandlerService,
    private successHandlerService: SuccessHandlerService,
    public loadingService: LoadingService
  ) {}


  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(page: number = 1, pageSize: number = 10): void {
    this.loadingService.show();
    this.bookService.getAllPaged(page, pageSize)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(response => {
        this.books = response.items;
        this.totalItems = response.totalCount;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBooks(this.paginator.pageIndex+1, this.paginator.pageSize);
      }
    });
  }

  openEditDialog(book: BookBriefDto): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', book }
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        this.loadBooks(this.paginator.pageIndex + 1, this.paginator.pageSize);
      }
    });
  }

  deleteBook(book: BookBriefDto): void {
    if (confirm(`Are you sure you want to delete book "${book.name}"?`)) {
        this.loadingService.show();
        this.bookService.delete(book.id)
          .pipe(finalize(() => this.loadingService.hide()))
          .subscribe({
            next: (res) => {
                this.successHandlerService.handleSuccess('Book deleted successfully')
                this.loadBooks(this.paginator.pageIndex, this.paginator.pageSize);
            },
            error: (err) => {
                this.errorHandlerService.handleError(err);
            }
        });
    }
  }
}