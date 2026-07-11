import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Injectable, inject, signal } from '@angular/core';
import { filter, startWith } from 'rxjs';

import { BreadcrumbItem } from '@core/models/navigation.models';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly breadcrumbs = signal<BreadcrumbItem[]>([]);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), startWith(null))
      .subscribe(() => this.breadcrumbs.set(this.build(this.route.root)));
  }

  private build(route: ActivatedRoute, url = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    for (const child of route.children) {
      const routeUrl = child.snapshot.url.map((segment) => segment.path).join('/');
      const nextUrl = routeUrl ? `${url}/${routeUrl}` : url;
      const label = child.snapshot.data['breadcrumb'] as string | undefined;

      const nextBreadcrumbs = label
        ? [...breadcrumbs, { label, route: nextUrl || '/' }]
        : breadcrumbs;

      return this.build(child, nextUrl, nextBreadcrumbs);
    }

    return breadcrumbs;
  }
}
