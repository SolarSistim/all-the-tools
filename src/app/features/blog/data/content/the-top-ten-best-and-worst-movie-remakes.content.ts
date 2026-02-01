import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: The Top Ten Worst Movie Remakes
 */
export const content: ContentBlock[] = [
  {
    type: 'component',
    data: {
      componentName: 'social-media-links',
      backgroundVariant: 'dark',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Hollywood loves a remake. Sometimes they get it right and sometimes they get it spectacularly wrong. Here\'s a breakdown of the worst attempts to recapture lightning in a bottle - or in some cases, to completely miss the point of what made the original work in the first place.',
      className: 'lead',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Bottom Line',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Most remakes fail because they either strip away what made the original special or try to modernize without understanding why the source material worked in the first place. These ten films represent some of Hollywood\'s most spectacular failures - movies that squandered talented casts, generous budgets, and beloved source material to deliver forgettable, often unwatchable experiences. Some were so bad I couldn\'t even finish them.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'related-blog-posts',
      posts: [
        {
          title: 'When Your Monster Becomes A Friend: How Badlands Demystifies the Yautja',
          slug: 'when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja'
        }
      ]
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
    type: 'heading',
    data: {
      level: 3,
      text: '1. Total Recall (2012)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Total Recall',
      year: 2012,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/total-recall-2012.jpg',
      posterAlt: 'Total Recall (2012) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 6.2, maxScore: 10 },
        { source: 'Letterboxd', score: 2.5, maxScore: 5 },
        { source: 'Trakt', score: 66, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 30, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 47, maxScore: 100 },
        { source: 'MetacriticUser', score: 57, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 43, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/total-recall-2012.jpg',
      alt: 'Total Recall (2012) Movie Poster',
      caption: 'Total Recall (2012) - A sterile, forgettable remake that stripped away all the gonzo excess that made the original memorable.',
      width: 70,
      height: 105,
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
      text: 'The 2012 remake starring Colin Farrell? Sterile. Forgettable. Visually generic. They removed all the gonzo excess that made the original so memorable, and delivered a chase movie that could\'ve been any other mid-budget sci-fi thriller from that era.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Verhoeven\'s version asked big questions about identity and reality while gleefully embracing pulp absurdity. The remake asked nothing and offered even less. It wasn\'t offensively bad - it was worse: It was boring.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> They tried to make a "serious" version of material that only works when you lean into the ridiculousness. You can\'t make Total Recall grounded and gritty. Commit to the bit or don\'t bother.',
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
    type: 'movieRatings',
    data: {
      title: 'The Running Man',
      year: 2025,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/running-man-2025.jpg',
      posterAlt: 'The Running Man (2025) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 6.2, maxScore: 10 },
        { source: 'Letterboxd', score: 3.2, maxScore: 5 },
        { source: 'Trakt', score: 68, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 63, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 78, maxScore: 100 },
        { source: 'MetacriticUser', score: 56, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 56, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/running-man-2025.jpg',
      alt: 'The Running Man (2025) Movie Poster',
      caption: 'The Running Man (2025) - A humorless remake that forgot what made the 1987 version so entertaining.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The 1987 Schwarzenegger version was camp perfection - a gleefully over-the-top satire of media violence and authoritarian spectacle. Ridiculous themed killers like Buzzsaw and Dynamo. One-liners for days. It knew exactly what it was and delivered accordingly.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The 2025 remake tried to go "back to the source material" - Stephen King\'s (writing as Richard Bachman) original novel, which sounds good in theory. Except the novel is bleak, humorless, and nowhere near as fun as the Schwarzenegger cheese-fest. The new version strips out the personality, amps up the self-serious dystopian hand-wringing, and forgets that audiences actually enjoyed the 1987 film <i>because</i> it was ridiculous, not in spite of it.',
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
    type: 'heading',
    data: {
      level: 3,
      text: '3. The Crow (2024)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'The Crow',
      year: 2024,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/the-crow-2024.jpg',
      posterAlt: 'The Crow (2024) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 4.7, maxScore: 10 },
        { source: 'Letterboxd', score: 2.2, maxScore: 5 },
        { source: 'Trakt', score: 59, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 22, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 62, maxScore: 100 },
        { source: 'MetacriticUser', score: 35, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 30, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/the-crow-2024.jpg',
      alt: 'The Crow (2024) Movie Poster',
      caption: 'The Crow (2024) - A lifeless remake that couldn\'t capture the gothic intensity of the original.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I loved the original. Brandon Lee\'s final performance was haunting, tragic, and utterly committed to the dark, rain-soaked gothic atmosphere that made <em>The Crow</em> iconic. It wasn\'t just a comic book movie - it was a visceral meditation on grief and vengeance.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This 2024 remake? Flat, forced and generally not entertaining. They cast Bill Skarsgard, who can absolutely do brooding intensity when the material supports it, but the script gives him little to work with. The visual style tries to modernize the gothic aesthetic and ends up looking like every other desaturated action movie from the past decade.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The original worked because it committed fully to its operatic melodrama. The remake hedges its bets, trying to be gritty and realistic while also paying homage to the source material, and ends up accomplishing neither. It\'s not campy enough to be fun, not serious enough to be affecting, and not stylish enough to coast on atmosphere alone.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> You can\'t capture lightning in a bottle twice, especially when the original\'s power came from genuine tragedy. Brandon Lee died making that film. It became a memorial. Any remake was going to struggle under that weight, but this one didn\'t even try to find its own identity.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '4. Firestarter (2022)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Firestarter',
      year: 2022,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/firestarter-2022.jpg',
      posterAlt: 'Firestarter (2022) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 4.6, maxScore: 10 },
        { source: 'Letterboxd', score: 1.7, maxScore: 5 },
        { source: 'Trakt', score: 56, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 10, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 47, maxScore: 100 },
        { source: 'MetacriticUser', score: 29, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 32, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/firestarter-2022.jpg',
      alt: 'Firestarter (2022) Movie Poster',
      caption: 'Firestarter (2022) - So bad we couldn\'t make it past 30 minutes.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I rarely quit on a movie. Even if it\'s bad -even if it\'s <em>really</em> bad - I\'ll usually stick it out to the end. Call it a misguided sense of fairness to the filmmakers. Whatever it is, I finish movies.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'My wife and I got about 30 minutes into <em>Firestarter</em> and couldn\'t take it anymore. We looked at each other, verbally agreed we\'d given it a fair shot, and turned it off.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Maybe that detracts from my opinion - I haven\'t seen the entire movie, after all. But you, the reader, can\'t <em>make</em> me watch it. I don\'t want to. Life is too short. The 1984 version wasn\'t great either, but at least it had Drew Barrymore at peak creepy-kid-with-powers energy and George Scott chewing scenery. This remake has... Zac Efron looking confused.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> Everything felt half-hearted. The scares weren\'t scary. The action wasn\'t exciting. The family drama wasn\'t moving. It\'s a Stephen King adaptation that forgot to include any of the tension, dread, or human stakes that make King\'s work resonate. When a movie can\'t hold my attention for 30 minutes, it\'s failed at its most basic job.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'related-blog-posts',
      posts: [
        {
          title: 'When Your Monster Becomes A Friend: How Badlands Demystifies the Yautja',
          slug: 'when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja'
        }
      ]
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
      text: '5. Hellboy (2019)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Hellboy',
      year: 2019,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/hellboy-2019.jpg',
      posterAlt: 'Hellboy (2019) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 5.3, maxScore: 10 },
        { source: 'Letterboxd', score: 2.1, maxScore: 5 },
        { source: 'Trakt', score: 60, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 17, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 47, maxScore: 100 },
        { source: 'MetacriticUser', score: 53, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 31, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/hellboy-2019.jpg',
      alt: 'Hellboy (2019) Movie Poster',
      caption: 'Hellboy (2019) - Even David Harbour couldn\'t save this mess.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I have a soft spot for David Harbour. His portrayal of Jim Hopper in <em>Stranger Things</em> is one of the best performances in modern TV - gruff, funny, heartbreaking, and deeply human. When he was cast as Hellboy, I was cautiously optimistic. If anyone could fill Ron Perlman\'s oversized boots, maybe it was Harbour.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'But I just couldn\'t get past how bad this movie was. And it\'s not Harbour\'s fault. He\'s trying. You can see him working to bring charm and wit to the character, but the script is a mess, the pacing is chaotic, the tone careens wildly between horror and comedy without landing either, and the CGI looks unfinished.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Guillermo del Toro\'s <em>Hellboy</em> films weren\'t perfect, but they had style, heart, and a clear vision. This reboot tried to go darker and R-rated, which sounds good on paper, but in practice it just meant more gore without any of the substance. It\'s edgy for the sake of being edgy, and it rings hollow.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> Hiring a talented actor isn\'t enough if you don\'t give them a coherent movie to work with. This felt like it was rewritten and recut into oblivion, leaving behind a frantic, incoherent mess that wastes everyone\'s time - including Harbour\'s.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '6. War of the Worlds (2005)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'War of the Worlds',
      year: 2005,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/war-of-the-worlds-2005.jpg',
      posterAlt: 'War of the Worlds (2005) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 6.6, maxScore: 10 },
        { source: 'Letterboxd', score: 3.3, maxScore: 5 },
        { source: 'Trakt', score: 68, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 76, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 42, maxScore: 100 },
        { source: 'MetacriticUser', score: 69, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 73, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/war-of-the-worlds-2005.jpg',
      alt: 'War of the Worlds (2005) Movie Poster',
      caption: 'War of the Worlds (2005) - Great spectacle, but hides the action and barely has an ending.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Steven Spielberg directing a big-budget alien invasion movie starring Tom Cruise should be a slam dunk. And for the first act, it almost is. The initial tripod attack is genuinely terrifying - one of the best disaster sequences Spielberg has ever shot. The chaos, the scale, the sound design. It\'s masterful.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Then the movie makes a baffling choice: it deliberately hides the action from the audience. Spielberg keeps the camera with Cruise and his family, which means we only see the alien invasion from their limited ground-level perspective. That\'s fine as a storytelling choice - except the movie never gives us a payoff. We never get to see the larger conflict. We never get closure on what\'s actually happening.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'It feels halfway to an M. Night Shyamalan movie - intimate, constrained, focused on characters instead of spectacle - but without committing to it fully. And then the ending. Oh, the ending. The aliens just... die. Because of bacteria. It\'s straight from the H.G. Wells novel, sure, but it lands with a wet thud on screen. No climax. No resolution. Just "welp, they all died off-screen."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> Spielberg tried to make a grounded, character-focused alien invasion movie, but the audience came for the spectacle. Hiding the action would work if there was a reveal later - if we got to see what we\'d been denied. But we never do. The ending feels abrupt and anticlimactic, like the movie just gave up.',
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
      text: '7. Conan the Barbarian (2011)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Conan the Barbarian',
      year: 2011,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/conan-2011.jpg',
      posterAlt: 'Conan the Barbarian (2011) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 5.2, maxScore: 10 },
        { source: 'Letterboxd', score: 2.2, maxScore: 5 },
        { source: 'Trakt', score: 71, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 25, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 30, maxScore: 100 },
        { source: 'MetacriticUser', score: 50, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 36, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/conan-2011.jpg',
      alt: 'Conan the Barbarian (2011) Movie Poster',
      caption: 'Conan the Barbarian (2011) - Jason Momoa was the right choice, but the movie fell flat.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Jason Momoa was probably the best choice to replace Arnold Schwarzenegger as Conan. He has the physicality, similar on-screen presence, and the charisma. He looks like he walked straight out of a Robert E. Howard pulp novel. On paper, this should\'ve worked.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'It just fell flat. The original 1982 <em>Conan the Barbarian</em> had something - a je ne sais quoi - that this remake couldn\'t replicate. Maybe it was John Milius\' operatic direction. Maybe it was Basil Poledouris\' iconic score. Maybe it was Arnold\'s utter commitment to playing a stoic killing machine who only speaks in grunts and one-liners.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The 2011 version tries to be more faithful to the source material, which sounds good, but in execution it just feels generic. The action is fine but forgettable. The villain is unmemorable. The story lacks weight. It\'s competent in a way that makes it instantly disposable.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> Arnold had an undefinable presence that made him perfect for Conan. Momoa has presence too, but the movie around him doesn\'t give him anything to work with. It\'s a remake that didn\'t understand what made the original special -and without that magic, it\'s just another sword-and-sandal movie that comes and goes without leaving a mark.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '8. Flatliners (2017)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Flatliners',
      year: 2017,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/flatliners-2017.jpg',
      posterAlt: 'Flatliners (2017) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 5.2, maxScore: 10 },
        { source: 'Letterboxd', score: 2.1, maxScore: 5 },
        { source: 'Trakt', score: 61, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 4, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 31, maxScore: 100 },
        { source: 'MetacriticUser', score: 41, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 27, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/flatliners-2017.jpg',
      alt: 'Flatliners (2017) Movie Poster',
      caption: 'Flatliners (2017) - Not even Kiefer Sutherland could save this one.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I love Kiefer Sutherland in anything he\'s ever done. <em>24</em>. <em>The Lost Boys</em>. Even his voice work in <em>Metal Gear Solid V</em>. The man has range, intensity, and screen presence. When I saw he was in the <em>Flatliners</em> remake - reprising a version of his character from the original - I gave it a shot.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Again, didn\'t even make it all the way through. That 4% Rotten Tomatoes critic score isn\'t an exaggeration. This is a stunningly bad movie. The premise is ripe for a psychological horror thriller - medical students experiment with near-death experiences and face supernatural consequences - but the execution is bland, predictable, and devoid of scares.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The original 1990 film wasn\'t a masterpiece, but it had atmosphere, interesting ideas about guilt and mortality, and a committed cast. The remake has none of that. It goes through the motions, hits every expected beat, and never surprises or unsettles the viewer. Even Kiefer Sutherland, in a small supporting role, can\'t inject life into it.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'related-blog-posts',
      posts: [
        {
          title: 'When Your Monster Becomes A Friend: How Badlands Demystifies the Yautja',
          slug: 'when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja'
        }
      ]
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> Horror remakes often fail because they mistake formula for substance. This one checked all the boxes - young attractive cast, jump scares, moody lighting - but forgot to create actual tension or stakes. It\'s a hollow shell of a movie that wastes a fascinating premise and a legendary actor.',
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
      text: '9. Point Break (2015)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Point Break',
      year: 2015,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/point-break-2015.jpg',
      posterAlt: 'Point Break (2015) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 5.2, maxScore: 10 },
        { source: 'Letterboxd', score: 2.4, maxScore: 5 },
        { source: 'Trakt', score: 63, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 12, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 29, maxScore: 100 },
        { source: 'MetacriticUser', score: 40, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 34, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/point-break-2015.jpg',
      alt: 'Point Break (2015) Movie Poster',
      caption: 'Point Break (2015) - The original was nostalgic fun. The remake was unwatchable.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'In retrospect, the original <em>Point Break</em> wasn\'t all that great either. It\'s campy, over-the-top, and deeply silly. Keanu Reeves as an undercover FBI agent infiltrating a gang of surfing bank robbers led by Patrick Swayze? It\'s absurd. But I loved it back then, and it\'s nostalgic now. The action is fun, the bromance is earnest, and it commits to its own ridiculousness.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The remake was unwatchable. It tries to modernize the story by making the criminals extreme sports athletes instead of just surfers, which sounds cool but results in a series of disconnected, overproduced action setpieces that have no weight or stakes. The characters are flat. The dialogue is wooden. The chemistry is nonexistent.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Where the original had charm and personality - even if it was cheesy - the remake is sterile and forgettable. It\'s beautifully shot, sure. The stunts are impressive. But none of it matters if you don\'t care about the people performing them. And I didn\'t. Not for a second.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> The original worked because it was earnest and fun. The remake is self-serious and joyless. It wanted to be a gritty, realistic action thriller, but <em>Point Break</em> is inherently ridiculous. You can\'t make bank-robbing surfers feel grounded. You have to lean into the absurdity, and this remake refused to do that.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '10. Red Dawn (2012)',
    },
  },
  {
    type: 'movieRatings',
    data: {
      title: 'Red Dawn',
      year: 2012,
      posterSrc: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/red-dawn-2012.jpg',
      posterAlt: 'Red Dawn (2012) Poster',
      ratingsDate: 'January 1, 2026',
      ratings: [
        { source: 'IMDB', score: 5.3, maxScore: 10 },
        { source: 'Letterboxd', score: 2.2, maxScore: 5 },
        { source: 'Trakt', score: 62, maxScore: 100 },
        { source: 'RottenTomatoesCritic', score: 15, maxScore: 100 },
        { source: 'RottenTomatoesAudience', score: 50, maxScore: 100 },
        { source: 'MetacriticUser', score: 43, maxScore: 100 },
        { source: 'MetacriticMetascore', score: 31, maxScore: 100 }
      ]
    },
  },
  {
    type: 'moviePoster',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/red-dawn-2012.jpg',
      alt: 'Red Dawn (2012) Movie Poster',
      caption: 'Red Dawn (2012) - Thank goodness Chris Hemsworth got the Thor role.',
      width: 70,
      height: 105,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Thank goodness Chris Hemsworth got the Thor role. Because if he didn\'t, <em>Red Dawn</em> would have buried his career before it even started. This movie is a disaster - tonally confused, politically muddled, and narratively incoherent.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The original 1984 <em>Red Dawn</em> was Cold War propaganda, but it worked because it tapped into real fears of the era. Soviet invasion felt plausible (or at least semi-plausible) in Reagan-era America. The 2012 remake initially cast China as the invaders, then digitally changed them to North Korea in post-production to avoid offending the Chinese market. Yes, really. North Korea. Invading and occupying the United States. It\'s laughable.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Beyond the absurd premise, the movie is just poorly made. The action is generic. The characters are one-dimensional. The script feels like it was written by a focus group. Hemsworth does what he can with the material, but he\'s saddled with a movie that doesn\'t know what it wants to be - jingoistic action flick, gritty war drama, or teen survival story - and fails at all three.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>What went wrong:</strong> Remaking <em>Red Dawn</em> in 2012 was already a questionable choice - the Cold War context that made the original work no longer existed. But changing the villain from China to North Korea in post-production exposed the project\'s complete lack of conviction. It\'s a remake made for money, not because anyone had a story to tell, and it shows in every frame.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'social-media-links',
      backgroundVariant: 'dark',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
];
