import { useMemo, useRef, useState, type CSSProperties } from "react";
import { assets } from "./assets";
import { DEFAULT_FILTERS, FiltersMenu, Menu, SORT_OPTIONS, TIME_OPTIONS } from "./FeedControls";
import { ClipPlay } from "./Homepage";
import { PlotTopBar, ThemeChat } from "./Newsfeed";
import { NewsfeedPost, type OpenPost } from "./NewsfeedPost";
import type { PostId } from "./posts";
import { GRID_THEMES, type GridTheme } from "./ThemeGrid";
import { CommentSentiment, DiscoverMore, ThemeFeedback, TopCreators } from "./ThemeSections";
import "./homepage.css";
import "./newsfeed.css";
import "./page-style.css";

const POST_COUNT = 23;
const PREVIEW_COUNT = 8;
const PAGE_SIZE = 10;
const THEME_SUMMARY =
  "Creators are showcasing the NYX The Brow Glue product, emphasizing its strong hold and ability to defy droopiness for lifted, laminated, and fluffy brows. The product is praised for its long-lasting performance, keeping brows styled in place all day, and its ease of application with the built-in brush.";
type AskPrompt = { text: string; reply: string };

const NYX_PROMPTS: AskPrompt[] = [
  {
    text: "Who’s driving this conversation?",
    reply:
      "Mostly mid-size beauty creators. @uhodom_edinym, @glowbymaya and @vbbeauty account for about 40% of the views, and most of them posted in the last 48 hours.",
  },
  {
    text: "What’s the sentiment on hold vs stiffness?",
    reply:
      "About 8 in 10 comments praise the hold. The stiffness complaints are a small group, mostly from people with fine or sparse brows.",
  },
  {
    text: "How does this compare to other brow gels?",
    reply:
      "Creators rank it above most drugstore gels for hold. The main comparison is to laminating gels, which people describe as softer but less long-lasting.",
  },
  {
    text: "Any complaints I should flag?",
    reply:
      "Two to watch: a few people say it flakes by the end of the day, and some find the brush too big for short brows. Neither is growing fast yet.",
  },
];

const ASK_PROMPTS: Record<string, AskPrompt[]> = {
  nyx: NYX_PROMPTS,
  vb: [
    {
      text: "Who’s driving this conversation?",
      reply:
        "Bridal makeup artists lead it. @glowbymaya and @vbbeauty posted the most-viewed combos, and brides are resharing them in wedding-planning groups.",
    },
    {
      text: "Which nudes are people pairing it with?",
      reply: "Glossy peach and rosy-beige nudes come up most. A few artists pair it with a clear gloss for photos.",
    },
    {
      text: "Does it work on deeper skin tones?",
      reply:
        "It’s the top question in the comments. The few creators with deeper skin tones who tried it say it reads more pink, and suggest a deeper liner underneath.",
    },
    {
      text: "Any complaints I should flag?",
      reply: "Mostly price. Some people call it hard to justify for one liner, and a handful are asking for a dupe.",
    },
  ],
  anne: [
    {
      text: "Who’s driving this conversation?",
      reply:
        "Beauty editors started it with red carpet breakdowns, then tutorial creators like @allure took over with step-by-step recreations.",
    },
    {
      text: "Which drugstore dupes come up most?",
      reply: "Neutral 12-pan palettes under $10 are mentioned the most, along with a matte taupe for the crease.",
    },
    {
      text: "What questions do viewers keep asking?",
      reply: "Mostly the exact shades and brushes used. A lot of people also ask how to adapt it for hooded eyes.",
    },
    {
      text: "Any complaints I should flag?",
      reply: "A small group says the brown-on-brown look turns muddy on hooded eyes. It isn’t growing.",
    },
  ],
  lulu: [
    {
      text: "Who’s driving this conversation?",
      reply: "Pilates and yoga instructors, who stitch lululemon’s videos to show how they’d run the class themselves.",
    },
    {
      text: "How are instructors reacting?",
      reply:
        "Mostly positive. They like the pacing and the rooftop setting, and several say they’ll use the flow in class.",
    },
    {
      text: "Which products are people asking about?",
      reply: "The leggings, mostly whether they’re Align or a new line, plus the cropped tops in the video.",
    },
    {
      text: "Any complaints I should flag?",
      reply:
        "The “no distractions” caption. Some call it preachy for a brand post, and that thread is picking up replies.",
    },
  ],
};
const icon = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;
const metricIcon = (name: "views" | "likes" | "comments") =>
  `${import.meta.env.BASE_URL}assets/page-style/icon-${name}.png`;
const VIDEO_CONTROLS = `${import.meta.env.BASE_URL}assets/page-style/video-controls.svg`;
const INSTAGRAM = `${import.meta.env.BASE_URL}assets/page-style/icon-instagram.png`;
const SPACED_ICONS = {
  views: `${import.meta.env.BASE_URL}assets/page-style/icon-play.png`,
  likes: `${import.meta.env.BASE_URL}assets/page-style/icon-heart.png`,
  comments: `${import.meta.env.BASE_URL}assets/page-style/icon-comment.png`,
};

export function InstagramIcon() {
  return <span className="ps-ig" style={{ "--ps-ig": `url(${INSTAGRAM})` } as CSSProperties} aria-hidden="true" />;
}

type StyleId = "grid" | "strip" | "pages" | "stage";
export type MetricStyle = "spaced" | "circle" | "plain" | "pill";
type SortId = (typeof SORT_OPTIONS)[number];
type TimeId = (typeof TIME_OPTIONS)[number];
type MenuId = "time" | "sort" | "filters" | null;

const TIME_DAYS: Partial<Record<TimeId, number>> = {
  "Last 48 hours": 2,
  "Last 7 days": 7,
  "Last 30 days": 30,
  "Last 3 months": 90,
  "Last 6 months": 180,
};

const STYLES: { id: StyleId; label: string }[] = [
  { id: "grid", label: "Cards" },
  { id: "strip", label: "Filmstrip" },
  { id: "pages", label: "Pages" },
  { id: "stage", label: "Stage" },
];
const PLATFORMS = ["Instagram", "TikTok", "YouTube"] as const;
const LOCATIONS = ["United States", "United Kingdom", "Canada", "Australia"] as const;
const HANDLES = ["uhodom_edinym", "glowbymaya", "vbbeauty", "katiadoesmakeup", "allure", "studio.mua"];
const NOTES = [
  "The hold demo is what people replay. Comments ask how long it lasts through humidity.",
  "Creators keep comparing the built-in brush to a separate spoolie. Most prefer this.",
  "A few call the lift “too stiff,” but the rest of the thread is asking for a drugstore dupe.",
];

const CLIP_VIDEOS = [
  `${import.meta.env.BASE_URL}assets/newsfeed/clip-1.mp4`,
  `${import.meta.env.BASE_URL}assets/newsfeed/clip-2.mp4`,
  `${import.meta.env.BASE_URL}assets/newsfeed/clip-3.mp4`,
];

const SHORT_NAMES: Record<string, string> = {
  nyx: "NYX Brow Glue",
  vb: "Portofino ’97",
  anne: "Anne Hathaway looks",
  lulu: "Lululemon Summer Series",
};

export type CatalogPost = {
  id: string;
  src: string;
  video?: string;
  handle: string;
  title: string;
  note: string;
  platform: (typeof PLATFORMS)[number];
  location: (typeof LOCATIONS)[number];
  dayOffset: number;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
};

export function catalog(theme: GridTheme = GRID_THEMES[0]): CatalogPost[] {
  const isNyx = theme.id === "nyx";
  const scale = theme.stats.views / GRID_THEMES[0].stats.views;
  const handles = isNyx
    ? HANDLES
    : [...new Set(theme.posts.map((post) => post.handle.replace(/^@/, "")))].concat(HANDLES.slice(0, 3));
  return Array.from({ length: POST_COUNT }, (_, index) => {
    const post = theme.posts[index % theme.posts.length];
    const views = Math.round((196000 * 0.88 ** index + 4000 + (index % 3) * 14000) * scale);
    const likes = Math.round(views * (0.012 + (index % 4) * 0.004));
    const comments = Math.round((40 + index * 17 + (index % 2) * 30) * Math.max(scale, 0.4));
    return {
      id: `${theme.id}-${index}`,
      src: post.src,
      video: isNyx ? CLIP_VIDEOS[index % CLIP_VIDEOS.length] : undefined,
      handle: handles[index % handles.length],
      title: `${SHORT_NAMES[theme.id] ?? theme.title} · ${index + 1}`,
      note: isNyx ? NOTES[index % NOTES.length] : theme.summary,
      platform: PLATFORMS[index % PLATFORMS.length],
      location: LOCATIONS[index % LOCATIONS.length],
      dayOffset: index % 7,
      views,
      likes,
      comments,
      engagement: Number((1.4 + (index % 5) * 0.5).toFixed(1)),
    };
  });
}

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

export function PostCard({
  post,
  onOpen,
  metrics = "spaced",
}: {
  post: CatalogPost;
  onOpen?: () => void;
  metrics?: MetricStyle;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const pills = metrics === "pill";
  const metricGlyph = (name: "views" | "likes" | "comments") =>
    metrics === "spaced" ? (
      <span className="ps-metric-icon" style={{ "--ps-icon": `url(${SPACED_ICONS[name]})` } as CSSProperties} />
    ) : (
      <i>
        <img src={pills ? assets[name] : metricIcon(name)} alt="" />
      </i>
    );

  const play = () => {
    const node = video.current;
    if (!node) return;
    node.currentTime = 0;
    void node.play();
  };

  const stop = () => {
    const node = video.current;
    if (!node) return;
    node.pause();
    node.currentTime = 0;
  };

  return (
    <button
      type="button"
      className={`ps-card is-metrics-${metrics}`}
      aria-label={`Open ${post.title}`}
      onClick={onOpen}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      <span className="ps-card-media">
        {post.video ? (
          <video ref={video} poster={post.src} src={post.video} muted loop playsInline preload="metadata" />
        ) : (
          <img className="ps-card-poster" src={post.src} alt="" />
        )}
        <span className="ps-card-platforms" aria-hidden="true">
          {post.platform === "YouTube" ? <ClipPlay /> : <InstagramIcon />}
        </span>
        <img className="ps-card-controls" src={VIDEO_CONTROLS} alt="" aria-hidden="true" />
      </span>
      <span className="ps-card-copy">
        <span className="ps-handle">@{post.handle}</span>
        <span className="ps-card-summary">{post.note}</span>
        <span className="ps-metrics">
          <span>
            {metricGlyph("views")}
            {compact(post.views)}
          </span>
          <span>
            {metricGlyph("likes")}
            {compact(post.likes)}
          </span>
          <span>
            {metricGlyph("comments")}
            {post.comments}
          </span>
        </span>
      </span>
    </button>
  );
}

export function PageStyle({ onBack, initialThemeId }: { onBack?: () => void; initialThemeId?: string }) {
  const [themeId, setThemeId] = useState(initialThemeId ?? GRID_THEMES[0].id);
  const theme = GRID_THEMES.find((item) => item.id === themeId) ?? GRID_THEMES[0];
  const isNyx = theme.id === "nyx";
  const all = useMemo(() => catalog(theme), [theme]);
  const [open, setOpen] = useState<OpenPost | null>(null);
  const [ask, setAsk] = useState<{ id: string; question?: AskPrompt } | null>(null);
  const prompts = ASK_PROMPTS[theme.id] ?? NYX_PROMPTS;
  const [menu, setMenu] = useState<MenuId>(null);
  const [time, setTime] = useState<TimeId>("Last 7 days");
  const [sort, setSort] = useState<SortId>("Views");
  const [filters, setFilters] = useState<string[]>(DEFAULT_FILTERS);
  const [showAll, setShowAll] = useState(false);

  const posts = useMemo(() => {
    const days = TIME_DAYS[time] ?? 365;
    const selectedPlatforms = [
      filters.includes("Instagram") ? "Instagram" : null,
      filters.includes("TikTok") ? "TikTok" : null,
      filters.includes("YouTube Shorts") ? "YouTube" : null,
    ].filter(Boolean) as CatalogPost["platform"][];
    const selectedLocations = LOCATIONS.filter((location) => filters.includes(location));
    return all
      .filter((post) => post.dayOffset < days)
      .filter((post) => (selectedPlatforms.length ? selectedPlatforms.includes(post.platform) : true))
      .filter((post) => (selectedLocations.length ? selectedLocations.includes(post.location) : true))
      .slice()
      .sort((a, b) => {
        if (sort === "Recency" || sort === "Date reviewed") return a.dayOffset - b.dayOffset;
        if (sort === "Views") return b.views - a.views;
        if (sort === "Likes" || sort === "Saves" || sort === "Shares") return b.likes - a.likes;
        if (sort === "Comments") return b.comments - a.comments;
        if (sort === "Engagement rate") return b.engagement - a.engagement;
        if (sort === "Total engagement") return b.likes + b.comments - (a.likes + a.comments);
        if (sort === "Follower count") return b.views - a.views;
        return a.location.localeCompare(b.location);
      });
  }, [all, time, sort, filters]);

  const filterCount = filters.length;

  const openPost = (post: CatalogPost) => {
    const index = all.findIndex((item) => item.id === post.id);
    setOpen({
      postId: (index % 2 === 0 ? "1" : "2") as PostId,
      title: post.title,
      source: theme.title,
    });
  };

  const openTheme = (next: GridTheme) => {
    setThemeId(next.id);
    setAsk(null);
    setShowAll(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PlotTopBar
        className="ps-top"
        crumbs={[{ label: "Home", onClick: onBack }, { label: theme.title }]}
        onBack={onBack}
      />
      <div className={ask ? "ps has-chat" : "ps"}>
        <div className="ps-frame">
          <header className="ps-intro">
            <div className="ps-intro-copy">
              <h1>{theme.title}</h1>
              <p>{isNyx ? THEME_SUMMARY : theme.summary}</p>
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
            </div>
            <div className="ps-intro-tools">
              <div className="ps-cta">
                <button type="button" className="cc-btn" onClick={() => setAsk({ id: "open" })}>
                  <img src={icon("icon-sparkles.svg")} alt="" />
                  Ask AI
                </button>
                <button type="button" className="cc-btn">
                  <img src={icon("icon-track.svg")} alt="" />
                  Generate report
                </button>
              </div>
              <div className="ps-asks">
                <p>Try asking</p>
                {prompts.map((prompt) => (
                  <button
                    key={prompt.text}
                    type="button"
                    className={ask?.question === prompt ? "is-on" : undefined}
                    onClick={() => setAsk({ id: prompt.text, question: prompt })}
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="ps-bar nf-controls">
            <h2 className="ps-section-title">Posts</h2>
            <button
              type="button"
              className={menu === "time" ? "nf-control is-open" : "nf-control"}
              aria-expanded={menu === "time"}
              onClick={() => setMenu(menu === "time" ? null : "time")}
            >
              <span className="nf-control-icon">
                <img src={icon("icon-calendar.svg")} alt="" width={16} height={16} />
              </span>
              {time}
              <img className="nf-caret" src={icon("icon-caret.svg")} alt="" width={16} height={16} />
            </button>
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
              {filterCount ? <span className="nf-control-count">{filterCount}</span> : null}
              <img className="nf-caret" src={icon("icon-caret.svg")} alt="" width={16} height={16} />
            </button>

            {menu === "time" ? (
              <Menu
                label="Timeframe"
                className="is-time"
                variant="radio"
                options={TIME_OPTIONS}
                value={time}
                onPick={(value) => {
                  if (value !== "Custom range") setTime(value);
                  setMenu(null);
                }}
              />
            ) : null}
            {menu === "sort" ? (
              <Menu
                label="Sort"
                className="is-sort"
                variant="check"
                options={SORT_OPTIONS}
                value={sort}
                onPick={(value) => {
                  setSort(value);
                  setMenu(null);
                }}
              />
            ) : null}
            {menu === "filters" ? (
              <FiltersMenu
                selected={filters}
                onChange={(next) => {
                  setFilters(next);
                }}
              />
            ) : null}
          </div>

          {posts.length === 0 ? <p className="ps-empty">No posts match these filters.</p> : null}

          {posts.length ? (
            <div className="ps-grid">
              {(showAll ? posts : posts.slice(0, PREVIEW_COUNT)).map((post) => (
                <PostCard key={post.id} post={post} onOpen={() => openPost(post)} />
              ))}
            </div>
          ) : null}

          {posts.length > PREVIEW_COUNT ? (
            <div className="ps-more">
              <button
                type="button"
                className={showAll ? "nf-btn is-soft nf-more is-open" : "nf-btn is-soft nf-more"}
                aria-expanded={showAll}
                onClick={() => setShowAll((value) => !value)}
              >
                <img src={icon("icon-chevron-down.svg")} alt="" width={16} height={16} />
                {showAll ? "Show fewer posts" : `View all ${posts.length} posts`}
              </button>
            </div>
          ) : null}

          <div className="ps-insights">
            <TopCreators posts={all} onOpenPost={openPost} />
            <CommentSentiment theme={theme} />
          </div>

          <ThemeFeedback key={theme.id} theme={theme} />

          <DiscoverMore themes={GRID_THEMES.filter((item) => item.id !== theme.id)} onOpen={openTheme} />
        </div>

        {open ? <NewsfeedPost post={open} onClose={() => setOpen(null)} onAction={() => undefined} /> : null}
        {ask ? (
          <ThemeChat
            key={ask.id}
            theme={theme}
            question={ask.question}
            suggestions={prompts}
            onClose={() => setAsk(null)}
          />
        ) : null}
      </div>
    </>
  );
}

export function PostLayouts() {
  const posts = useMemo(() => catalog(), []);
  const [style, setStyle] = useState<StyleId>("grid");
  const [focus, setFocus] = useState(0);
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const pagePosts = posts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const current = posts[focus] ?? posts[0];
  const step = (delta: number) => setFocus((value) => (value + delta + posts.length) % posts.length);

  return (
    <div className="ps-layouts">
      <div className="ps-switch proto-seg" role="tablist" aria-label="Post layout">
        {STYLES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={style === item.id}
            className={style === item.id ? "is-active" : undefined}
            onClick={() => {
              setStyle(item.id);
              setFocus(0);
              setPage(0);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {style === "grid" ? (
        <div className="ps-grid">
          {posts.slice(0, 8).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}

      {style === "strip" && current ? (
        <div className="ps-strip">
          <div className="ps-focus">
            <button type="button" className="ps-arrow" aria-label="Previous post" onClick={() => step(-1)}>
              ‹
            </button>
            <PostCard post={current} />
            <button type="button" className="ps-arrow" aria-label="Next post" onClick={() => step(1)}>
              ›
            </button>
          </div>
          <p className="ps-count">
            {focus + 1} / {posts.length}
          </p>
          <div className="ps-thumbs">
            {posts.map((post, index) => (
              <button
                key={post.id}
                type="button"
                className={index === focus ? "is-on" : undefined}
                aria-current={index === focus}
                aria-label={`Show ${post.title}`}
                onClick={() => setFocus(index)}
              >
                <img src={post.src} alt="" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {style === "pages" && posts.length ? (
        <div className="ps-paged">
          <div className="ps-grid">
            {pagePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="ps-pager">
            <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            {Array.from({ length: pages }, (_, index) => (
              <button
                key={index}
                type="button"
                className={index === page ? "is-on" : undefined}
                aria-current={index === page}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </button>
            ))}
            <button type="button" disabled={page === pages - 1} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      ) : null}

      {style === "stage" && current ? (
        <div className="ps-one">
          <PostCard post={current} />
          <div className="ps-one-nav">
            <button type="button" className="ps-arrow" aria-label="Previous post" onClick={() => step(-1)}>
              ‹
            </button>
            <p className="ps-count">
              {focus + 1} / {posts.length}
            </p>
            <button type="button" className="ps-arrow" aria-label="Next post" onClick={() => step(1)}>
              ›
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
