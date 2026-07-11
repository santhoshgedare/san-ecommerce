import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
})
export class ConfirmationDialog {
  readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialog, boolean>);

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
