import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

export interface AssignRolesDialogData {
  availableRoles: string[];
  selectedRoles: string[];
}

@Component({
  selector: 'app-assign-roles-dialog',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './assign-roles-dialog.html',
  styleUrl: './assign-roles-dialog.scss',
})
export class AssignRolesDialog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AssignRolesDialog, string[]>);
  readonly data = inject<AssignRolesDialogData>(MAT_DIALOG_DATA);
  readonly form = this.formBuilder.nonNullable.group({
    roles: [this.data.selectedRoles],
  });

  save(): void {
    this.dialogRef.close(this.form.controls.roles.value);
  }
}
