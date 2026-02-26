export interface IRefreshTokenService{
    createRefreshToken(userId: string | number, ttlSeconds: number) : Promise<string>
    deleteRefreshToken(rawToken: string) : Promise<void>
    verifyRefreshToken(rawToken: string) : Promise <boolean>
    refreshRefreshToken(rawToken: string, userId: number | string, ttlSeconds: number) : Promise<string>
    getIdFromRefreshToken(rawToken: string) : Promise <string | number>
}

export interface IAccessTokenService {
  createAccessToken(userId: string | number, ttlSeconds: number): Promise<string>;
  verifyAccessToken(rawToken: string): Promise<boolean>;
  getIdFromAccessToken(rawToken: string): Promise<string | number>;
}