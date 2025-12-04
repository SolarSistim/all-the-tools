import { Author } from '../models/blog.models';

/**
 * Authors Data
 * Sample authors for the blog
 */
export const AUTHORS = {
  joel_hansen: {
    id: 'joel_hansen',
    name: 'Joel Hansen',
    bio: 'Joel Hansen is a full-stack problem-solver, spends days crafting Angular front ends, taming complex Node backends, and bending C# to his will. By night, Joel moonlights as an amateur sleuth — known for unraveling mysteries from puzzling codebases to actual real-world oddities.',
    avatar: '/author-images/joel_hansen.png',
    socialLinks: {
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
    },
  }
} as const;
