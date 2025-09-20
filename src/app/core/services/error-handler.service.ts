import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  public handleError(err: any) {
    // Case 1: Validation errors (errors object with arrays of messages)
    if (err.error.errors) {
      const validationErrors = err.error.errors;
      for (const key in validationErrors) {
        if (validationErrors.hasOwnProperty(key)) {
          for (const message of validationErrors[key]) {
            this.openSnackBar(message);
          }
        }
      }
    }
    // Case 2: Application or server errors (detail property)
    else if (err.error.detail) {
      this.openSnackBar(err.error.detail);
    }
    // Fallback
    else {
      this.openSnackBar('Unexpected error occurred');
    }
  }
}
