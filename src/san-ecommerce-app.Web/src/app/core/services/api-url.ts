import { Injectable } from '@angular/core';

import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class ApiUrlService {
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  auth(path = ''): string {
    return this.compose('Auth', path);
  }

  users(path = ''): string {
    return this.compose('Users', path);
  }

  roles(path = ''): string {
    return this.compose('Roles', path);
  }

  private compose(resource: string, path: string): string {
    const suffix = path ? `/${path.replace(/^\//, '')}` : '';
    return `${this.baseUrl}/${resource}${suffix}`;
  }
}
