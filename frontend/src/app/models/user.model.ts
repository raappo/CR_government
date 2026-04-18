export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  contactNumber: string;
  address: string;
  department?: string;
  token?: string;
}
