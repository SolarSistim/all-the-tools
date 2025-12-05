import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: The WILD Story of the Gaudy Palace on Scenic Highway
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'If you\'ve ever driven down Scenic Highway in Pensacola, you\'ve seen it. You couldn\'t miss it if you tried.',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'That stone mansion with the gold roof sitting right on Escambia Bay. The one that looks like someone tried to build the Taj Mahal, a Kremlin, and a Vegas casino all at once, and somehow succeeded at none of them.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Locals have called it everything from "the Taj Mahal" to "the Kremlin" to "Garbaj Mahal." Pool service guys use it as a landmark.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The internet has opinions.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'But what\'s actually true about this place, and what\'s just local legend? I dug through public records and online discussions to sort it out.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What I Know for Sure',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'These facts come from public records, news reports, and official documents.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Property and Owner',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The house sits Scenic Highway. Public records confirm it\'s owned by Dr. Mohammad Mikhchi (sometimes misspelled Mikichi). I won\'t put the address here, but dang, you can\'t miss it.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'According to Florida business records (Sunbiz.org), Mikhchi owns multiple assisted living facilities in the area: Northpointe Retirement Community, Westpointe, and possibly Grandepointe, or in any case the Doctor owned Grandepointe at some point in the past.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The house has been listed for sale in the past and appeared on Zillow and other realtor websites.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Wetland Violation',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This one is documented. The Pensacola News Journal reported in 2015 that Mikhchi was ordered to restore wetlands on the property. He had illegally cleared trees from the beach area, which was legally protected swampland.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Court Records',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Escambia County court records show a handful of minor cases under his name:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<strong>2015:</strong> Two animal control violations. He pled not guilty and was acquitted on both counts in April 2015.',
        '<strong>2000:</strong> Expired registration ticket from Florida Highway Patrol. Dismissed after he showed valid registration.',
        '<strong>1992:</strong> Parking violation. Paid $100 fine.',
        '<strong>1990:</strong> Fire lane parking violation. Paid $35 fine.',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'That\'s it. No major criminal cases in the public record.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Hurricane Sally (2020)',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Hurricane Sally hit Pensacola in September 2020. The storm caused significant damage along Scenic Highway, and the property was visibly damaged afterward. That part is undisputed, anyone driving by could see it.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Recent observations confirm that repair work has begun. People have noted a new roof on the structure.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Retirement Community Reviews',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Remember those anonymous complaints about the assisted living facilities? Turns out there\'s a public paper trail backing some of it up.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Caring.com, a senior living review site, has listings for both Westpointe and Northpointe. The reviews are rough.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Westpointe Retirement Community</strong> (5101 Northpointe Pkwy) has a 2.6 out of 5 rating from 5 reviews. Here\'s what people wrote:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'One positive review from June 2024 says the rooms are nice, the food is great, and the staff are "super nice." Almost certainly the one free review that the account owner is granted, or possibly from a friend. C\'mon, I\'ve done it before.',
        'But the rest paint a different picture. A 2021 resident described the food as "horrible, not even edible" and "unsanitary." During COVID, they said residents were essentially confined to rooms while staff didn\'t wear masks.',
        'A 2019 reviewer wrote that their relative lost over 30 pounds because the facility "doesn\'t provide enough calories to maintain adequate weight." They also reported the place was "over-run with roaches, flies & mice" and that "roaches & flies are in the dining room." Response to urgent call bells was "slow to non-existent." When residents complained, management was "dismissive" and would "offer them to leave if they don\'t like it."',
        'A 2018 reviewer said it\'s fine for independent seniors but warned: "if you are expecting two aides at night, you are not going to get that."',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Northpointe Retirement Community</strong> is worse. It has mostly 1-star reviews.',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'A 2022 reviewer—who had both parents stay there—wrote: "The food was terrible and of the poorest quality. The place, in general, was filthy and infested with mice and roaches." Their mother "had to purchase her own rat traps and bait." After their mother fell and broke her hip, she was "left unattended for over 5 hours." She died shortly after surgery. The reviewer called it "the WORST place anyone could go."',
        'A 2018 insurance evaluator couldn\'t even finish their site evaluation because "the place is a dump and was failing on the evaluation not even half way through." They added: "If this is a Retirement Community, I would go rob a bank and be sentenced to a Federal Prison first."',
        'A 2017 visitor trying to move a friend in found the room dirty. When they asked for it to be cleaned, "Admin told us to get off his property."',
        'Multiple reviews from 2016 mention a rude administrator. One person who just called to ask questions was so put off by his "nasty tone" that they never visited. Another wrote: "It is unkempt, it has foul odor, and [is] unorganized. I do not see how they are still open."',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Grandepointe is harder to track down. It may have been sold or renamed. The comments mention it, but I couldn\'t find current reviews.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You can read the full reviews here:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<a href="https://www.caring.com/senior-living/florida/pensacola/westpointe-retirement-community" target="_blank" rel="noopener noreferrer">Westpointe Reviews on Caring.com</a>',
        '<a href="https://www.caring.com/senior-living/florida/pensacola/northpointe-retirement-community-32514" target="_blank" rel="noopener noreferrer">Northpointe Reviews on Caring.com</a>',
      ],
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What People Are Saying',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This section comes from online discussions, Reddit threads, and local forums. Take it with a grain of salt—it\'s hearsay, not verified fact.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Inside of the House',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'People who claim to have seen the interior (or photos from when it was listed) describe some wild features:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The ground floor supposedly has a pool that runs under the walls, like you can swim from one room to another. Lace curtains and crystal chandeliers reportedly hang over the pool. Egyptian artifacts are supposedly scattered throughout. Blue tile everywhere. Something about the "largest chandelier ever"? - Unconfirmed.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One insurance agent who quoted the house said: "It\'s WILD."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Multiple people mention the house was featured in the local Bella magazine years ago, which would make this somewhat verifiable if someone dug up that issue.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Pink Treehouse',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Several people confirm the family owns property across the street with a treehouse on stilts. It\'s visible from the road, so that part checks out.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The stories about it are harder to verify:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'People claim the treehouse originally had electricity, a landline phone, and cable TV. It was supposedly white before being painted pink. Neighborhood kids claim they used to play in it.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The bee story is my favorite: supposedly when the Doctor stopped maintaining his bee box (the fresh honey was "amazing," per one commenter), the bees moved into the treehouse attic. "Made things more exciting," one recalled.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Today, everyone agrees it\'s falling apart and being overtaken by the tree.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'His Background',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Someone claiming to be a longtime family friend posted a detailed backstory:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'According to them, Mikhchi and his brother came to the States from Iran after the Islamic Revolution in the late 1970s. Both brothers supposedly served in the Imperial Iranian Air Force before fleeing.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Another commenter wrote: "He\'s from Iran. That\'s the style if you have money where he\'s from. Eccentric taste, but nice guy."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I haven\'t been able to independently verify any of this.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Insurance Dispute',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Multiple people claim Hurricane Sally flooded the property and the insurance company refused to pay the full value. They say Mikhchi has been fighting it in court ever since.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This would explain why the property sat in disrepair for years. But I haven\'t found court filings to confirm it.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Assisted Living Complaints',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Beyond the Caring.com reviews, anonymous Reddit users have shared their own stories.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One former employee claimed both facilities "constantly have rats or snakes in the kitchen area" and that "the rats don\'t care if you\'re in the room with them." They alleged Northpointe housed "better paying families" while Westpointe housed "lower paying families," with staff walking between both during meals.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Another commenter said their father "seemed hungry a lot" while staying there.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One person called him "one of the biggest crooks in the city."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The Caring.com reviews suggest at least some of these anonymous complaints may have merit. The pest problems, poor food quality, and unresponsive management show up in both places.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Other Side',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Not everyone online has complaints.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One person described how Mikhchi and his wife bought Lady Gaga tickets for a financially struggling single mom\'s kids and "treated them to anything they wanted that night."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Multiple people describe him as a "nice guy" with "eccentric taste."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One commenter pushed back on the gossip: "I don\'t put much stock into local gossip seeing as how you incorrectly stated what business he owns and people constantly say he\'s Indian."',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The LLC Transfer',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One person claimed Mikhchi "illegally cleared all the trees from the beach on that property" and "switched the house into an LLC possession to avoid jail time."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The wetland violation is documented (see above). The LLC transfer claim? Unverified.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'The Christmas Lights',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Multiple people fondly remember the Christmas light displays. One wrote: "I hope they continue the Christmas tradition, it always made me smile to see, all the way across the bay bridge at 75mph."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Whether the tradition will return after the hurricane damage is fixed up is unknown.',
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
      text: 'Here\'s what we actually know: A man named Mohammad Mikhchi owns a very unusual house on Scenic Highway. He also owns several assisted living facilities - and the public reviews for those facilities are scathing. He got in trouble for clearing wetlands on his property. Hurricane Sally damaged the place, and he was acquitted on animal control charges and paid a couple parking tickets in the \'90s.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Everything else—the swimming pool under the walls, the Iranian Air Force backstory, the bee-infested treehouse, the insurance battle, the random acts of generosity - is what the internet says. Some of it is probably true, and some of it might be exaggerated. And some of it could be completely made up.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'But those assisted living reviews? Those are real people, writing under their own accounts, describing mice, roaches, unaccountable weight loss, falls, and a dismissive administrator. That part isn\'t Reddit gossip - it\'s on a public review site for anyone to see.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'What\'s undeniably true: this house has become local legend. People have strong feelings about it.',
    },
  },
  {
    type: 'blockquote',
    data: {
      text: 'Even when it was not in disrepair it looked cheesy as hell.',
    },
  },
  {
    type: 'blockquote',
    data: {
      text: 'Taste is subjective. You\'re not going to change my mind.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'My take on this is that this is a man - a Human Being - who desperately wants to participate in society… sometimes criminally so.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Drive by it sometime. You\'ll have your own opinion in no time.',
    },
  },
];
