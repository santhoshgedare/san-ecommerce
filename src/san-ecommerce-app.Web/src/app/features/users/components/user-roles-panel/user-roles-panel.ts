import { Component, input } from '@angular/core';

import { JoinPipe } from '@shared/pipes/join.pipe';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-user-roles-panel',
  imports: [JoinPipe, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './user-roles-panel.html',
  styleUrl: './user-roles-panel.scss',
})
export class UserRolesPanel {
  readonly roles = input<string[]>([]);
}
