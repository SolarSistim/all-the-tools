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
    avatar: '/assets/author-images/joel_hansen.jpg',
    socialLinks: {
    },
  }
} as const;
