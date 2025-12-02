import { DesignType, Platform, DesignSize } from './types';

export const DESIGN_OPTIONS = [
  {
    id: DesignType.ADS,
    title: 'Ads',
    description: 'High-conversion ads (Discount, Storytelling, etc).',
    icon: '📢',
    subTypes: ['Discount Ads', 'Storytelling Ads', 'Facebook Ads', 'Instagram Ads']
  },
  {
    id: DesignType.FLYER,
    title: 'Flyer',
    description: 'Promotional flyers with pricing details.',
    icon: '📄',
    subTypes: ['Product Flyer', 'Event Flyer', 'Sales Sheet']
  },
  {
    id: DesignType.BANNER,
    title: 'Banner',
    description: 'Website headers and social covers.',
    icon: '🖼️',
    subTypes: ['Website Banner', 'Facebook Cover', 'Instagram Story Banner']
  }
];

export const PLATFORM_OPTIONS = Object.values(Platform);

export const SIZE_OPTIONS = [
  { id: DesignSize.SQUARE, label: 'Square (1:1)', dim: '1080x1080' },
  { id: DesignSize.PORTRAIT, label: 'Portrait (4:5)', dim: '1080x1350' },
  { id: DesignSize.LANDSCAPE, label: 'Landscape (1.91:1)', dim: '1200x630' },
  { id: DesignSize.STORY, label: 'Story (9:16)', dim: '1080x1920' },
  { id: DesignSize.BANNER_WEB, label: 'Wide Banner', dim: '1920x600' },
];