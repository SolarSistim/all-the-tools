export interface PlatformConfig {
  id: PlatformId;
  name: string;
  charLimit: number;
  urlCharsCountedAs: 'actual' | number;
  hashtagRecommendation: { min: number; max: number };
  tone: 'professional' | 'casual' | 'engaging' | 'mixed';
  imageSize: string;
  icon: string;
  color: string;
  homeUrl: string;
}

export type PlatformId =
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'pinterest'
  | 'reddit'
  | 'threads'
  | 'mastodon'
  | 'bluesky'
  | 'tumblr'
  | 'truthsocial'
  | 'gab'
  | 'parler'
  | 'gettr'
  | 'lemmy'
  | 'digg'
  | 'fourchan'
  | 'medium'
  | 'substack'
  | 'blogger'
  | 'ghost'
  | 'livejournal'
  | 'dreamwidth';

export interface ContentData {
  url: string;
  description: string;
  hashtags: string[];
  ogData: OGData | null;
  selectedPlatforms: PlatformId[];
  lastModified: string;
}

export interface OGData {
  title: string;
  description: string;
  image: string;
  imageDimensions?: { width: number; height: number };
  siteName?: string;
  type?: string;
  url: string;
}

export interface ContentVariation {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
  createdAt: string;
}

export interface UserPreferences {
  defaultPlatforms: PlatformId[];
  lowercaseHashtags: boolean;
  theme: 'light' | 'dark';
}

export interface PlatformStatus {
  platform: PlatformId;
  characterCount: number;
  isOverLimit: boolean;
  hashtagWarning: boolean;
  percentage: number;
}

export interface OGFetchResponse {
  success: boolean;
  data?: OGData;
  error?: string;
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
  retryAfter?: number;
}

export const PLATFORM_CONFIGS: Record<PlatformId, PlatformConfig> = {
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    charLimit: 280,
    urlCharsCountedAs: 23,
    hashtagRecommendation: { min: 1, max: 3 },
    tone: 'casual',
    imageSize: '1200×675 (16:9)',
    icon: 'close',
    color: '#000000',
    homeUrl: 'https://x.com'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    charLimit: 63206,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 3 },
    tone: 'mixed',
    imageSize: '1200×630 (1.91:1)',
    icon: 'facebook',
    color: '#1877F2',
    homeUrl: 'https://facebook.com'
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    charLimit: 500,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 5 },
    tone: 'casual',
    imageSize: '1080×1080 (1:1)',
    icon: 'alternate_email',
    color: '#000000',
    homeUrl: 'https://threads.net'
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    charLimit: 3000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 3, max: 5 },
    tone: 'professional',
    imageSize: '1200×627 (1.91:1)',
    icon: 'work',
    color: '#0A66C2',
    homeUrl: 'https://linkedin.com'
  },
  tumblr: {
    id: 'tumblr',
    name: 'Tumblr',
    charLimit: 4096,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 5, max: 30 },
    tone: 'casual',
    imageSize: '1280×1920',
    icon: 'auto_stories',
    color: '#35465C',
    homeUrl: 'https://tumblr.com'
  },
  mastodon: {
    id: 'mastodon',
    name: 'Mastodon',
    charLimit: 500,
    urlCharsCountedAs: 23,
    hashtagRecommendation: { min: 1, max: 5 },
    tone: 'mixed',
    imageSize: '1200×675',
    icon: 'public',
    color: '#6364FF',
    homeUrl: 'https://mastodon.social'
  },
  bluesky: {
    id: 'bluesky',
    name: 'Bluesky',
    charLimit: 300,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 3 },
    tone: 'casual',
    imageSize: '1200×675',
    icon: 'cloud',
    color: '#0085FF',
    homeUrl: 'https://bsky.app'
  },
  truthsocial: {
    id: 'truthsocial',
    name: 'Truth Social',
    charLimit: 500,
    urlCharsCountedAs: 23,
    hashtagRecommendation: { min: 1, max: 5 },
    tone: 'mixed',
    imageSize: '1200×675',
    icon: 'campaign',
    color: '#E81B26',
    homeUrl: 'https://truthsocial.com'
  },
  gab: {
    id: 'gab',
    name: 'Gab',
    charLimit: 3000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 1, max: 10 },
    tone: 'mixed',
    imageSize: '1200×675',
    icon: 'chat_bubble',
    color: '#21CF7B',
    homeUrl: 'https://gab.com'
  },
  parler: {
    id: 'parler',
    name: 'Parler',
    charLimit: 1000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 1, max: 5 },
    tone: 'mixed',
    imageSize: '1200×675',
    icon: 'record_voice_over',
    color: '#892D34',
    homeUrl: 'https://parler.com'
  },
  gettr: {
    id: 'gettr',
    name: 'GETTR',
    charLimit: 777,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 1, max: 5 },
    tone: 'mixed',
    imageSize: '1200×675',
    icon: 'groups',
    color: '#FC223B',
    homeUrl: 'https://gettr.com'
  },
  lemmy: {
    id: 'lemmy',
    name: 'Lemmy',
    charLimit: 10000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 0 },
    tone: 'casual',
    imageSize: '1200×628',
    icon: 'link',
    color: '#00BC8C',
    homeUrl: 'https://join-lemmy.org'
  },
  digg: {
    id: 'digg',
    name: 'Digg',
    charLimit: 200,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 3 },
    tone: 'casual',
    imageSize: '1200×628',
    icon: 'trending_up',
    color: '#005BE2',
    homeUrl: 'https://digg.com'
  },
  fourchan: {
    id: 'fourchan',
    name: '4chan',
    charLimit: 2000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 0 },
    tone: 'casual',
    imageSize: '1200×628',
    icon: 'grid_4x4',
    color: '#789922',
    homeUrl: 'https://4chan.org'
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    charLimit: 500,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 2, max: 20 },
    tone: 'mixed',
    imageSize: '1000×1500 (2:3)',
    icon: 'push_pin',
    color: '#E60023',
    homeUrl: 'https://pinterest.com'
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    charLimit: 300,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 0 },
    tone: 'casual',
    imageSize: '1200×628',
    icon: 'forum',
    color: '#FF4500',
    homeUrl: 'https://reddit.com'
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    charLimit: 5000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 3, max: 5 },
    tone: 'professional',
    imageSize: '1400×933',
    icon: 'article',
    color: '#000000',
    homeUrl: 'https://medium.com'
  },
  substack: {
    id: 'substack',
    name: 'Substack',
    charLimit: 10000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 0, max: 5 },
    tone: 'professional',
    imageSize: '1456×728',
    icon: 'mail',
    color: '#FF6719',
    homeUrl: 'https://substack.com'
  },
  blogger: {
    id: 'blogger',
    name: 'Blogger',
    charLimit: 10000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 3, max: 10 },
    tone: 'mixed',
    imageSize: '1200×628',
    icon: 'edit_note',
    color: '#FF5722',
    homeUrl: 'https://blogger.com'
  },
  ghost: {
    id: 'ghost',
    name: 'Ghost',
    charLimit: 10000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 3, max: 5 },
    tone: 'professional',
    imageSize: '1200×857',
    icon: 'auto_awesome',
    color: '#15171A',
    homeUrl: 'https://ghost.org'
  },
  livejournal: {
    id: 'livejournal',
    name: 'LiveJournal',
    charLimit: 5000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 3, max: 10 },
    tone: 'casual',
    imageSize: '1200×628',
    icon: 'menu_book',
    color: '#00B0EA',
    homeUrl: 'https://livejournal.com'
  },
  dreamwidth: {
    id: 'dreamwidth',
    name: 'Dreamwidth',
    charLimit: 5000,
    urlCharsCountedAs: 'actual',
    hashtagRecommendation: { min: 3, max: 10 },
    tone: 'casual',
    imageSize: '1200×628',
    icon: 'cloud_queue',
    color: '#D95E00',
    homeUrl: 'https://dreamwidth.org'
  }
};

export const EMOJI_SUGGESTIONS = {
  professional: ['📊', '💼', '🎯', '✅', '📈', '🤝', '💡', '🏆', '📝', '📋', '📌', '📍', '🔍', '🔑', '💰', '💵', '💳', '📞', '📧', '📅', '⏰', '🕐', '📁', '📂', '📎', '✏️', '🖊️', '🖋️', '📐', '📏', '🔧', '🔨', '⚙️', '🛠️', '🏢', '🏛️', '🏭', '🏗️', '📦', '📮', '📬', '📪', '💻', '⌨️', '🖥️', '🖨️', '💾', '💿', '📱', '☎️'],
  casual: ['🔥', '😊', '👀', '💯', '🙌', '❤️', '✨', '🚀', '😄', '😃', '😁', '😆', '🥰', '😍', '🤩', '😎', '🤗', '🥳', '🎈', '🎁', '🎀', '🌈', '☀️', '🌟', '⭐', '💫', '✨', '🌙', '☁️', '⛅', '🌤️', '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🏵️', '💐', '🌿', '☘️', '🍀', '🎄', '🎃', '🍕', '🍔', '🍟', '🌮', '🌯', '🥗', '🍰', '🎂', '🧁', '🍪', '🍩', '☕', '🍵', '🥤', '🍹'],
  engaging: ['🤔', '👇', '💭', '🎉', '⚡', '🌟', '💪', '🎊', '🙋', '🙋‍♂️', '🙋‍♀️', '👋', '👏', '🤲', '👐', '🙏', '✋', '👊', '✊', '🤘', '🤟', '👍', '👎', '☝️', '👆', '👉', '👈', '🤞', '✌️', '🤝', '💬', '💥', '💢', '💨', '💦', '🔔', '🔕', '📣', '📢', '🎤', '🎧', '📻', '🎵', '🎶', '🎼', '🎹', '🥁', '🎸', '🎺', '🎷', '🎻', '🎬', '🎮', '🕹️', '🎲', '🎰', '🏅', '🥇', '🥈', '🥉', '🏆']
};
