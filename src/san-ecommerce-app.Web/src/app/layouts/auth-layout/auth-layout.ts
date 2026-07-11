import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
