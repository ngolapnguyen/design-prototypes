import { GRID_THEMES, type GridTheme } from "./ThemeGrid";

const TODAY = new Date(2026, 8, 29);

const dayLabel = (daysAgo: number) =>
  new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - daysAgo).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export type PastTheme = {
  id: string;
  daysAgo: number;
  date: string;
  week: string;
  merged?: number;
  openId?: string;
  theme: GridTheme;
};

type Seed = { title: string; product: string; creator: string; summary: string; merged?: number; openId?: string };

const WEEKS: { start: number; days: number[]; seeds: Seed[] }[] = [
  {
    start: 15,
    days: [14, 14, 15],
    seeds: [
      {
        title: "Brow Glue Removal Hacks After a Long Day",
        product: "NYX Brow Glue",
        creator: "@browsbyjade",
        summary:
          "Creators are sharing how they take off a full day of brow glue without tugging, from micellar water to oil cleansers.",
        merged: 3,
        openId: "nyx",
      },
      {
        title: "Cream Blush Layering for Oily Skin",
        product: "Buttermelt Blush",
        creator: "@skinwithsana",
        summary:
          "Oily-skin creators are layering cream under powder blush and posting noon check-ins to prove it holds.",
      },
      {
        title: "Setting Spray Sweat Tests at Summer Weddings",
        product: "Matte Finish Spray",
        creator: "@mua.dani",
        summary:
          "Wedding makeup artists are filming guests after the dance floor to test which setting sprays actually survive.",
      },
    ],
  },
  {
    start: 22,
    days: [16, 17, 18, 19, 20, 21],
    seeds: [
      {
        title: "Portofino ’97 Liner Swatched on Deep Skin Tones",
        product: "Portofino ’97",
        creator: "@kemi.beats",
        summary:
          "Creators with deeper skin tones are swatching the liner side by side with drugstore picks and sharing where it pulls ashy.",
        merged: 2,
        openId: "vb",
      },
      {
        title: "Glass Skin Routines Swap Serums for Rice Water",
        product: "Rice Toner",
        creator: "@glowbymaya",
        summary:
          "Skincare creators are trading ten-step routines for fermented rice water toners, with before-and-afters doing the convincing.",
      },
      {
        title: "Lip Oil Dupes Beat the Originals on Wear Tests",
        product: "Butter Gloss",
        creator: "@katiadoesmakeup",
        summary:
          "Creators are running eight-hour wear tests on drugstore lip oils and several are outlasting the prestige versions.",
      },
      {
        title: "Back-to-School Makeup Under Ten Minutes",
        product: "Epic Ink Liner",
        creator: "@lianaxbeauty",
        summary:
          "Teen creators are timing full-face routines before the bus, and quick liner hacks are getting the most saves.",
      },
      {
        title: "Brow Lamination at Home vs. the Salon",
        product: "NYX Brow Glue",
        creator: "@uhodom_edinym",
        summary:
          "Side-by-side videos compare a salon lamination with brow glue at home, with most calling the glue ‘close enough’.",
      },
      {
        title: "Festival Glitter That Doesn’t Travel",
        product: "Glitter Primer",
        creator: "@ravewithrae",
        summary:
          "Festival creators are testing glitter primers through a full day outdoors and rating how much ends up on their friends.",
      },
    ],
  },
  {
    start: 29,
    days: [23, 24, 25, 26, 27, 28],
    seeds: [
      {
        title: "Anne Hathaway’s Soft Brown Eye Recreated With Drugstore Picks",
        product: "Brown shadow",
        creator: "@allure",
        summary:
          "Beauty editors broke down the red carpet eye, and creators rebuilt it with three drugstore shadows and a smudge brush.",
        merged: 4,
        openId: "anne",
      },
      {
        title: "Quiet Luxury Hauls Move From Loafers to Ballet Flats",
        product: "Ballet flats",
        creator: "@styledbynoor",
        summary:
          "Haul videos are shifting from logo-free loafers to soft ballet flats, ranked on comfort over a full workday.",
      },
      {
        title: "Concealer Wear Tests Under Sunglasses",
        product: "Can’t Stop Won’t Stop Concealer",
        creator: "@beautybyjess",
        summary:
          "Creators are checking concealer creasing after a day in sunglasses, and full-coverage formulas are losing.",
      },
      {
        title: "Lash Primer Comebacks From Millennial Creators",
        product: "Lash primer",
        creator: "@makeupwithmei",
        summary:
          "A wave of ‘things we stopped doing’ videos brought lash primer back, with before-and-after curl holds.",
      },
      {
        title: "Denim-on-Denim Returns in Festival Try-Ons",
        product: "Double denim",
        creator: "@thriftwithtia",
        summary: "Festival try-on hauls lean into double denim, mixing washes and pairing it with sheer layers.",
      },
      {
        title: "Self-Tanner Streak Fixes Go Viral",
        product: "Tanning mousse",
        creator: "@bronzedbybea",
        summary:
          "Creators are sharing the lemon juice and baking soda fixes that rescued their streaky self-tan before events.",
      },
    ],
  },
  {
    start: 36,
    days: [30, 31, 32, 33, 34, 35],
    seeds: [
      {
        title: "Lululemon Rooftop Pilates Gets Stitched by Instructors",
        product: "Summer Series",
        creator: "@lululemon",
        summary:
          "Instructors stitched the rooftop class videos to fix form cues, and the comments turned into a pacing debate.",
        openId: "lulu",
      },
      {
        title: "Hot Girl Walk Creators Add Weighted Vests",
        product: "Weighted vest",
        creator: "@walkwithkay",
        summary:
          "Walking content is getting heavier as creators add weighted vests and share honest takes on whether it’s worth it.",
      },
      {
        title: "Gym Makeup That Survives a Spin Class",
        product: "Setting powder",
        creator: "@sweatproofsam",
        summary: "Creators are wearing full brows and tint to spin class and grading what survives the sweat.",
      },
      {
        title: "Reformer Pilates at Home on a Budget",
        product: "Sliders",
        creator: "@corebycass",
        summary:
          "Instructors show reformer-style workouts using sliders and bands, pitched as the budget version of the studio.",
      },
      {
        title: "Brow Soap vs. Brow Glue Face-Offs",
        product: "NYX Brow Glue",
        creator: "@browgeek",
        summary: "Brow artists put soap and glue on each side of the face and checked back at hour eight.",
        merged: 2,
      },
      {
        title: "Minimal Makeup for Airport Days",
        product: "Tinted moisturizer",
        creator: "@jetsetjules",
        summary:
          "Travel creators film their three-product airport face and what they reapply after a long-haul flight.",
      },
    ],
  },
  {
    start: 43,
    days: [37, 38, 39, 40, 41, 42],
    seeds: [
      {
        title: "Lewis Hamilton’s Golf Wager Sparks Duet Challenges",
        product: "Golf wager",
        creator: "@lewishamilton",
        summary: "Fans duetted the golf bet clip with their own trick shots, and brands quietly joined the comments.",
      },
      {
        title: "Cottage Cheese Recipes Keep Climbing After Viral Toast",
        product: "Cottage cheese",
        creator: "@proteinwithpri",
        summary:
          "The whipped cottage cheese toast trend spread into pasta sauces and ice cream, led by high-protein creators.",
      },
      {
        title: "Bridal Trial Regrets and What Artists Changed",
        product: "Portofino ’97",
        creator: "@vbbeauty",
        summary:
          "Brides are posting trial versus wedding-day photos, and artists explain the liner and blush swaps they made.",
      },
      {
        title: "Matcha Swaps for Coffee in Morning Routines",
        product: "Matcha",
        creator: "@slowmornings",
        summary:
          "Morning routine videos swap espresso for matcha, with a side debate on ceremonial grade versus latte blends.",
      },
      {
        title: "Clear Mascara as a Brow Shortcut",
        product: "Clear mascara",
        creator: "@lazygirlbeauty",
        summary:
          "Creators are skipping brow products entirely and using clear mascara, with mixed results on coarse brows.",
      },
      {
        title: "Sunscreen Under Makeup Pilling Tests",
        product: "SPF 50 primer",
        creator: "@dermdaily",
        summary:
          "Derm creators layer sunscreens under foundation and rub the back of the hand to show which ones pill.",
      },
    ],
  },
  {
    start: 50,
    days: [44, 45, 46, 47, 48, 49],
    seeds: [
      {
        title: "Summer Lip Liner Shades Ranked by Makeup Artists",
        product: "Lip liners",
        creator: "@mua.dani",
        summary: "Artists ranked the season’s most requested liner shades, and warm browns took most of the top spots.",
        merged: 3,
      },
      {
        title: "Brow Tinting Gone Wrong Recovery Videos",
        product: "Brow tint",
        creator: "@browsbyjade",
        summary:
          "Creators share how they rescued too-dark brow tints, with brow glue used to hold hairs while it fades.",
      },
      {
        title: "Blush Placement for Round Faces",
        product: "Cream blush",
        creator: "@facemapping",
        summary: "Face-shape tutorials are back, and round-face blush placement videos are getting the most stitches.",
      },
      {
        title: "Pool Day Makeup That Stays Put",
        product: "Waterproof mascara",
        creator: "@poolsidepaige",
        summary: "Creators jump in the pool in full makeup and grade the waterproof claims when they surface.",
      },
      {
        title: "Monochrome Makeup With One Product",
        product: "Multi-stick",
        creator: "@onepotbeauty",
        summary:
          "One-product looks use the same stick on eyes, cheeks and lips, and creators vote on which shades flatter most.",
      },
      {
        title: "Budget Dupes for Viral Setting Powder",
        product: "Setting powder",
        creator: "@dupequeen",
        summary:
          "Creators test four drugstore powders against the viral prestige one with flash photos and a six-hour check.",
      },
    ],
  },
];

export const PAST_THEMES: PastTheme[] = WEEKS.flatMap(({ start, days, seeds }, weekIndex) =>
  seeds.map((seed, index) => {
    const base = GRID_THEMES.find((theme) => theme.id === seed.openId) ?? GRID_THEMES[(weekIndex + index) % 4];
    const lead = GRID_THEMES[(weekIndex * 2 + index) % 4].posts[index % 3];
    const scale = Math.max(0.12, 0.7 - weekIndex * 0.08 - index * 0.06);
    const id = `past-${weekIndex}-${index}`;
    return {
      id,
      daysAgo: days[index],
      date: dayLabel(days[index]),
      week: `Week of ${dayLabel(start)}`,
      merged: seed.merged,
      openId: seed.openId,
      theme: {
        ...base,
        id,
        title: seed.title,
        summary: seed.summary,
        posts: [{ ...lead, handle: seed.creator }, ...base.posts],
        stats: {
          posts: Math.round(140 * scale),
          views: Math.round(2_100_000 * scale),
          engagement: Math.round(210_000 * scale),
        },
      },
    };
  }),
);
