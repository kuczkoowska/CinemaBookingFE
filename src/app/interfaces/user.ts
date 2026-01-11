export interface UserRole {
  readonly id: number;
  readonly name: string;
}

export interface User {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly isActive: boolean;
  readonly roles: UserRole[];
}
