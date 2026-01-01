import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: The Top Ten Best and Worst Movie Remakes
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Hollywood loves a remake. Sometimes they get it right. Sometimes they get it spectacularly wrong. Here\'s a breakdown of the best and worst attempts to recapture lightning in a bottle—or in some cases, to completely miss the point of what made the original work in the first place.',
      className: 'lead',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Worst Remakes',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Let\'s start with the disappointments. These are the remakes that not only failed to improve on the original but somehow managed to strip away everything that made the source material memorable.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '1. Total Recall (2012)',
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: '/assets/posters/total-recall-2012.png',
      alt: 'Total Recall (2012) Movie Poster',
      caption: 'Total Recall (2012) - A sterile, forgettable remake that stripped away all the gonzo excess that made the original memorable.',
      width: 200,
      height: 300,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The 1990 Paul Verhoeven original starring Arnold Schwarzenegger was violent, weird, darkly funny, and utterly committed to its bonkers premise. It had three-breasted mutants, exploding eyeballs, and genuine ambiguity about whether any of it was actually happening.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The 2012 remake starring Colin Farrell? Sterile. Forgettable. Visually generic. They swapped out Mars for a dreary Earth-bound setting, removed all the gonzo excess that made the original so memorable, and delivered a chase movie that could\'ve been any other mid-budget sci-fi thriller from that era.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Verhoeven\'s version asked big questions about identity and reality while gleefully embracing pulp absurdity. The remake asked nothing and offered even less. It wasn\'t offensively bad—it was worse. It was boring.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> They tried to make a "serious" version of material that only works when you lean into the ridiculousness. You can\'t make Total Recall grounded and gritty. It\'s about fake memories and mutant rebellions on Mars. Commit to the bit or don\'t bother.',
    },
  },
  {
    type: 'adsense',
    data: {
      adClient: 'ca-pub-7077792325295668',
      adSlot: '3887470191',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '2. The Running Man (2025)',
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: '/assets/posters/running-man-2025.png',
      alt: 'The Running Man (2025) Movie Poster',
      caption: 'The Running Man (2025) - A humorless remake that forgot what made the 1987 version so entertaining.',
      width: 200,
      height: 300,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The 1987 Schwarzenegger version was camp perfection—a gleefully over-the-top satire of media violence and authoritarian spectacle. Richard Dawson as the smarmy game show host. Ridiculous themed killers like Buzzsaw and Dynamo. One-liners for days. It knew exactly what it was and delivered accordingly.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The 2025 remake tried to go "back to the source material"—Stephen King\'s (writing as Richard Bachman) original novel. Which sounds good in theory. Except the novel is bleak, humorless, and nowhere near as fun as the Schwarzenegger cheese-fest. The new version strips out the personality, amps up the self-serious dystopian hand-wringing, and forgets that audiences actually enjoyed the 1987 film <i>because</i> it was ridiculous, not in spite of it.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'They hired Glen Powell, who can do charisma in his sleep, then gave him nothing interesting to do. The production design looks like every other gray concrete dystopia we\'ve seen a dozen times. And worst of all? No memorable villains. The \'87 version had Captain Freedom, Fireball, and Subzero. The remake has... guys in tactical gear, I guess?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> Mistaking "faithful to the book" for "automatically better." Sometimes the adaptation improves on the source. The 1987 Running Man understood that a fun, pulpy action movie beats a grim slog every time. The remake learned nothing.',
    },
  },
  {
    type: 'adsense',
    data: {
      adClient: 'ca-pub-7077792325295668',
      adSlot: '3887470191',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<em>More remakes coming soon...</em>',
    },
  },
];
