import { useState, type CSSProperties } from "react";
import { assets } from "./assets";
import { CommentThemes } from "./CommentSummary";
import { ThemeFeedbackCard } from "./Newsfeed";
import { InstagramIcon, type CatalogPost } from "./PageStyle";
import type { Theme } from "./posts";
import { SentimentScore } from "./SentimentScore";
import { ThemeCard, type GridTheme } from "./ThemeGrid";

const ARROW = `${import.meta.env.BASE_URL}assets/newsfeed/icon-arrow-right.svg`;

const CREATOR_NAMES: Record<string, string> = {
  uhodom_edinym: "Uliana Domrachyova",
  glowbymaya: "Maya Okafor",
  vbbeauty: "Victoria Bennett",
  katiadoesmakeup: "Katia Morales",
  allure: "Allure Magazine",
  "studio.mua": "Studio MUA",
  lululemon: "lululemon",
  lewishamilton: "Lewis Hamilton",
};

type Tone = "positive" | "neutral" | "negative";

type CommentTheme = {
  tone: Tone;
  headline: string;
  count: number;
  comments: [handle: string, text: string, likes: number][];
};

type Sentiment = {
  comments: number;
  split: Record<Tone, number>;
  themes: CommentTheme[];
};

const SENTIMENT: Record<string, Sentiment> = {
  nyx: {
    comments: 3412,
    split: { positive: 78, neutral: 14, negative: 8 },
    themes: [
      {
        tone: "positive",
        headline: "Most commenters say the hold lasts all day, even through long shifts and humid weather.",
        count: 1420,
        comments: [
          ["maddyglam", "Wore it through a 12 hour shift and my brows didn’t move once.", 1204],
          ["browsbybri", "Finally a gel that survives Houston humidity.", 431],
        ],
      },
      {
        tone: "neutral",
        headline: "People ask how it compares to the laminating gel and whether the formula is the same.",
        count: 386,
        comments: [
          ["beautybyjo", "Is this the same as the laminating gel or a different formula?", 342],
          ["sam.tries.it", "Which one do I buy if I already have the clear one?", 97],
        ],
      },
      {
        tone: "negative",
        headline: "A small group says brows feel stiff or crunchy by the afternoon.",
        count: 214,
        comments: [
          ["sparsebrowclub", "Holds great but it goes crunchy by the afternoon for me.", 188],
          ["finebrowgirl", "Too stiff for thin brows, they look glued down.", 64],
        ],
      },
    ],
  },
  vb: {
    comments: 2186,
    split: { positive: 71, neutral: 21, negative: 8 },
    themes: [
      {
        tone: "positive",
        headline: "Brides and artists say the liner lasts through ceremonies, photos and the dance floor.",
        count: 902,
        comments: [
          ["bridebyrae", "This is the only liner that survived my ceremony and the dance floor.", 986],
          ["mua.jess", "My go-to for every bride this season.", 312],
        ],
      },
      {
        tone: "neutral",
        headline: "Commenters want to know if the shade works on deeper skin tones.",
        count: 341,
        comments: [
          ["glamwithnia", "Would this work on deeper skin tones or is it too pink?", 411],
          ["kiki.beats", "Swatches on darker skin please!", 150],
        ],
      },
      {
        tone: "negative",
        headline: "Some say the price is hard to justify for a single liner.",
        count: 128,
        comments: [
          ["budgetbeauty", "Gorgeous, but hard to justify the price for one liner.", 203],
          ["dupe.hunter", "Anyone found a dupe yet?", 88],
        ],
      },
    ],
  },
  anne: {
    comments: 1740,
    split: { positive: 66, neutral: 26, negative: 8 },
    themes: [
      {
        tone: "positive",
        headline: "Viewers say the look is easy to recreate with drugstore palettes.",
        count: 684,
        comments: [
          ["dupequeen", "Did this with a $6 palette and got stopped twice at work.", 1531],
          ["eyes.by.em", "Tried it tonight, so easy.", 204],
        ],
      },
      {
        tone: "neutral",
        headline: "Many ask for the exact shades used in each step.",
        count: 402,
        comments: [
          ["lashesbylo", "Can you list the exact shades? I can’t find the middle one.", 276],
          ["newtomakeup", "What brush is that for the crease?", 81],
        ],
      },
      {
        tone: "negative",
        headline: "A few say brown-on-brown looks muddy on hooded eyes.",
        count: 118,
        comments: [
          ["hoodedhelp", "Brown on brown just looks muddy on hooded eyes.", 144],
          ["rosie.tries", "Mine turned out way too dark.", 39],
        ],
      },
    ],
  },
  lulu: {
    comments: 1208,
    split: { positive: 62, neutral: 22, negative: 16 },
    themes: [
      {
        tone: "positive",
        headline: "Instructors love the pacing and say they’ll use the flow in their own classes.",
        count: 488,
        comments: [
          ["pilateswithem", "The pacing on this flow is perfect, stealing it for my 7am class.", 812],
          ["core.with.cam", "Rooftop classes are everything.", 140],
        ],
      },
      {
        tone: "neutral",
        headline: "People ask which leggings and tops are shown in the videos.",
        count: 214,
        comments: [
          ["studiostyle", "Are these the Align leggings or the new line?", 190],
          ["fitbyana", "Link the top please!", 72],
        ],
      },
      {
        tone: "negative",
        headline: "Some call the “no distractions” caption preachy for a brand post.",
        count: 176,
        comments: [
          ["realtalkfit", "The “no distractions” caption feels a bit preachy for an ad.", 367],
          ["yoga.rants", "Says the brand selling me a new outfit.", 121],
        ],
      },
    ],
  },
};

const TONE_DOT: Record<Tone, string> = {
  positive: assets.themeDotGreen,
  neutral: assets.themeDot1,
  negative: assets.themeDot2,
};

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return String(value);
}

export function TopCreators({ posts, onOpenPost }: { posts: CatalogPost[]; onOpenPost: (post: CatalogPost) => void }) {
  const byHandle = new Map<string, { handle: string; views: number; top: CatalogPost }>();
  posts.forEach((post) => {
    const entry = byHandle.get(post.handle) ?? { handle: post.handle, views: 0, top: post };
    entry.views += post.views;
    if (post.views > entry.top.views) entry.top = post;
    byHandle.set(post.handle, entry);
  });
  const creators = [...byHandle.values()].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <section className="ps-creators-section" aria-labelledby="ps-creators-title">
      <header className="ps-panel-head">
        <h2 id="ps-creators-title">Top creators</h2>
        <p>Ranked by views in this theme</p>
      </header>
      <ol className="ps-creators">
        {creators.map((creator, index) => {
          const handle = creator.handle.replace(/^@/, "");
          return (
            <li key={handle}>
              <img className="ps-avatar" src={assets.avatars[index % assets.avatars.length]} alt="" />
              <span className="ps-creator-copy">
                <strong>{CREATOR_NAMES[handle] ?? handle}</strong>
                <span className="ps-creator-handle">
                  <InstagramIcon />
                  <span>@{handle}</span>
                </span>
              </span>
              <span className="ps-creator-side">
                <span className="ps-creator-followers">{compact(Math.round(creator.views * 3.1))} followers</span>
                <button type="button" className="ps-creator-link" onClick={() => onOpenPost(creator.top)}>
                  View post
                  <span
                    className="tg-sources-arrow"
                    style={{ "--tg-arrow": `url(${ARROW})` } as CSSProperties}
                    aria-hidden="true"
                  />
                </button>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function CommentSentiment({ theme }: { theme: GridTheme }) {
  const data = SENTIMENT[theme.id] ?? SENTIMENT.nyx;
  const [openThread, setOpenThread] = useState<string | null>(null);
  const score = Math.round((data.split.positive + data.split.neutral / 2) / 10);
  const rows: Theme[] = data.themes.map((item, index) => ({
    id: `${theme.id}-${item.tone}`,
    label: item.tone,
    headline: item.headline,
    dot: TONE_DOT[item.tone],
    count: item.count,
    comments: item.comments.map(([handle, text, likes], offset) => ({
      avatar: assets.avatars[(index * 2 + offset) % assets.avatars.length],
      name: handle,
      time: "2 days ago",
      text,
      likes: `${compact(likes)} likes`,
      replies: `${Math.max(1, Math.round(likes / 14))} replies`,
    })),
  }));

  return (
    <article className="card comment-card ps-comment-card" aria-labelledby="ps-sentiment-title">
      <div className="comment-head">
        <div>
          <h2 className="section-title" id="ps-sentiment-title">
            What people are saying
          </h2>
          <p className="comment-meta">
            {data.comments.toLocaleString()} comments across this theme, last pulled today, 8:00am
          </p>
        </div>
        <SentimentScore score={score} mode="score" sentiment={data.split} tone={score >= 7 ? "positive" : "mixed"} />
      </div>
      <CommentThemes rows={rows} openThread={openThread} onOpen={setOpenThread} onClose={() => setOpenThread(null)} />
    </article>
  );
}

export function ThemeFeedback({ theme }: { theme: GridTheme }) {
  return <ThemeFeedbackCard theme={theme} />;
}

export function DiscoverMore({ themes, onOpen }: { themes: GridTheme[]; onOpen: (theme: GridTheme) => void }) {
  return (
    <section className="ps-discover" aria-labelledby="ps-discover-title">
      <h2 id="ps-discover-title">Discover more</h2>
      <div className="ps-discover-grid">
        {themes.map((theme, index) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            variant="gray"
            seed={index + 3}
            layout="split"
            onOpen={() => onOpen(theme)}
          />
        ))}
      </div>
    </section>
  );
}
