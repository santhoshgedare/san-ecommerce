import { Component, input } from '@angular/core';

import { AuthSession } from '@core/models/auth.models';
import { JoinPipe } from '@shared/pipes/join.pipe';
import { Avatar } from '@shared/components/avatar/avatar';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-profile-card',
  imports: [Avatar, JoinPipe, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
})
export class ProfileCard {
  readonly profile = input.required<AuthSession>();
}
