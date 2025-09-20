import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BookService } from '../../core/services/book.service';
import { CategoryService } from '../../core/services/category.service';
import {
  BookBriefDto,
  BookCreateDto,
  BookUpdateDto,
} from '../../shared/models/book.model';
import { CategoryBriefDto } from '../../shared/models/category.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { SuccessHandlerService } from '../../core/services/success-handler.service';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-book-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './book-form-dialog.component.html',
  styleUrls: ['./book-form-dialog.component.css'],
})
export class BookFormDialogComponent {
  bookForm: FormGroup;
  dialogTitle: string;
  submitButtonText: string;
  categories: CategoryBriefDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private errorHandlerService: ErrorHandlerService,
    private successHandlerService: SuccessHandlerService,
    public loadingService: LoadingService,
    private dialogRef: MatDialogRef<BookFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      book?: BookBriefDto;
    }
  ) {
    this.dialogTitle = data.mode === 'create' ? 'Create Book' : 'Edit Book';
    this.submitButtonText = data.mode === 'create' ? 'Create' : 'Update';

    this.bookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(250)]],
      categoryIds: [[], Validators.required],
    });

    this.loadCategories();

    if (data.mode === 'edit' && data.book) {
      this.bookForm.patchValue({
        name: data.book.name,
        categoryIds: data.book.bookCategories.map((c) => c.id),
      });
    }
  }

  private loadCategories(): void {
    this.loadingService.show();
    this.categoryService.getAll()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((response) => {
        this.categories = response;
      });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      if (this.data.mode === 'create') {
        const createDto: BookCreateDto = {
          name: formValue.name,
          categoryIds: formValue.categoryIds,
        };

        this.loadingService.show();
        this.bookService.create(createDto)
          .pipe(finalize(() => this.loadingService.hide()))
          .subscribe({
            next: (resp) => {
                this.successHandlerService.handleSuccess('Book created successfully');
                this.dialogRef.close(resp);
            },
            error: (err) => {
                this.errorHandlerService.handleError(err);
            }
          })
      } else if (this.data.mode === 'edit' && this.data.book) {
        const updateDto: BookUpdateDto = {
          id: this.data.book.id,
          name: formValue.name,
          categoryIds: formValue.categoryIds,
        };
        this.loadingService.show();
        this.bookService.update(updateDto)
          .pipe(finalize(() => this.loadingService.hide()))
          .subscribe({
          next: (res) => {
            this.successHandlerService.handleSuccess('Book updated successfully');
            this.loadCategories();
            this.dialogRef.close('updated');
          },
          error: (err) => {
            this.errorHandlerService.handleError(err);
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  
}
