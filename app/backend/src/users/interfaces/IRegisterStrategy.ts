import { User } from "generated/client";

export interface IRegisterStrategy<T> {
  register(credentials: T): Promise<User>;
}