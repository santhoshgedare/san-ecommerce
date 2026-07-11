import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/authentication/auth';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ProfileCard } from '@shared/components/profile-card/profile-card';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, EmptyState, PageHeader, ProfileCard, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  readonly authService = inject(AuthService);
}
