export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface CreateRoleRequest {
  name: string;
  description: string | null;
  permissions: string[];
}

export type UpdateRoleRequest = CreateRoleRequest;
