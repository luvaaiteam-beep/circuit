export interface BlogSection {
  id: string;
  heading: string | null;
  content: string;
  callout?: {
    title: string;
    body: string;
    type: 'info' | 'warning' | 'tip';
  };
  screenshot?: {
    src: string;
    alt: string;
    caption: string;
  };
  steps?: Array<{
    title: string;
    body: string;
    note?: string;
  }>;
  upgrades?: Array<{
    title: string;
    body: string;
  }>;
  cards?: Array<{
    icon: 'zap' | 'lightbulb' | 'terminal' | 'box' | 'sparkles';
    title: string;
    body: string;
    iconColor: 'amber' | 'cyan' | 'emerald' | 'red' | 'zinc';
  }>;
  comparison?: {
    left: { icon: string; title: string; body: string; variant: 'danger' | 'safe' };
    right: { icon: string; title: string; body: string; variant: 'danger' | 'safe' };
  };
  troubleshooter?: Array<{
    problem: string;
    solution: string;
  }>;
  inlineCta?: {
    heading: string;
    body: string;
    buttonText: string;
    buttonLink: string;
  };
  embedSim?: boolean;
}

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogReference {
  title: string;
  url: string;
  desc: string;
  tag: string;
}

export interface RelatedPost {
  path: string;
  title: string;
  description: string;
  category: string;
  categoryColor: 'cyan' | 'amber' | 'emerald';
}

export interface BlogPost {
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  datePublished: string;
  dateModified: string;
  category: string;
  h1: string;
  deck: string;
  readTime: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  heroImage?: {
    src: string;
    alt: string;
    fallbackText: string;
  };
  sections: BlogSection[];
  faqs: BlogFaq[];
  references: BlogReference[];
  relatedPosts: RelatedPost[];
  sidebarCta?: {
    title: string;
    body: string;
    linkText: string;
    linkPath: string;
  };
}
