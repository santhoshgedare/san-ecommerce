import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.scss',
})
export class Unauthorized {}
