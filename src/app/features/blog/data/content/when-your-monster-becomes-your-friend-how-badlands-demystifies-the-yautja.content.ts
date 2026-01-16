import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: When Your Monster Becomes Your Friend: How Badlands Demystifies the Yautja
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: "First off, can we talk about how the Predator isn't scary anymore? It's definitely badass, no doubt about that.",
      className: 'lead',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Predator: Badlands',
      year: 2025,
      posterSrc: '/assets/blog/how-badlands-demystifies-the-yautja/predator-badlands-dvd-cover-art.jpg',
      posterAlt: 'Predator: Badlands (2025) Poster',
      ratingsDate: 'January 16, 2026',
      ratings: [
        { source: 'IMDB', score: 7.1, maxScore: 10 },
        { source: 'Letterboxd', score: 3.4, maxScore: 5 },
        { source: 'Trakt', score: 71, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 68, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 82, maxScore: 100 },
        { source: 'MetacriticUser', score: 65, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 62, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: '/assets/blog/how-badlands-demystifies-the-yautja/predator-badlands-dvd-cover-art.jpg',
      alt: 'Predator: Badlands (2025) Movie Poster',
      caption: 'Predator: Badlands (2025) - When your monster becomes your friend, is it still scary?',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Predator Mystique is Gone',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "That's the big shift. The Yautja used to feel like a nightmare you only caught glimpses of: movement in the trees, heat vision, the click-click-click noise, some poor guy getting yanked into the shadows.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "In Badlands, though? Dek isn't some unknowable monster. He's basically a really really macho guy with a sword. The galaxy's most aggressive gym bro with dreadlocks.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "And I'm not even saying that as an insult (okay, maybe a little), but the film almost wants you to admire him. He's less \"alien horror stalking the jungle\" and more \"warrior dude proving himself,\" especially once he teams up with Thia, the Weyland-Yutani synth who is, frankly, way too chatty for the situation. She's basically the movie's walking exposition machine... but she's fun, so I'll let it slide.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Still, the Predator mystique is gone.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'More Macho Than Klingons',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Dek is brave, stubborn, honorable, physically dominant. He has grief <i>and</i> daddy issues. He even has the whole ritualized warrior thing going on, which brings me to this: the Predators in this movie are basically more macho than Klingons.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Klingons at least have a flair for drama - poetry, opera, screaming about honor like they're in a bar fight musical. Predators in Badlands are like Klingons if you removed the culture and left only the chest-thumping.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Dek is essentially a dude raised on the idea that strength is the only language. No nuance, just dominance. When Thia starts unpacking the whole "alpha wolf" metaphor about leadership being protection rather than killing, it almost feels like the film is trying to evolve the Predator mythology into something deeper.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Almost.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'But then the movie swings right back into testosterone mode: hunt, kill, trophy, repeat.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The FTL Plot Hole',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Now, let's hit the plot hole that made me roll my eyes so far back in my head they came back around again.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Dek crash lands on Genna in what's implied to be a faster-than-light starship... and the movie treats this like background noise.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Excuse me?? The Yautja <i>are</i> an FTL culture, correct me if I\'m wrong.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Dek's space ship is the most valuable object on the entire planet... probably in the whole quadrant. Forget the Kalisk. If Weyland-Yutani gets even scraps of functional FTL propulsion tech, that's not just a corporate win, that's civilization-changing. That's a \"rewrite future human history\" kind of discovery.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "And yet the Company is laser-focused on capturing the Kalisk specimen. Like, guys... Priorities?? You're telling me the greatest megacorp in sci-fi is ignoring literal FTL technology because they really want a murder-lizard that heals fast?",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I personally find this <i>really</i> impluasible.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "It makes the Kalisk feel... less mythic. Because the film accidentally tells us: \"Yeah, this creature matters\", while simultaneously parking a technological miracle right behind it and acting like it's just Dek's ride.",
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Family Backstory Problem',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Then there's the family backstory. Dek's father killing Dek's brother execution-style.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "I'm sorry, I don't buy it. Not fully.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "I get what they're going for: Predator culture is brutal, the weak are culled, blah blah, grim warrior society. The script even underlines this worldview later through Tessa's chilling logic.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "But an execution-style killing in a Predator family dynamic feels... oddly human. Too cold in a bureaucratic way. Predators in the franchise typically kill for dominance, for ritual, for status. It's physical. It's visceral. It's not usually \"line up and shoot your own kid like you're running a cartel.\"",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "So unless the film is telling us Predator society is becoming more rigid, more fascistic (which would actually be interesting), it reads as shock-value writing.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "It's like the screenwriter said: \"How do we make Dek sympathetic fast?\" and landed on the emotional equivalent of a sledgehammer.",
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What the Movie Gets Right',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "But okay - here's where I'll give the movie some credit.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The way it ties Alien lore and Weyland-Yutani into the Predator franchise? Surprisingly believable.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Not perfect, but believable.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Thia being a Weyland-Yutani synthetic deployed because humans wouldn't last a day on this planet feels extremely on-brand for the Company: clinical, cowardly, exploitative. And Tessa's whole descent into Company obedience - the way she starts sounding less like a person and more like corporate machinery - that's classic Alien energy. When she calls Dek \"property\" I actually felt that ugly little chill, like oh right... Weyland-Yutani doesn't just buy planets, they buy lives.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "That connective tissue works better here than most crossover attempts. It doesn't feel like a cheap wink. It feels like the same greedy monster wearing a different mask.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "And that might be the real Predator in Badlands, if we're being honest. Not Dek, or the Kalisk - but the Company.",
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Bringing Dek to Life',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Now, credit where it's due: Dek's facial movements are genuinely impressive. The detail in the facial expressions, the subtle muscle movements, the way emotion reads through alien features - that's not easy to pull off. Whether it's motion capture, practical effects, or some combination, the team nailed it.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "And the Yautja language? Surprisingly well thought out. It's not just random clicks and growls - there's structure to it, consistency. You can tell someone actually sat down and designed a linguistic system rather than just having the actors grunt alien noises. It adds authenticity to the Predator culture, makes them feel like an actual civilization rather than just movie monsters.",
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Verdict',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "So yeah... Predator: Badlands isn't subtle. It makes the Predator less scary and more swaggering. It has at least one plot hole big enough to park a starship in. But it also has moments where it clicks into something dark and familiar - that Weyland-Yutani cruelty, that sense that the real horror is systems and people, not beasts.",
    },
  },
  {
    type: 'paragraph',
    data: {
      text: "Which is kind of depressing. But hey, welcome to dystopian sci-fi.",
    },
  },
];
