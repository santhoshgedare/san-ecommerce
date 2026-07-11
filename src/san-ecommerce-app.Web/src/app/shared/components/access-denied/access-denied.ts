import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-access-denied',
  imports: [RouterLink, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.scss',
})
export class AccessDenied {}
