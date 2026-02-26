import { IRegisterStrategy } from "src/users/interfaces/IRegisterStrategy"
import { AuthResponseDTO } from "../dtos/auth-response-dto"
import { IAuthStrategy } from "./IAuthStrategy"

export interface IAuthService{
    login<T>(strategy: IAuthStrategy<T>, credentials: T): Promise<AuthResponseDTO>
    logout(rawToken: string) : Promise<void>
    refresh(rawRefreshToken: string, userId: string | number): Promise<AuthResponseDTO>
    register<T>(strategy: IRegisterStrategy<T>, credentials: T): Promise<AuthResponseDTO>;
}

