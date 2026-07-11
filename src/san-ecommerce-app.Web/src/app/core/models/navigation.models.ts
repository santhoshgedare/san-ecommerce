export interface NavigationItem {
  labelKey: string;
  route: string;
  icon: string;
  roles?: string[];
  permissions?: string[];
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  route: string;
}
