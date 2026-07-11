import { Component, DestroyRef, inject, output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

export interface UserFiltersValue {
  search: string;
  status: string;
  department: string;
}

@Component({
  selector: 'app-user-filters',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './user-filters.html',
  styleUrl: './user-filters.scss',
})
export class UserFilters {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  readonly filtersChanged = output<UserFiltersValue>();
  readonly form = this.formBuilder.nonNullable.group({
    search: [''],
    status: ['all'],
    department: ['all'],
  });
  readonly departments = ['all', 'Operations', 'Sales', 'Support', 'Finance', 'Marketing'];

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.filtersChanged.emit({
        search: value.search ?? '',
        status: value.status ?? 'all',
        department: value.department ?? 'all',
      });
    });
  }
}
