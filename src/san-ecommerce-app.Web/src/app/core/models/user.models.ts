export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  employeeCode: string | null;
  department: string | null;
  profileImage: string | null;
  isActive: boolean;
  createdOn: string;
  roles: string[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  employeeCode: string | null;
  department: string | null;
  phoneNumber: string | null;
  roles: string[];
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  employeeCode: string | null;
  department: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  isActive: boolean;
}
