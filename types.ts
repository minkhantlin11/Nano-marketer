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

export enum DesignSize {
  SQUARE = '1080x1080',
  PORTRAIT = '1080x1350',
  LANDSCAPE = '1200x630',
  STORY = '1080x1920',
  BANNER_WEB = '1920x600'
}

export interface DesignConfig {
  type: DesignType;
  subType: string;
  platform: Platform;
  size: DesignSize;
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