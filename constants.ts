import { DesignType, Platform } from './types';

export const DESIGN_OPTIONS = [
  {
    id: DesignType.ADS,
    title: 'Ad Creative',
    description: 'High-conversion ads for social media.',
    icon: '📢'
  },
  {
    id: DesignType.FLYER,
    title: 'Product Flyer',
    description: 'Promotional flyers with pricing details.',
    icon: '📄'
  },
  {
    id: DesignType.BANNER,
    title: 'Web Banner',
    description: 'Headers, covers, and website assets.',
    icon: '🖼️'
  }
];

export const PLATFORM_OPTIONS = Object.values(Platform);
