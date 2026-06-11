export interface JwtPayload {
  sub: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}
