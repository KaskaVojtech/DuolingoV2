import { User } from "generated/client";

export interface IAuthStrategy<T> {
  authenticate(credentials: T): Promise<User>;
}



