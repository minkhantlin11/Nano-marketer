export enum DesignType {
  ADS = 'ADS',
  FLYER = 'FLYER',
  BANNER = 'BANNER'
}

export enum Platform {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  WEBSITE = 'Website',
  BOTH = 'Facebook & Instagram'
}

export interface DesignConfig {
  type: DesignType;
  platform: Platform;
  productPrice?: string;
  customPrompt: string;
}

export interface UploadedFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
  promptUsed: string;
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  RESULT = 'RESULT'
}
