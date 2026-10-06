import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { InsightsNav } from "./ChatInsights";
import { AssistantBubble, UserBubble } from "./chat-ui";
import { chatAssets } from "./chat-assets";
import { FILTER_GROUPS, FiltersMenu, Menu, SORT_OPTIONS } from "./FeedControls";
import { sentenceHeadline, ThemeChat } from "./Newsfeed";
import { NewsfeedPost, type OpenPost } from "./NewsfeedPost";
import { catalog, PostCard, type CatalogPost } from "./PageStyle";
import type { PostId } from "./posts";
import { GRID_THEMES, Votes, type GridTheme } from "./ThemeGrid";
import type { StoryLayout } from "./PrototypeNav";
import "./chat.css";
import "./page-style.css";
import "./story-chat.css";

type Brief = {
  tag: string;
  crumb: string;
  title: string;
  overall: string;
  chart: string;
  axes: [string, string, string, string, string];
  lead: string;
  points: { label: string; body: string }[];
  related: { text: string; hint: string }[];
};

const BRIEFS: Record<string, Brief> = {
  nyx: {
    tag: "Positive use-case",
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
      {
        text: "Who’s driving this conversation?",
        hint: "Top creators, accounts and platforms behind the volume",
      },
      {
        text: "What’s the sentiment on hold vs stiffness?",
        hint: "Splits praise for lift from the stiffness complaints",
      },
      {
        text: "How does this compare to other brow gels?",
        hint: "Drugstore and prestige gels mentioned alongside it",
      },
      {
        text: "Any complaints I should flag?",
        hint: "Negative posts worth a look before you share",
      },
    ],
  },
  vb: {
    tag: "Event moment",
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
      {
        text: "Which glosses are artists pairing with Portofino ’97 most often?",
        hint: "The combos that show up in the most posts",
      },
      {
        text: "How does the liner hold up in wedding-day wear tests?",
        hint: "All-day tests compared with night-out wear",
      },
      {
        text: "Are creators flagging feathering on any lip shapes?",
        hint: "Complaints grouped by lip shape and skin tone",
      },
      {
        text: "Which bridal artists are driving the all-day wear claim?",
        hint: "Artists and accounts behind the volume",
      },
    ],
  },
  anne: {
    tag: "Brand safety",
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
      {
        text: "Which drugstore shadows are standing in for the originals?",
        hint: "Shade swaps creators recommend most",
      },
      {
        text: "How closely do tutorials match the red-carpet placement?",
        hint: "Where recreations drift from the original look",
      },
      {
        text: "Is this a one-look trend or a brown-shadow revival?",
        hint: "Whether posts reference the look or the color",
      },
      {
        text: "Which editors started the breakdown?",
        hint: "The first posts everyone is recreating",
      },
    ],
  },
  lulu: {
    tag: "Mixed launch",
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
      {
        text: "What are instructors changing when they stitch the class?",
        hint: "Cueing, pacing and music swaps in duets",
      },
      {
        text: "How often does the “no distractions” line get called out?",
        hint: "Share of posts pushing back on the tagline",
      },
      {
        text: "Is the series being read as a class, or as a brand mood?",
        hint: "Workout posts compared with aesthetic posts",
      },
      {
        text: "Which instructors are driving the stitches?",
        hint: "Accounts amplifying the series the most",
      },
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

const STORY_FOLD_GAP = 32;

const icon = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;
function StoryVideos({ theme, blockBack }: { theme: GridTheme; blockBack: { current: boolean } }) {
  const all = useMemo(() => catalog(theme), [theme]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [menu, setMenu] = useState<"sort" | "filters" | null>(null);
  const [reported, setReported] = useState(false);
  const [sort, setSort] = useState<SortId>("Views");
  const [filters, setFilters] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number>();

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const scroll = grid?.closest<HTMLElement>(".story-chat-scroll");
    if (!grid || !scroll) return;
    const fit = () => {
      const top = grid.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
      setGridHeight(Math.max(360, Math.round(scroll.clientHeight - top - STORY_FOLD_GAP)));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(scroll);
    return () => observer.disconnect();
  }, []);

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
    <section className="story-chat-videos" aria-label="Top posts">
      <div className="ps-bar nf-controls">
        <h2 className="story-posts-title">Top posts</h2>
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
        <button type="button" className="nf-control" aria-pressed={reported} onClick={() => setReported(!reported)}>
          <span className="nf-control-icon">
            <img src={icon("icon-track.svg")} alt="" width={16} height={16} />
          </span>
          {reported ? "Report created" : "Generate custom report"}
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
        <div ref={gridRef} className="ps-grid story-posts" style={{ height: gridHeight }}>
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
          onNext={openIndex !== null && openIndex < posts.length - 1 ? () => setOpenIndex(openIndex + 1) : undefined}
        />
      ) : null}
    </section>
  );
}

function StoryModal({
  theme,
  brief,
  stats,
  vote,
  onVote,
  blockBack,
  onClose,
}: {
  theme: GridTheme;
  brief: Brief;
  stats: ReactNode;
  vote: "up" | "down" | null;
  onVote: (next: "up" | "down") => void;
  blockBack: { current: boolean };
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState<{ id: number; text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (thread.length && scroll) scroll.scrollTo({ top: scroll.scrollHeight, behavior: "smooth" });
  }, [thread.length]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    setThread((current) => [...current, { id: Date.now(), text }]);
    setDraft("");
  };

  return (
    <div className="story-modal-backdrop" onClick={onClose}>
      <div
        className="story-modal"
        role="dialog"
        aria-modal="true"
        aria-label={brief.crumb}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="story-modal-bar">
          <div className="story-modal-tools">
            <span className="story-modal-brand">
              <img src={icon("plot-logo.png")} alt="" />
              Plot AI
            </span>
            <button type="button" className="story-modal-icon" aria-label="New chat">
              <img src={icon("icon-new-chat.svg")} alt="" />
            </button>
            <button type="button" className="story-modal-icon" aria-label="Chat history">
              <img src={icon("icon-messages.svg")} alt="" />
            </button>
          </div>
          <p className="story-modal-title">Story: {brief.crumb}</p>
          <div className="story-modal-tools is-end">
            <button type="button" className="story-chat-share">
              <img src={chatAssets.buildings} alt="" />
              Share
            </button>
            <button type="button" className="story-modal-icon" aria-label="More options">
              <img src={chatAssets.more} alt="" />
            </button>
            <span className="story-modal-divider" aria-hidden="true" />
            <button type="button" className="story-modal-close" aria-label="Close" onClick={onClose}>
              <img src={icon("icon-close.svg")} alt="" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="story-modal-scroll">
          <article className="story-modal-doc">
            <div className="story-chat-title">
              <div className="story-chat-meta">
                <p>Last updated {theme.ago}</p>
                <Votes vote={vote} onVote={onVote} />
              </div>
              <h1>{sentenceHeadline(theme.title, theme.id)}</h1>
            </div>
            <div className="story-modal-sources">
              <span>
                Sources
                <strong>
                  {theme.stats.posts} <small>posts analyzed</small>
                </strong>
              </span>
              <span className="story-modal-thumbs">
                {theme.posts.slice(0, 3).map((post) => (
                  <img key={post.src} src={post.src} alt="" />
                ))}
              </span>
            </div>
            <p className="story-chat-why">{theme.summary}</p>
            {stats}
            <StoryVideos theme={theme} blockBack={blockBack} />
            {thread.map((item) => (
              <div key={item.id} className="story-modal-turn">
                <UserBubble text={item.text} />
                <AssistantBubble text={theme.summary} />
              </div>
            ))}
          </article>
        </div>

        <div className="story-modal-dock">
          <form
            className="story-modal-ask"
            onSubmit={(event) => {
              event.preventDefault();
              ask(draft);
            }}
          >
            <img src={chatAssets.avatarRhea} alt="" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a follow-up"
              aria-label="Ask a follow-up"
            />
            <button type="submit" aria-label="Send" disabled={!draft.trim()}>
              <img src={chatAssets.sendPill} alt="" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function StoryChat({ themeId, layout, onBack }: { themeId: string; layout: StoryLayout; onBack: () => void }) {
  const theme = GRID_THEMES.find((item) => item.id === themeId) ?? GRID_THEMES[0];
  const brief = BRIEFS[theme.id] ?? BRIEFS.nyx;
  const asks = brief.related.map(({ text }) => ({
    text,
    reply: theme.summary,
  }));
  const [draft, setDraft] = useState("");
  const [chat, setChat] = useState<{
    id: string;
    question?: { text: string; reply: string };
  } | null>(layout === "side" ? { id: "welcome" } : null);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
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

  const stats = (
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
  );

  if (layout === "modal") {
    return (
      <StoryModal
        theme={theme}
        brief={brief}
        stats={stats}
        vote={vote}
        onVote={(next) => setVote(vote === next ? null : next)}
        blockBack={blockBack}
        onClose={onBack}
      />
    );
  }

  return (
    <div className="chat-lab">
      <div className={`chat-insights story-chat is-${layout}${chat ? " has-chat" : ""}`}>
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

          <div className="story-chat-body">
            <div className="story-chat-content">
              <div className="story-chat-scroll">
                <article className="story-chat-answer">
                  <div className="story-chat-title">
                    <div className="story-chat-meta">
                      <p>Last updated {theme.ago}</p>
                      <Votes vote={vote} onVote={(next) => setVote(vote === next ? null : next)} />
                    </div>
                    <h1>{sentenceHeadline(theme.title, theme.id)}</h1>
                  </div>
                  <p className="story-chat-why">{theme.summary}</p>
                  {stats}
                </article>

                <StoryVideos theme={theme} blockBack={blockBack} />
              </div>

              <div className="story-chat-dock" hidden={chat !== null}>
                <div className="follow-q-chips story-chat-suggest" aria-label="Suggested questions">
                  {brief.related.map((question) => (
                    <button
                      key={question.text}
                      type="button"
                      className="follow-q-chip"
                      onClick={() => ask(question.text)}
                    >
                      {question.text}
                    </button>
                  ))}
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
              </div>
            </div>
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
    </div>
  );
}
