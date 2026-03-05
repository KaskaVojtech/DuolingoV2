export interface LoginEmailPayload {
  email: string;
  password: string;
}

export interface LoginCodePayload {
  code: string;
}

export interface RegisterEmailPayload {
  email: string;
  password: string;
}

export interface RegisterCodePayload {}

export type AuthMode = 'email' | 'code';
export type RegisterMode = 'email' | 'code';
