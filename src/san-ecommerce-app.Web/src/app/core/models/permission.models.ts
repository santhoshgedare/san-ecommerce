export interface PermissionDefinition {
  key: string;
  labelKey: string;
  descriptionKey: string;
  group: string;
}

export interface PermissionGroup {
  key: string;
  labelKey: string;
  permissions: PermissionDefinition[];
}
