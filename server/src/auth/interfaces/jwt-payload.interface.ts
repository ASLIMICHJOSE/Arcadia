export interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  tv?: number;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
  emailVerified: boolean;
}
