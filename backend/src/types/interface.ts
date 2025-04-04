export interface IUser {
  email: string;
  name: string;
  googleId?: string;
  picture?: string;
  authProvider: string;
}

export interface LogoSettings {
  styles: {
    enabled: boolean;
    type: string;
    style: string;
  };
  colors: {
    enabled: boolean;
    type: string;
    color: string | string[];
  };
  controls: {
    enabled: boolean;
    creativity: number;
    detail: number;
  };
  text: {
    enabled: boolean;
    value: string;
  };
  tagline: {
    enabled: boolean;
    value: string;
  };
  background: {
    enabled: boolean;
    type: string;
    color: string | string[];
  };
}

export interface GenerationRequest {
  prompt: string;
  settings: LogoSettings;
  sketch: any;
  timestamp?: string;
}
