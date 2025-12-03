import { Author } from '../models/blog.models';

/**
 * Authors Data
 * Sample authors for the blog
 */
export const AUTHORS = {
  john_doe: {
    id: 'john_doe',
    name: 'John Doe',
    bio: 'John is a full-stack developer with over 10 years of experience building web applications. He loves sharing knowledge and helping others learn to code.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    socialLinks: {
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
    },
  },
  jane_smith: {
    id: 'jane_smith',
    name: 'Jane Smith',
    bio: 'Jane is a UX designer and frontend developer passionate about creating beautiful, accessible web experiences. She specializes in design systems and component libraries.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    socialLinks: {
      twitter: 'https://twitter.com/janesmith',
      linkedin: 'https://linkedin.com/in/janesmith',
      website: 'https://janesmith.design',
    },
  },
  alex_johnson: {
    id: 'alex_johnson',
    name: 'Alex Johnson',
    bio: 'Alex is a developer advocate and technical writer who loves explaining complex concepts in simple terms. When not writing, you can find them contributing to open source projects.',
    avatar: 'https://i.pravatar.cc/150?img=33',
    socialLinks: {
      twitter: 'https://twitter.com/alexjohnson',
      github: 'https://github.com/alexjohnson',
    },
  },
} as const;
