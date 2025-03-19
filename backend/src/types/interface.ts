export interface IUser {
  email: string;
  name: string;
  googleId?: string;
  picture?: string;
  authProvider: string;
}

export interface LogoSettings {
  styles: {
    type: string;
    style: string;
  };
  colors: {
    type: string;
    color: string;
  };
  controls: {
    creativity: number;
    detail: number;
  };
}

export interface GenerationRequest {
  prompt: string;
  settings: LogoSettings;
  sketch: any;
  timestamp?: string;
}
