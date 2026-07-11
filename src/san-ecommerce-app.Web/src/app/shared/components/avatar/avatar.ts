import { Component, computed, input } from '@angular/core';

import { SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-avatar',
  imports: [SHARED_IMPORTS],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null>(null);
  readonly initials = computed(() =>
    this.name()
      .split(' ')
      .filter(Boolean)
      .map((segment) => segment[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join(''),
  );
}
