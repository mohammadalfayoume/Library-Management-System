import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../core/services/category.service';
import { CategoryBriefDto, CategoryCreateDto, CategoryUpdateDto } from '../../shared/models/category.model';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { SuccessHandlerService } from '../../core/services/success-handler.service';

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.css']
})
export class CategoryFormDialogComponent {
  categoryForm: FormGroup;
  dialogTitle: string;
  submitButtonText: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private errorHandlerService: ErrorHandlerService,
    private successHandlerService: SuccessHandlerService,
    public loadingService: LoadingService,
    private dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: 'create' | 'edit';
      category?: CategoryBriefDto;
    }
  ) {
    this.dialogTitle = data.mode === 'create' ? 'Create Category' : 'Edit Category';
    this.submitButtonText = data.mode === 'create' ? 'Create' : 'Update';

    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(250)]]
    });

    if (data.mode === 'edit' && data.category) {
      this.categoryForm.patchValue({
        name: data.category.name
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      this.loadingService.show();

      if (this.data.mode === 'create') {
        const createDto: CategoryCreateDto = {
          name: formValue.name
        };

        this.categoryService.create(createDto)
          .pipe(finalize(() => this.loadingService.hide()))
          .subscribe({
            next: (resp) => {
                this.successHandlerService.handleSuccess('Category created successfully');
                this.dialogRef.close(resp);
            },
            error: (err) => {
                this.errorHandlerService.handleError(err);
            }
          });
      } else if (this.data.mode === 'edit' && this.data.category) {
        const updateDto: CategoryUpdateDto = {
          id: this.data.category.id,
          name: formValue.name
        };

        this.categoryService.update(updateDto)
          .pipe(finalize(() => this.loadingService.hide()))
          .subscribe({
            next: (resp) => {
                this.successHandlerService.handleSuccess('Category updated successfully');
                this.dialogRef.close('updated');
            },
            error: (err) => {
                this.errorHandlerService.handleError(err);
            }
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
