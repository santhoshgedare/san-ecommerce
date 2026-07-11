export interface Role {
  id: string;
  name: string;
  description: string | null;
}

export interface CreateRoleRequest {
  name: string;
  description: string | null;
  permissions: string[];
}
