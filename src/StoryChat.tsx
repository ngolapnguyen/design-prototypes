import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { InsightsNav } from "./ChatInsights";
import { chatAssets } from "./chat-assets";
import { FILTER_GROUPS, FiltersMenu, Menu, SORT_OPTIONS } from "./FeedControls";
import { ThemeChat } from "./Newsfeed";
import { NewsfeedPost, type OpenPost } from "./NewsfeedPost";
import { catalog, PostCard, type CatalogPost } from "./PageStyle";
import type { PostId } from "./posts";
import { GRID_THEMES, ThemeFeature, type GridTheme } from "./ThemeGrid";
import "./chat.css";
import "./page-style.css";
import "./story-chat.css";

const RELATED_META: Record<string, { tag: string; living: string }> = {
  nyx: { tag: "Unique Use", living: "Ongoing 8 days · +40% vs last week · Now relevant again" },
  vb: { tag: "Event", living: "Ongoing 8 days · +18% vs last week · Now relevant again" },
  anne: { tag: "Brand Safety", living: "Ongoing 8 days · +9% vs last week · Now relevant again" },
  lulu: { tag: "Launch", living: "Ongoing 9 days · +27% vs last week · Now relevant again" },
};

const texture = (name: string) => `url(${import.meta.env.BASE_URL}assets/textures/${name})`;

const RELATED_TEXTURES = {
  "--tex-hero": texture("hero-starburst.png"),
  "--tex-1": texture("grain-blue.jpg"),
  "--tex-2": texture("grain-lime.jpg"),
  "--tex-3": texture("grain-pink.jpg"),
} as CSSProperties;

type Brief = {
  crumb: string;
  title: string;
  overall: string;
  chart: string;
  axes: [string, string, string, string, string];
  lead: string;
  points: { label: string; body: string }[];
  related: string[];
};

const BRIEFS: Record<string, Brief> = {
  nyx: {
    crumb: "Sentiment towards NYX Brow Glue",
    title: "Gen Z’s sentiment towards NYX Brow Glue",
    overall: "Positive",
    chart: "Brow Glue sentiment analysis",
    axes: ["Hold", "Lift", "Stiffness", "Wear time", "Application"],
    lead: "Creators are treating Brow Glue as the lift product that stays put through a full day. Key takeaways:",
    points: [
      {
        label: "Hold",
        body: "Application demos show a laminated, fluffy brow that doesn’t droop, and the “crazy lift” line is the one people repeat.",
      },
      {
        label: "Feel",
        body: "A smaller set of reviews call out stiffness once the product sets, usually next to a removal hack at the end of the day.",
      },
      {
        label: "Wear",
        body: "Long-wear claims hold up in all-day tests. Drugstore brow gels show up as a different job, not a straight swap.",
      },
      {
        label: "Who’s driving it",
        body: "Short application clips from a handful of beauty creators are carrying most of the volume on TikTok and Instagram.",
      },
    ],
    related: [
      "Which Brow Glue complaints show up once the product has set?",
      "How does the lift compare with brow soap in the same tutorials?",
      "Are drugstore brow gels being positioned as dupes, or as a different job?",
      "Which creators are driving the long-wear claim?",
    ],
  },
  vb: {
    crumb: "Sentiment towards Portofino ’97",
    title: "Bridal sentiment towards Portofino ’97",
    overall: "Positive",
    chart: "Portofino ’97 sentiment analysis",
    axes: ["Color payoff", "Longevity", "Feathering", "Comfort", "Wedding-day wear"],
    lead: "Brides and makeup artists are building the wedding-day lip around one liner. Key takeaways:",
    points: [
      {
        label: "The combo",
        body: "Portofino ’97 is paired with glossy nudes, and artists call it the one combination that survives a full wedding day.",
      },
      {
        label: "Payoff",
        body: "Swatches focus on how the liner reads on deeper skin tones and how little it feathers once the gloss goes on.",
      },
      {
        label: "Wear",
        body: "All-day wear is the claim that gets repeated, mostly in get-ready-with-me videos rather than still reviews.",
      },
      {
        label: "Who’s driving it",
        body: "Bridal artists and a few beauty creators account for most of the posts, with Victoria Beckham named in the caption.",
      },
    ],
    related: [
      "Which glosses are artists pairing with Portofino ’97 most often?",
      "How does the liner hold up in wedding-day wear tests versus a night out?",
      "Are creators flagging feathering on any particular lip shapes?",
      "Which bridal artists are driving the all-day wear claim?",
    ],
  },
  anne: {
    crumb: "Sentiment towards the brown eye look",
    title: "How creators read Anne Hathaway’s brown eye",
    overall: "Positive",
    chart: "Brown eye sentiment analysis",
    axes: ["Accuracy", "Shade match", "Ease", "Drugstore swaps", "Longevity"],
    lead: "The red-carpet look is turning into a tutorial format. Key takeaways:",
    points: [
      {
        label: "The look",
        body: "Editors break down the monochrome brown eye and soft updo, and creators recreate it step by step.",
      },
      {
        label: "Swaps",
        body: "Drugstore shade matches are the useful part of the conversation. People want the color, not the exact product.",
      },
      {
        label: "Difficulty",
        body: "Most tutorials call the look achievable. A few note the blend takes longer than the caption suggests.",
      },
      {
        label: "Who’s driving it",
        body: "Beauty editors start the thread, and creator tutorials carry it onto TikTok and Instagram.",
      },
    ],
    related: [
      "Which drugstore shadows are standing in for the original shades?",
      "How closely do the tutorials match the red-carpet placement?",
      "Are creators treating this as a one-look trend or a brown-shadow revival?",
      "Which editors started the breakdown that everyone is recreating?",
    ],
  },
  lulu: {
    crumb: "Sentiment towards the Summer Series",
    title: "Sentiment towards Lululemon’s Summer Series",
    overall: "Mixed",
    chart: "Summer Series sentiment analysis",
    axes: ["Pacing", "Inclusivity", "Music", "Tagline", "Instructor response"],
    lead: "The rooftop Pilates series is being stitched more than it is being reviewed. Key takeaways:",
    points: [
      {
        label: "Pacing",
        body: "Instructors who stitch the class like the pacing and keep the original audio underneath their own cueing.",
      },
      {
        label: "The line",
        body: "A smaller set calls out the “no distractions” tagline as a little much, usually in the caption rather than on camera.",
      },
      {
        label: "Format",
        body: "The posts that travel are stitches and duets, not the owned rooftop cut on its own.",
      },
      {
        label: "Who’s driving it",
        body: "Pilates instructors are the audience amplifying it, with Lululemon named as the source of the class.",
      },
    ],
    related: [
      "What are instructors changing when they stitch the rooftop class?",
      "How often does the “no distractions” line get called out?",
      "Is the series being read as a class, or as a brand mood?",
      "Which instructors are driving the stitches?",
    ],
  },
};

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

const THEME_SORTS = [
  "Views",
  "Recency",
  "Likes",
  "Comments",
  "Engagement rate",
  "Total engagement",
  "Follower count",
] as const satisfies readonly (typeof SORT_OPTIONS)[number][];

type SortId = (typeof THEME_SORTS)[number];

const THEME_FILTER_GROUPS = FILTER_GROUPS.filter((group) =>
  ["platform", "sentiment", "followers", "organic"].includes(group.id),
);

const icon = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;

function StoryVideos({ theme, blockBack }: { theme: GridTheme; blockBack: { current: boolean } }) {
  const all = useMemo(() => catalog(theme), [theme]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [menu, setMenu] = useState<"sort" | "filters" | null>(null);
  const [sort, setSort] = useState<SortId>("Views");
  const [filters, setFilters] = useState<string[]>([]);

  const posts = useMemo(() => {
    const selectedPlatforms = [
      filters.includes("Instagram") ? "Instagram" : null,
      filters.includes("TikTok") ? "TikTok" : null,
      filters.includes("YouTube Shorts") ? "YouTube" : null,
    ].filter(Boolean) as CatalogPost["platform"][];
    return all
      .filter((post) => (selectedPlatforms.length ? selectedPlatforms.includes(post.platform) : true))
      .slice()
      .sort((a, b) => {
        if (sort === "Recency") return a.dayOffset - b.dayOffset;
        if (sort === "Views") return b.views - a.views;
        if (sort === "Likes") return b.likes - a.likes;
        if (sort === "Comments") return b.comments - a.comments;
        if (sort === "Engagement rate") return b.engagement - a.engagement;
        if (sort === "Total engagement") return b.likes + b.comments - (a.likes + a.comments);
        if (sort === "Follower count") return b.views - a.views;
        return a.location.localeCompare(b.location);
      });
  }, [all, sort, filters]);

  blockBack.current = openIndex !== null;
  const open = openIndex !== null ? posts[openIndex] : null;

  const openPost = (post: CatalogPost): OpenPost => {
    const index = all.findIndex((item) => item.id === post.id);
    return {
      postId: (index % 2 === 0 ? "1" : "2") as PostId,
      title: post.title,
      source: theme.title,
    };
  };

  return (
    <section className="story-chat-videos" aria-label="Posts">
      <div className="ps-bar nf-controls">
        <h2 className="ps-section-title">Posts</h2>
        <button
          type="button"
          className={menu === "sort" ? "nf-control is-open" : "nf-control"}
          aria-expanded={menu === "sort"}
          onClick={() => setMenu(menu === "sort" ? null : "sort")}
        >
          <span className="nf-control-icon">
            <img src={icon("icon-sort.svg")} alt="" width={16} height={16} />
          </span>
          <span>
            Sort by <strong>{sort}</strong>
          </span>
          <img className="nf-caret" src={icon("icon-caret.svg")} alt="" width={16} height={16} />
        </button>
        <button
          type="button"
          className={menu === "filters" ? "nf-control is-open" : "nf-control"}
          aria-expanded={menu === "filters"}
          onClick={() => setMenu(menu === "filters" ? null : "filters")}
        >
          <span className="nf-control-icon">
            <img src={icon("icon-filter.svg")} alt="" width={16} height={16} />
          </span>
          Posts filters
          {filters.length ? <span className="nf-control-count">{filters.length}</span> : null}
          <img className="nf-caret" src={icon("icon-caret.svg")} alt="" width={16} height={16} />
        </button>
        {menu === "sort" ? (
          <Menu
            label="Sort"
            className="is-sort"
            variant="check"
            options={THEME_SORTS}
            value={sort}
            onPick={(value) => {
              setSort(value);
              setMenu(null);
            }}
          />
        ) : null}
        {menu === "filters" ? (
          <FiltersMenu groups={THEME_FILTER_GROUPS} selected={filters} onChange={setFilters} />
        ) : null}
      </div>
      {posts.length === 0 ? <p className="ps-empty">No posts match these filters.</p> : null}
      {posts.length ? (
        <div className="ps-grid">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} onOpen={() => setOpenIndex(index)} />
          ))}
        </div>
      ) : null}
      {open ? (
        <NewsfeedPost
          post={openPost(open)}
          onClose={() => setOpenIndex(null)}
          onAction={() => undefined}
          onPrev={openIndex && openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined}
          onNext={
            openIndex !== null && openIndex < posts.length - 1 ? () => setOpenIndex(openIndex + 1) : undefined
          }
        />
      ) : null}
    </section>
  );
}

export function StoryChat({
  themeId,
  onBack,
  onOpenTheme,
}: {
  themeId: string;
  onBack: () => void;
  onOpenTheme: (id: string) => void;
}) {
  const theme = GRID_THEMES.find((item) => item.id === themeId) ?? GRID_THEMES[0];
  const brief = BRIEFS[theme.id] ?? BRIEFS.nyx;
  const related = GRID_THEMES.filter((item) => item.id !== theme.id);
  const asks = brief.related.map((text) => ({ text, reply: theme.summary }));
  const [draft, setDraft] = useState("");
  const [chat, setChat] = useState<{ id: string; question?: { text: string; reply: string } } | null>(null);
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const [tracked, setTracked] = useState<string[]>([]);
  const blockBack = useRef(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || blockBack.current) return;
      if (chat) {
        setChat(null);
        return;
      }
      onBack();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onBack, chat]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    setChat({ id: `${Date.now()}`, question: { text, reply: theme.summary } });
    setDraft("");
  };

  return (
    <div className="chat-lab">
      <div className="chat-insights story-chat">
        <InsightsNav />
        <div className="story-chat-main">
          <header className="story-chat-bar">
            <div className="story-chat-crumbs">
              <button type="button" className="story-chat-back" onClick={onBack} aria-label="Back to newsfeed">
                <img src={chatAssets.arrowLeft} alt="" />
              </button>
              <p>
                <span>Anthropologie</span>
                <span aria-hidden="true">/</span>
                <strong>{brief.crumb}</strong>
              </p>
            </div>
            <div className="story-chat-bar-actions">
              <button type="button" className="story-chat-share">
                <img src={chatAssets.buildings} alt="" />
                Share
              </button>
              <button type="button" className="story-chat-more" aria-label="More options">
                <img src={chatAssets.more} alt="" />
              </button>
            </div>
          </header>

          <div className="story-chat-scroll">
            <article className="story-chat-answer">
              <h1>{theme.title}</h1>
              <p className="story-chat-why">{theme.summary}</p>
              <div className="ps-stats">
                <span>
                  <strong>
                    {theme.stats.posts}
                    <span aria-hidden="true">🔥</span>
                  </strong>
                  Posts
                </span>
                <span>
                  <strong>
                    {compact(theme.stats.views)}
                    <span aria-hidden="true">👀</span>
                  </strong>
                  View count
                </span>
                <span>
                  <strong>
                    {compact(theme.stats.engagement)}
                    <span aria-hidden="true">👀</span>
                  </strong>
                  Total engagement
                </span>
              </div>
            </article>

            <StoryVideos theme={theme} blockBack={blockBack} />

            <article className="story-chat-answer is-related">
              <div className="story-chat-rule" />

              <section className="story-chat-related" aria-label="Related themes">
                <h2>Related themes</h2>
                <div className="story-chat-themes" style={RELATED_TEXTURES}>
                  {related.map((item) => {
                    const meta = RELATED_META[item.id];
                    return (
                      <ThemeFeature
                        key={item.id}
                        theme={item}
                        stage="single"
                        tag={meta?.tag}
                        living={meta?.living}
                        tracked={tracked.includes(item.id)}
                        vote={votes[item.id] ?? null}
                        onOpen={() => onOpenTheme(item.id)}
                        onTrack={() =>
                          setTracked((current) =>
                            current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id],
                          )
                        }
                        onVote={(next) =>
                          setVotes((current) => {
                            if (current[item.id] === next) {
                              const copy = { ...current };
                              delete copy[item.id];
                              return copy;
                            }
                            return { ...current, [item.id]: next };
                          })
                        }
                      />
                    );
                  })}
                </div>
              </section>
            </article>
          </div>

          <form
            className="story-chat-composer"
            onSubmit={(event) => {
              event.preventDefault();
              ask(draft);
            }}
          >
            <label>
              <img src={chatAssets.avatarRhea} alt="" />
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask a follow-up"
                aria-label="Ask a follow-up"
              />
            </label>
            <button type="submit" aria-label="Send" disabled={!draft.trim()}>
              <img src={chatAssets.sendPill} alt="" />
            </button>
          </form>
          {chat ? (
            <ThemeChat
              key={chat.id}
              theme={theme}
              question={chat.question}
              suggestions={asks}
              onClose={() => setChat(null)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
