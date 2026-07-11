import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

export interface DeleteDialogData {
  itemName: string;
  itemType?: string;
}

@Component({
  selector: 'app-delete-dialog',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.scss',
})
export class DeleteDialog {
  readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteDialog, boolean>);

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
