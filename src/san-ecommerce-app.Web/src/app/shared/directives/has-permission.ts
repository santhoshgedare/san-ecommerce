import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { PermissionService } from '@core/authorization/permission';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  readonly appHasPermission = input<string | string[]>('');
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);

  constructor() {
    effect(() => {
      const requested = this.appHasPermission();
      const permissions = Array.isArray(requested) ? requested : [requested].filter(Boolean);
      const canShow = permissions.length === 0 || this.permissionService.hasAny(permissions);
      this.viewContainerRef.clear();
      if (canShow) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
