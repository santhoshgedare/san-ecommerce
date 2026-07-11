import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-reset-password-dialog',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './reset-password-dialog.html',
  styleUrl: './reset-password-dialog.scss',
})
export class ResetPasswordDialog {
  readonly email = inject<string>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ResetPasswordDialog, boolean>);

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
