export interface IUser {
  email: string;
  name: string;
  googleId?: string;
  picture?: string;
  authProvider: string;
}
