export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: number;
}

export interface GetUser {
  id: number;
  username: string;
  email: string;
}

export interface Role{
  id: number;
  name: string;
}

export interface UserRole {
  user_id: number;
  role_id: number;
}
