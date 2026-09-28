import { useEffect, useRef, useState } from "react";
import { GRID_THEMES, ThemeCard, type GridTheme, type GridVariant } from "./ThemeGrid";
import "./theme-browser.css";

const CATEGORIES = ["Beauty", "Fashion", "Fitness", "Celebrity", "Food"] as const;
type Category = (typeof CATEGORIES)[number];

const TOPICS: { title: string; summary: string; category: Category }[] = [
  ...GRID_THEMES.map((theme, index) => ({
    title: theme.title,
    summary: theme.summary,
    category: (["Beauty", "Beauty", "Celebrity", "Fitness"] as const)[index],
  })),
  {
    title: "Glass Skin Routines Swap Serums for Rice Water",
    summary: "Skincare creators are trading ten-step routines for fermented rice water toners, with before-and-afters doing most of the convincing.",
    category: "Beauty",
  },
  {
    title: "Quiet Luxury Hauls Move From Loafers to Ballet Flats",
    summary: "Haul videos are shifting from logo-free loafers to soft ballet flats, with creators ranking pairs on comfort over a full workday.",
    category: "Fashion",
  },
  {
    title: "Hot Girl Walk Creators Add Weighted Vests",
    summary: "Walking content is getting heavier as creators add weighted vests, sharing step counts and honest takes on whether it’s worth it.",
    category: "Fitness",
  },
  {
    title: "Cottage Cheese Recipes Keep Climbing After Viral Toast",
    summary: "The whipped cottage cheese toast trend has spread into pasta sauces and ice cream, with high-protein creators leading the remixes.",
    category: "Food",
  },
  {
    title: "Lewis Hamilton’s Golf Wager Sparks Duet Challenges",
    summary: "Fans are duetting Lewis Hamilton’s golf bet clip with their own trick shots, and brands are quietly joining in the comments.",
    category: "Celebrity",
  },
  {
    title: "Denim-on-Denim Returns in Festival Try-Ons",
    summary: "Festival try-on hauls are leaning into double denim, with creators mixing washes and pairing it with sheer layers.",
    category: "Fashion",
  },
  {
    title: "Lip Oil Dupes Beat the Originals on Wear Tests",
    summary: "Creators are running eight-hour wear tests on drugstore lip oils and several are outlasting the prestige versions they copy.",
    category: "Beauty",
  },
  {
    title: "Reformer Pilates at Home on a Budget",
    summary: "Instructors are showing reformer-style workouts using sliders and resistance bands, pitching them as the budget version of the studio.",
    category: "Fitness",
  },
  {
    title: "Matcha Swaps for Coffee in Morning Routines",
    summary: "Morning routine videos are swapping espresso for matcha, with a growing side debate about ceremonial grade versus latte blends.",
    category: "Food",
  },
];

type BrowseTheme = { id: string; category: Category; variant: GridVariant; theme: GridTheme };

const THEMES: BrowseTheme[] = Array.from({ length: 52 }, (_, index) => {
  const topicIndex = index % TOPICS.length;
  const topic = TOPICS[topicIndex];
  const base = GRID_THEMES[index % GRID_THEMES.length];
  const round = Math.floor(index / TOPICS.length);
  const hours = 2 + index * 3;
  const scale = Math.max(0.08, 1 - index * 0.018);
  return {
    id: `theme-${index}`,
    category: topic.category,
    variant: topicIndex === 0 ? "photo" : "gray",
    theme: {
      ...(topicIndex < GRID_THEMES.length ? GRID_THEMES[topicIndex] : base),
      id: `theme-${index}`,
      title: round ? `${topic.title} · Week ${round + 1}` : topic.title,
      summary: topic.summary,
      ago: hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`,
      stats: {
        posts: Math.round(180 * scale),
        views: Math.round(2_600_000 * scale),
        engagement: Math.round(260_000 * scale),
      },
    },
  };
});

const PAGE = 4;

type Mode = "more" | "infinite" | "pages" | "shelves" | "list";

const MODES: { id: Mode; label: string; note: string }[] = [
  {
    id: "more",
    label: "Load more",
    note: "What we have now. Each click adds 4 more (another 2×2) and the count tells you how far you are. Easy to stop, but lots of clicking to reach theme 40.",
  },
  {
    id: "infinite",
    label: "Infinite scroll",
    note: "More themes load as you reach the bottom, with a short skeleton while they come in. Feels like a feed, but the watchlist below becomes hard to reach, so it only works if the feed is the last thing on the page.",
  },
  {
    id: "pages",
    label: "Pagination",
    note: "Fixed pages of 4, one 2×2 per page. You always know where you are, and it’s easy to share or come back to page 3. Feels more like a report than a feed.",
  },
  {
    id: "shelves",
    label: "Category shelves",
    note: "Themes grouped into rows by category, each row scrolls sideways. Good for scanning 52 themes by topic, but ranking across categories gets lost.",
  },
  {
    id: "list",
    label: "Compact list",
    note: "Dense rows with sortable columns, for power users who want to scan everything at once. Loses the visual pull of the posts.",
  },
];

export function ThemeBrowser() {
  const [mode, setMode] = useState<Mode>("more");
  const active = MODES.find((item) => item.id === mode)!;

  return (
    <div className="tb">
      <div className="tb-modes" role="tablist" aria-label="Browsing mode">
        {MODES.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} onClick={() => setMode(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="tb-note">{active.note}</p>
      <div className="tb-stage">
        {mode === "more" ? <LoadMore /> : null}
        {mode === "infinite" ? <Infinite /> : null}
        {mode === "pages" ? <Pages /> : null}
        {mode === "shelves" ? <Shelves /> : null}
        {mode === "list" ? <List /> : null}
      </div>
    </div>
  );
}

function LoadMore() {
  const [count, setCount] = useState(PAGE);
  return (
    <>
      <Grid themes={THEMES.slice(0, count)} />
      <div className="tb-foot">
        <span className="tb-count">
          Showing {count} of {THEMES.length}
        </span>
        {count < THEMES.length ? (
          <button type="button" className="tb-btn" onClick={() => setCount((value) => Math.min(THEMES.length, value + PAGE))}>
            Show {Math.min(PAGE, THEMES.length - count)} more
          </button>
        ) : (
          <button type="button" className="tb-btn" onClick={() => setCount(PAGE)}>
            Show fewer
          </button>
        )}
      </div>
    </>
  );
}

function Infinite() {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const done = count >= THEMES.length;

  useEffect(() => {
    const node = sentinel.current;
    if (!node || done) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loading) return;
        setLoading(true);
        window.setTimeout(() => {
          setCount((value) => Math.min(THEMES.length, value + PAGE));
          setLoading(false);
        }, 700);
      },
      { root: box.current, rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [count, loading, done]);

  return (
    <div className="tb-scroll" ref={box}>
      <Grid themes={THEMES.slice(0, count)} />
      {loading ? <Grid skeleton={2} /> : null}
      <div ref={sentinel} className="tb-sentinel">
        {done ? "You’re all caught up · 52 themes" : null}
      </div>
      <span className="tb-float">
        {count} of {THEMES.length}
      </span>
    </div>
  );
}

function Pages() {
  const [page, setPage] = useState(0);
  const total = Math.ceil(THEMES.length / PAGE);
  const go = (next: number) => setPage(Math.max(0, Math.min(total - 1, next)));
  return (
    <>
      <Grid themes={THEMES.slice(page * PAGE, page * PAGE + PAGE)} />
      <div className="tb-foot">
        <span className="tb-count">
          {page * PAGE + 1}–{Math.min(THEMES.length, page * PAGE + PAGE)} of {THEMES.length}
        </span>
        <nav className="tb-pages" aria-label="Pages">
          <button type="button" aria-label="Previous page" disabled={page === 0} onClick={() => go(page - 1)}>
            ‹
          </button>
          {Array.from({ length: total }, (_, index) => (
            <button key={index} type="button" aria-current={page === index ? "page" : undefined} onClick={() => go(index)}>
              {index + 1}
            </button>
          ))}
          <button type="button" aria-label="Next page" disabled={page === total - 1} onClick={() => go(page + 1)}>
            ›
          </button>
        </nav>
      </div>
    </>
  );
}

function Shelves() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? CATEGORIES : [filter];
  return (
    <>
      <div className="tb-chips">
        {(["All", ...CATEGORIES] as const).map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>
            {item}
            <span>{item === "All" ? THEMES.length : THEMES.filter((theme) => theme.category === item).length}</span>
          </button>
        ))}
      </div>
      {shown.map((category) => {
        const themes = THEMES.filter((theme) => theme.category === category);
        return (
          <section key={category} className="tb-shelf">
            <h4>
              {category} <span>{themes.length} themes</span>
            </h4>
            <div className="tb-shelf-row">
              {themes.map((item, index) => (
                <Card key={item.id} item={item} seed={index + 3} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

type SortKey = "ago" | "posts" | "views";

function List() {
  const [sort, setSort] = useState<SortKey>("ago");
  const sorted = [...THEMES].sort((a, b) =>
    sort === "ago" ? THEMES.indexOf(a) - THEMES.indexOf(b) : b.theme.stats[sort] - a.theme.stats[sort],
  );
  const header = (key: SortKey, label: string) => (
    <button type="button" aria-pressed={sort === key} onClick={() => setSort(key)}>
      {label}
      {sort === key ? " ↓" : ""}
    </button>
  );
  return (
    <div className="tb-list">
      <div className="tb-list-head">
        <span>Theme</span>
        <span>Category</span>
        {header("ago", "Updated")}
        {header("posts", "Posts")}
        {header("views", "Views")}
      </div>
      <div className="tb-list-body">
        {sorted.map(({ id, category, theme }) => (
          <div key={id} className="tb-row">
            <span className="tb-row-title">
              <img src={theme.posts[0].src} alt="" />
              {theme.title}
            </span>
            <span>{category}</span>
            <span>{theme.ago}</span>
            <span>{theme.stats.posts}</span>
            <span>{compact(theme.stats.views)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Grid({ themes = [], skeleton = 0 }: { themes?: BrowseTheme[]; skeleton?: number }) {
  return (
    <div className="tg-grid">
      {themes.map((item, index) => (
        <Card key={item.id} item={item} seed={index + 3} />
      ))}
      {Array.from({ length: skeleton }, (_, index) => (
        <div key={`s-${index}`} className="tb-skeleton" aria-hidden="true">
          <span className="tb-bar is-short" />
          <span className="tb-bar" />
          <span className="tb-bar" />
          <span className="tb-skeleton-stage" />
        </div>
      ))}
    </div>
  );
}

function Card({ item, seed }: { item: BrowseTheme; seed: number }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [tracked, setTracked] = useState(false);
  return (
    <ThemeCard
      theme={item.theme}
      variant={item.variant}
      seed={seed}
      vote={vote}
      tracked={tracked}
      onVote={(next) => setVote((current) => (current === next ? null : next))}
      onTrack={() => setTracked((current) => !current)}
    />
  );
}

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
}
