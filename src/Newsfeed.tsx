import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AssistantBubble, Composer, UserBubble } from "./chat-ui";
import { NewsfeedPost, type OpenPost } from "./NewsfeedPost";
import type { PostId } from "./posts";
import { CAPTION } from "./FocusCarousel";
import { DEFAULT_FILTERS, FiltersMenu, Menu, SORT_OPTIONS, TIME_OPTIONS } from "./FeedControls";
import { GRID_THEMES, ThemeCard, ThemeFeature, type GridTheme, type GridVariant } from "./ThemeGrid";
import { PAST_THEMES, type PastTheme } from "./PastThemes";
import "./newsfeed.css";

const file = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;

const nf = {
  menu: file("icon-menu.svg"),
  back: file("icon-back.svg"),
  invite: file("icon-invite.svg"),
  avatarBarbara: file("avatar-barbara.png"),
  avatarBlume: file("avatar-blume.png"),
  avatarRs: file("avatar-rs.svg"),
  avatarPlus: file("avatar-plus.svg"),
  avatarArthur: file("avatar-arthur.png"),
  pick: file("pick-image.png"),
  preferences: file("icon-preferences.svg"),
  saved: file("icon-saved.svg"),
  savedFilled: file("icon-saved-filled.svg"),
  reviewed: file("icon-reviewed.svg"),
  arrowGo: file("icon-arrow-right.svg"),
  calendar: file("icon-calendar.svg"),
  sort: file("icon-sort.svg"),
  filter: file("icon-filter.svg"),
  caret: file("icon-caret.svg"),
  chevronDown: file("icon-chevron-down.svg"),
  sparkles: file("icon-sparkles.svg"),
  track: file("icon-track.svg"),
  clip1: file("pick-image.png"),
  clip2: file("clip-2.png"),
  clip3: file("clip-3.png"),
  messages: file("icon-messages.svg"),
  document: file("icon-document.svg"),
  more: file("icon-more.svg"),
  close: file("icon-close.svg"),
  newChat: file("icon-new-chat.svg"),
  plotLogo: file("plot-logo.png"),
  like: file("icon-like.svg"),
  dislike: file("icon-dislike.svg"),
};

type Story = {
  id: string;
  ago: string;
  hoursAgo: number;
  heading: string;
  posts: number;
  views: number;
  engagement: number;
  about: ThemeAbout;
  theme: GridTheme;
};

type ThemeAbout = {
  product: string;
  category: string;
  angle: string;
  format: string;
  claim: string;
};

const THEME_FACTS: Record<string, { hoursAgo: number; about: ThemeAbout }> = {
  nyx: {
    hoursAgo: 4,
    about: {
      product: "Brow Glue",
      category: "Brow products",
      angle: "lift and hold",
      format: "Application demos",
      claim: "Long-wear claims",
    },
  },
  vb: {
    hoursAgo: 6,
    about: {
      product: "Portofino ’97",
      category: "Lip liners",
      angle: "bridal looks",
      format: "Get ready with me",
      claim: "All-day wear",
    },
  },
  anne: {
    hoursAgo: 9,
    about: {
      product: "Brown shadow",
      category: "Eyeshadow",
      angle: "celebrity looks",
      format: "Tutorials",
      claim: "Drugstore dupes",
    },
  },
  lulu: {
    hoursAgo: 12,
    about: {
      product: "Summer Series",
      category: "Activewear",
      angle: "Pilates",
      format: "Stitches",
      claim: "Brand taglines",
    },
  },
};

const ROUND_OFFSETS = [0, 72, 192];

const agoLabel = (hours: number) => (hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`);

const STORIES: Story[] = ROUND_OFFSETS.flatMap((offset, round) =>
  GRID_THEMES.map((theme) => {
    const facts = THEME_FACTS[theme.id];
    const hoursAgo = facts.hoursAgo + offset;
    const scale = [1, 0.4, 0.25][round];
    const stats = {
      posts: Math.round(theme.stats.posts * scale),
      views: Math.round(theme.stats.views * scale),
      engagement: Math.round(theme.stats.engagement * scale),
    };
    return {
      id: round ? `${theme.id}-${round}` : theme.id,
      ago: agoLabel(hoursAgo),
      hoursAgo,
      heading: theme.title,
      ...stats,
      about: facts.about,
      theme: { ...theme, ago: agoLabel(hoursAgo), stats },
    };
  }),
);

const DEFAULT_THEMES = 4;
const FEED_DAYS = 14;

const RANGE_DAYS: Record<(typeof TIME_OPTIONS)[number], number> = {
  "All time": Infinity,
  "Last 48 hours": 2,
  "Last 7 days": 7,
  "Last 14 days": 14,
  "Last 30 days": 30,
  "Last 3 months": 92,
  "Last 6 months": 183,
  "Last 12 months": 365,
  "This year": 272,
  "Custom range": FEED_DAYS,
};

type FeedSlot = { kind: "feature" | "card"; story: Story } | { kind: "feedback" };

function arrangeFeed(stories: Story[], withFeedback: boolean): FeedSlot[] {
  const [lead, ...rest] = stories;
  const slots: FeedSlot[] = lead ? [{ kind: "feature", story: lead }] : [];
  rest.forEach((story, index) => {
    slots.push({ kind: "card", story });
    if (withFeedback && index === 2) slots.push({ kind: "feedback" });
  });
  return slots;
}

const FEEDBACK_TOPICS = [
  "Product launches",
  "Creator tutorials",
  "Celebrity moments",
  "Dupes and swaps",
  "Competitor moves",
  "Complaints",
];

const BACKGROUNDS: Record<string, GridVariant> = { nyx: "photo" };

const WATCHLIST = [
  {
    id: "w1",
    kind: "Custom Report · From a theme",
    title: "NYX Brow Glue hold vs. stiffness",
    date: "September 24, 2026",
    icon: nf.messages,
  },
  {
    id: "w2",
    kind: "Custom Report",
    title: "NYX Butter Gloss creator mentions",
    date: "September 18, 2026",
    icon: nf.messages,
    owner: "Arthur Contractor",
  },
  {
    id: "w3",
    kind: "Custom Report",
    title: "NYX vs. drugstore brow gel dupes",
    date: "September 9, 2026",
    icon: nf.messages,
  },
];

const PICKS = Array.from({ length: 10 }, (_, index) => `pick-${index}`);

const pickPost = (id: string): PostId => (Number(id.split("-")[1]) % 2 === 0 ? "1" : "2");

const POST_TITLES: Record<PostId, string> = {
  "1": "Lululemon’s summer Pilates series",
  "2": "Lewis Hamilton’s golf wager with Min Woo Lee",
};

export function Newsfeed({ onOpenTheme }: { onOpenTheme?: (themeId: string) => void }) {
  const [toast, setToast] = useState<string | null>(null);
  const [menu, setMenu] = useState<"time" | "sort" | "filters" | null>(null);
  const [filters, setFilters] = useState<string[]>(DEFAULT_FILTERS);
  const [time, setTime] = useState<(typeof TIME_OPTIONS)[number]>("Last 14 days");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>("Recency");
  const [showAll, setShowAll] = useState(false);
  const [tracked, setTracked] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [pastReviewed, setPastReviewed] = useState(0);
  const [savedPicks, setSavedPicks] = useState<string[]>(["pick-1", "pick-4"]);
  const [savedOpen, setSavedOpen] = useState(false);
  const savedRef = useRef<HTMLLIElement>(null);
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const [hidden, setHidden] = useState<string[]>([]);
  const [side, setSide] = useState<SideContext | null>(null);
  const [openPost, setOpenPost] = useState<OpenPost | null>(null);
  const [openTheme, setOpenTheme] = useState<Story | null>(null);
  const [feedback, setFeedback] = useState<"open" | "done" | "dismissed">("open");
  const barRef = useRef<HTMLDivElement>(null);

  const ping = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!menu) return;
    const close = (event: MouseEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setMenu(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const ordered = [...STORIES].sort((a, b) => {
    if (sort === "Views") return b.views - a.views;
    if (sort === "Engagement rate") return b.engagement / b.views - a.engagement / a.views;
    if (["Likes", "Comments", "Total engagement", "Saves", "Shares"].includes(sort)) return b.engagement - a.engagement;
    if (sort === "Follower count") return b.posts - a.posts;
    return a.hoursAgo - b.hoursAgo;
  });
  const visible = ordered.filter((story) => !hidden.includes(story.id));
  const days = RANGE_DAYS[time];
  const inRange = visible.filter((story) => story.hoursAgo <= days * 24);
  const olderInRange = PAST_THEMES.filter((item) => item.daysAgo < days);
  const limit = showAll ? Infinity : DEFAULT_THEMES;
  const stories = inRange.slice(0, limit);
  const older = olderInRange.slice(0, Math.max(0, limit - inRange.length));
  const olderWeeks = [...new Set(older.map((item) => item.week))];
  const hasMore = stories.length + older.length < inRange.length + olderInRange.length;

  const totalReviewed = pastReviewed + reviewed.length;
  const streak = totalReviewed ? 1 : 0;
  const batchDone = PICKS.every((id) => reviewed.includes(id));

  const askTheme = (story: Story) => setSide({ kind: "theme", story });

  const openStory = (story: Story) => (onOpenTheme ? onOpenTheme(story.theme.id) : setOpenTheme(story));

  const openPast = (item: PastTheme) => {
    if (item.openId) onOpenTheme?.(item.openId);
  };

  const openThemePost = (story: Story, index: number) => {
    const postId: PostId = index % 2 === 0 ? "1" : "2";
    setOpenPost({ postId, title: POST_TITLES[postId], source: story.heading });
  };

  const voteTheme = (id: string, next: "up" | "down") => {
    const cleared = votes[id] === next;
    setVotes((current) => {
      if (current[id] === next) {
        const copy = { ...current };
        delete copy[id];
        return copy;
      }
      return { ...current, [id]: next };
    });
    if (next === "up") {
      ping(cleared ? "Feedback cleared" : "Thanks for your feedback. You’ll see more suggestions like this.");
    }
  };

  const trackTheme = (story: Story) => {
    if (tracked.includes(story.id)) {
      setTracked(tracked.filter((id) => id !== story.id));
      ping("Stopped tracking. Removed from your watchlist.");
    } else {
      setSide({ kind: "track", story });
    }
  };

  const openPick = (index: number) => {
    if (index >= PICKS.length) {
      setOpenPost(null);
      ping(`All ${PICKS.length} daily picks reviewed.`);
      return;
    }
    const id = PICKS[index];
    setReviewed((current) => (current.includes(id) ? current : [...current, id]));
    const postId = pickPost(id);
    setOpenPost({
      postId,
      title: POST_TITLES[postId],
      source: "Daily Pick",
      queue: { index, total: PICKS.length },
    });
  };

  return (
    <div className={side ? "nf has-side" : "nf"}>
      <PlotTopBar crumbs={[{ label: "Home" }]} onBack={() => ping("Back")} onAction={ping} />

      <main className="nf-main">
        <section className="nf-section" aria-labelledby="nf-picks-title">
          <h2 id="nf-picks-title" className="nf-title">
            Daily Picks
          </h2>
          <div className="nf-picks">
            <div className="nf-stats">
              <PickStat label="Your Streak" value={`${streak} ${streak === 1 ? "day" : "days"} 🔥`} />
              <PickStat label="Longest streak" value={`${streak} ${streak === 1 ? "day" : "days"} ⚡️`} />
              <PickStat
                label="Total reviewed"
                value={`${totalReviewed} ${totalReviewed === 1 ? "post" : "posts"} 📣`}
              />
            </div>
            <div className="nf-pick-row">
              {PICKS.map((id) => {
                const on = reviewed.includes(id);
                const isSaved = savedPicks.includes(id);
                return (
                  <div key={id} className={isSaved ? "nf-pick-wrap is-saved" : "nf-pick-wrap"}>
                    <button
                      type="button"
                      className={on ? "nf-pick is-on" : "nf-pick"}
                      aria-label={on ? "Open reviewed post" : "Open post"}
                      onClick={() => openPick(PICKS.indexOf(id))}
                    >
                      <img src={nf.pick} alt="" />
                      {on ? (
                        <span className="nf-pick-check">
                          <img src={nf.reviewed} alt="" width={16} height={16} />
                        </span>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      className="nf-pick-save"
                      aria-pressed={isSaved}
                      aria-label={isSaved ? "Remove from saved posts" : "Save for later"}
                      onClick={() => {
                        setSavedPicks(isSaved ? savedPicks.filter((item) => item !== id) : [...savedPicks, id]);
                        ping(isSaved ? "Removed from saved posts" : "Saved to your watchlist");
                      }}
                    >
                      <img src={isSaved ? nf.savedFilled : nf.saved} alt="" width={14} height={14} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="nf-picks-actions">
              <div className="nf-btn-row">
                <NfButton icon={nf.preferences} tonal onClick={() => ping("Preferences")}>
                  Preferences
                </NfButton>
                <NfButton
                  icon={nf.saved}
                  tonal
                  onClick={() => {
                    if (!savedPicks.length) {
                      ping("Save a pick with the bookmark on its corner");
                      return;
                    }
                    setSavedOpen(true);
                    savedRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                >
                  {`Saved for later · ${savedPicks.length}`}
                </NfButton>
                <NfButton icon={nf.reviewed} tonal onClick={() => ping(`${reviewed.length} reviewed posts`)}>
                  Reviewed posts
                </NfButton>
              </div>
              <button
                className="nf-btn is-dark"
                type="button"
                onClick={() => {
                  if (batchDone) {
                    setPastReviewed((count) => count + reviewed.length);
                    setReviewed([]);
                    openPick(0);
                    return;
                  }
                  openPick(PICKS.findIndex((id) => !reviewed.includes(id)));
                }}
              >
                {batchDone ? "Review another batch" : "Let’s go"}
                <img src={nf.arrowGo} alt="" width={16} height={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="nf-section" aria-labelledby="nf-feed-title">
          <div className="nf-feed-head">
            <h2 id="nf-feed-title" className="nf-title">
              Feed Stories
            </h2>
            <div className="nf-controls" ref={barRef}>
              <button
                type="button"
                className={menu === "time" ? "nf-control is-open" : "nf-control"}
                aria-expanded={menu === "time"}
                onClick={() => setMenu(menu === "time" ? null : "time")}
              >
                <span className="nf-control-icon">
                  <img src={nf.calendar} alt="" width={16} height={16} />
                </span>
                {time}
                <img className="nf-caret" src={nf.caret} alt="" width={16} height={16} />
              </button>
              <button
                type="button"
                className={menu === "sort" ? "nf-control is-open" : "nf-control"}
                aria-expanded={menu === "sort"}
                onClick={() => setMenu(menu === "sort" ? null : "sort")}
              >
                <span className="nf-control-icon">
                  <img src={nf.sort} alt="" width={16} height={16} />
                </span>
                <span>
                  Sort by <strong>{sort}</strong>
                </span>
                <img className="nf-caret" src={nf.caret} alt="" width={16} height={16} />
              </button>
              <button
                type="button"
                className={menu === "filters" ? "nf-control is-open" : "nf-control"}
                aria-expanded={menu === "filters"}
                onClick={() => setMenu(menu === "filters" ? null : "filters")}
              >
                <span className="nf-control-icon">
                  <img src={nf.filter} alt="" width={16} height={16} />
                </span>
                Posts filters
                {filters.length ? <span className="nf-control-count">{filters.length}</span> : null}
                <img className="nf-caret" src={nf.caret} alt="" width={16} height={16} />
              </button>

              {menu === "time" ? (
                <Menu
                  label="Timeframe"
                  className="is-time"
                  variant="radio"
                  options={TIME_OPTIONS}
                  value={time}
                  onPick={(value) => {
                    if (value === "Custom range") {
                      ping("Custom range picker coming soon");
                      return;
                    }
                    setTime(value);
                    setShowAll(RANGE_DAYS[value] > FEED_DAYS);
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
              {menu === "filters" ? <FiltersMenu selected={filters} onChange={setFilters} /> : null}
            </div>
          </div>

          <div className="nf-stories tg-grid">
            {arrangeFeed(stories, feedback !== "dismissed").map((slot, index) => {
              if (slot.kind === "feedback") {
                return (
                  <FeedbackCard
                    key="feedback"
                    done={feedback === "done"}
                    onSave={() => setFeedback("done")}
                    onSkip={() => setFeedback("dismissed")}
                  />
                );
              }
              const { story } = slot;
              return (
                <Fragment key={story.id}>
                  {votes[story.id] === "down" ? (
                    <LessLikeThis
                      wide={slot.kind === "feature"}
                      story={story}
                      onSave={() => {
                        setHidden((current) => [...current, story.id]);
                        ping("Thanks for your feedback. We’ll update your preferences.");
                      }}
                      onUndo={() =>
                        setVotes((current) => {
                          const copy = { ...current };
                          delete copy[story.id];
                          return copy;
                        })
                      }
                    />
                  ) : slot.kind === "feature" ? (
                    <ThemeFeature
                      theme={story.theme}
                      stage="single"
                      cta="View details"
                      vote={votes[story.id] ?? null}
                      onOpen={() => openStory(story)}
                      onVote={(next) => voteTheme(story.id, next)}
                      onOpenPost={(post) => openThemePost(story, post)}
                    />
                  ) : (
                    <ThemeCard
                      theme={story.theme}
                      variant={BACKGROUNDS[story.theme.id] ?? "gray"}
                      seed={index + 3}
                      layout="split"
                      sources="posts"
                      cta="View details"
                      tracked={tracked.includes(story.id)}
                      vote={votes[story.id] ?? null}
                      onOpen={() => openStory(story)}
                      onAsk={() => askTheme(story)}
                      onVote={(next) => voteTheme(story.id, next)}
                      onTrack={() => trackTheme(story)}
                    />
                  )}
                </Fragment>
              );
            })}
            {olderWeeks.map((week) => {
              const items = older.filter((item) => item.week === week);
              return (
                <Fragment key={week}>
                  <h3 className="nf-week">
                    {week}
                    <span>
                      {items.length} {items.length === 1 ? "theme" : "themes"}
                    </span>
                  </h3>
                  {items.map((item, index) => (
                    <ThemeCard
                      key={item.id}
                      theme={item.theme}
                      variant="gray"
                      seed={index + 3}
                      layout="split"
                      sources="posts"
                      cta="View details"
                      kicker={`From ${item.date}${item.merged ? ` · Combined from ${item.merged} themes` : ""}`}
                      vote={votes[item.id] ?? null}
                      onOpen={() => openPast(item)}
                      onVote={(next) => voteTheme(item.id, next)}
                    />
                  ))}
                </Fragment>
              );
            })}
          </div>

          {hasMore ? (
            <button type="button" className="nf-btn is-soft nf-more" onClick={() => setShowAll(true)}>
              <img src={nf.chevronDown} alt="" width={16} height={16} />
              Show all themes
            </button>
          ) : null}
        </section>

        <section className="nf-section" aria-labelledby="nf-watch-title">
          <h2 id="nf-watch-title" className="nf-title">
            Your Watchlist
          </h2>
          <ul className="nf-watch">
            {savedPicks.length ? (
              <li ref={savedRef} className={savedOpen ? "nf-watch-saved is-open" : "nf-watch-saved"}>
                <div className="nf-watch-saved-row">
                  <button
                    type="button"
                    className="nf-watch-open"
                    aria-expanded={savedOpen}
                    onClick={() => setSavedOpen((value) => !value)}
                  >
                    <img src={nf.saved} alt="" width={24} height={24} />
                    <span className="nf-watch-copy">
                      <span className="nf-watch-kind">Saved posts</span>
                      <span className="nf-watch-title">From Daily Picks</span>
                    </span>
                  </button>
                  <span className="nf-saved-peek" aria-hidden="true">
                    {savedPicks.slice(0, 3).map((id) => (
                      <img key={id} src={nf.pick} alt="" />
                    ))}
                  </span>
                  <span className="nf-watch-date">
                    {savedPicks.length} {savedPicks.length === 1 ? "post" : "posts"}
                  </span>
                  <button
                    type="button"
                    className="nf-icon-btn nf-saved-toggle"
                    aria-label={savedOpen ? "Hide saved posts" : "Show saved posts"}
                    onClick={() => setSavedOpen((value) => !value)}
                  >
                    <img src={nf.caret} alt="" width={16} height={16} />
                  </button>
                </div>
                {savedOpen ? (
                  <div className="nf-saved-posts">
                    {savedPicks.map((id) => (
                      <div key={id} className="nf-saved-post">
                        <button
                          type="button"
                          className="nf-saved-open"
                          aria-label="Open saved post"
                          onClick={() => {
                            const postId = pickPost(id);
                            setOpenPost({
                              postId,
                              title: POST_TITLES[postId],
                              source: "Saved post",
                            });
                          }}
                        >
                          <img src={nf.pick} alt="" />
                        </button>
                        <button
                          type="button"
                          className="nf-pick-save"
                          aria-label="Remove from saved posts"
                          onClick={() => {
                            setSavedPicks((current) => current.filter((item) => item !== id));
                            ping("Removed from saved posts");
                          }}
                        >
                          <img src={nf.savedFilled} alt="" width={14} height={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ) : null}
            {STORIES.filter((story) => tracked.includes(story.id)).map((story) => (
              <li key={`tracked-${story.id}`}>
                <button type="button" className="nf-watch-open" onClick={() => ping(`Open ${story.heading}`)}>
                  <img src={nf.messages} alt="" width={24} height={24} />
                  <span className="nf-watch-copy">
                    <span className="nf-watch-kind">Custom Report · From a theme</span>
                    <span className="nf-watch-title">{story.heading}</span>
                  </span>
                </button>
                <span className="nf-watch-date">Tracking since today</span>
                <button
                  type="button"
                  className="nf-icon-btn"
                  aria-label={`More for ${story.heading}`}
                  onClick={() => ping("More")}
                >
                  <img src={nf.more} alt="" width={24} height={24} />
                </button>
              </li>
            ))}
            {WATCHLIST.map((item) => (
              <li key={item.id}>
                <button type="button" className="nf-watch-open" onClick={() => ping(`Open ${item.title}`)}>
                  <img src={item.icon} alt="" width={24} height={24} />
                  <span className="nf-watch-copy">
                    <span className="nf-watch-kind">{item.kind}</span>
                    <span className="nf-watch-title">{item.title}</span>
                  </span>
                </button>
                {item.owner ? (
                  <span className="nf-owner">
                    <img src={nf.avatarArthur} alt="" width={24} height={24} />
                    {item.owner}
                  </span>
                ) : null}
                <span className="nf-watch-date">{item.date}</span>
                <button
                  type="button"
                  className="nf-icon-btn"
                  aria-label={`More for ${item.title}`}
                  onClick={() => ping("More")}
                >
                  <img src={nf.more} alt="" width={24} height={24} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
      {side?.kind === "track" ? (
        <TrackPanel
          key={`track-${side.story.id}`}
          story={side.story}
          onClose={() => setSide(null)}
          onDraft={() => {
            setSide(null);
            ping("Saved as a draft. Pick it up from Your Watchlist.");
          }}
          onStart={() => {
            setTracked((current) => [...current, side.story.id]);
            setSide(null);
            ping("Custom report created. Find it in Your Watchlist.");
          }}
        />
      ) : side ? (
        <SideChat
          key={side.kind === "theme" ? side.story.id : "refine"}
          context={side}
          summary={`${stories.length} themes · ${time}`}
          onClose={() => setSide(null)}
        />
      ) : null}
      {openTheme ? (
        <ThemePage
          story={openTheme}
          tracked={tracked.includes(openTheme.id)}
          vote={votes[openTheme.id] ?? null}
          onClose={() => setOpenTheme(null)}
          onAsk={() => askTheme(openTheme)}
          onVote={(next) => voteTheme(openTheme.id, next)}
          onTrack={() => trackTheme(openTheme)}
          onOpenPost={(index) => openThemePost(openTheme, index)}
          number={visible.findIndex((item) => item.id === openTheme.id) + 1}
          related={visible
            .filter((item) => item.theme.id !== openTheme.theme.id)
            .filter((item, index, list) => list.findIndex((other) => other.theme.id === item.theme.id) === index)
            .slice(0, 3)}
          onOpenTheme={setOpenTheme}
        />
      ) : null}
      {openPost ? (
        <NewsfeedPost
          post={openPost}
          onClose={() => setOpenPost(null)}
          onPrev={openPost.queue ? () => openPick(openPost.queue!.index - 1) : undefined}
          onNext={openPost.queue ? () => openPick(openPost.queue!.index + 1) : undefined}
          onAction={(action) => {
            if (action === "Skip" && openPost.queue) {
              openPick(openPost.queue.index + 1);
              return;
            }
            if (action === "Skip") setOpenPost(null);
            ping(
              action === "Copy link"
                ? "Link copied"
                : action === "Skip"
                  ? "Skipped. We’ll show you the next one."
                  : action,
            );
          }}
        />
      ) : null}
      {toast ? <p className="nf-toast">{toast}</p> : null}
    </div>
  );
}

type SideContext = { kind: "refine" } | { kind: "theme"; story: Story } | { kind: "track"; story: Story };

type SideMessage = { from: "user" | "ai"; text: string };

const REFINE_SUGGESTIONS = [
  {
    text: "Show fewer brow themes",
    reply: "Done. I’ll show fewer brow themes in your top 5. The full list stays the same for your team.",
  },
  {
    text: "Lead with complaints and risks",
    reply: "Got it. Themes about complaints and risks will move to the top of your feed.",
  },
  {
    text: "Only show themes with 100+ posts",
    reply: "Okay. Smaller themes will still be in the full list, just not in your top 5.",
  },
];

function themeSuggestions(story: Story) {
  const { product, category } = story.about;
  return [
    {
      text: `Summarize what creators say about ${product}`,
      reply: `Most creators praise ${product}’s hold and how easy it is to apply. A few mention it feels stiff by the end of the day.`,
    },
    {
      text: "Find the top creators in this theme",
      reply:
        "The top 3 creators by engagement are @uhodom_edinym, @browsbymia and @glowwithtess. Want me to add them to a list?",
    },
    {
      text: "Turn this into a report",
      reply: `I’ll draft a report on ${product} with the key posts, stats and quotes. It’ll show up in Your Watchlist.`,
    },
    {
      text: `How do reviews online compare ${product} to other ${category.toLowerCase()}?`,
      reply: `Across review sites and Reddit, ${product} comes out ahead on performance. People who want a softer finish lean toward other brands.`,
    },
  ];
}

type SideAttachment = {
  id: string;
  title: string;
  sub: string;
  thumb?: string;
  icon?: string;
};

export function ThemeChat({
  theme,
  question,
  suggestions,
  onClose,
}: {
  theme: GridTheme;
  question?: { text: string; reply: string };
  suggestions?: { text: string; reply: string }[];
  onClose: () => void;
}) {
  const story = STORIES.find((item) => item.theme.id === theme.id) ?? STORIES[0];
  return (
    <SideChat
      context={{ kind: "theme", story }}
      summary={`${story.posts} posts · ${story.ago}`}
      firstQuestion={question}
      suggestions={suggestions}
      onClose={onClose}
    />
  );
}

function SideChat({
  context,
  summary,
  firstQuestion,
  suggestions: suggestionsOverride,
  onClose,
}: {
  context: Exclude<SideContext, { kind: "track" }>;
  summary: string;
  firstQuestion?: { text: string; reply: string };
  suggestions?: { text: string; reply: string }[];
  onClose: () => void;
}) {
  const isTheme = context.kind === "theme";
  const feed: SideAttachment = {
    id: "feed",
    title: "Feed Stories",
    sub: summary,
    icon: nf.preferences,
  };
  const initial: SideAttachment[] = isTheme
    ? [
        {
          id: "theme",
          title: context.story.heading,
          sub: "Theme",
          thumb: context.story.theme.posts[0].src,
        },
        feed,
      ]
    : [
        feed,
        {
          id: "prefs",
          title: "Your preferences",
          sub: "Saved feedback",
          icon: nf.saved,
        },
      ];

  const [messages, setMessages] = useState<SideMessage[]>(
    firstQuestion
      ? [
          { from: "user", text: firstQuestion.text },
          { from: "ai", text: firstQuestion.reply },
        ]
      : [],
  );
  const [value, setValue] = useState("");
  const [attached, setAttached] = useState(initial);
  const [tab, setTab] = useState<"chat" | "prefs">(isTheme ? "chat" : "prefs");
  const thread = useRef<HTMLDivElement>(null);

  const suggestions = suggestionsOverride ?? (isTheme ? themeSuggestions(context.story) : REFINE_SUGGESTIONS);
  const title = isTheme ? "What insights are we after today?" : "Refine your feed";
  const intro = isTheme
    ? "Start with this theme, or ask about anything on the internet, like reviews, competitors or news."
    : "Tell me what you want more or less of. I’ll reorder your top 5. The full list stays the same for your team.";

  useEffect(() => {
    thread.current?.scrollTo({
      top: thread.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = (text: string, reply?: string) => {
    setMessages((current) => [
      ...current,
      { from: "user", text },
      {
        from: "ai",
        text:
          reply ??
          (isTheme ? "On it. I’ll use this theme as context." : "Got it. I’ll use that to reorder your top 5."),
      },
    ]);
    setValue("");
  };

  return (
    <aside className="nf-side" aria-label={title}>
      <header className="nf-side-top">
        <p className="nf-side-brand">
          <img className="nf-side-logo" src={nf.plotLogo} alt="" width={24} height={24} />
          Ask Plot
        </p>
        <div className="nf-side-actions">
          <button
            type="button"
            className="nf-icon-btn"
            aria-label="New chat"
            onClick={() => {
              setMessages([]);
              setValue("");
              setAttached(initial);
            }}
          >
            <img src={nf.newChat} alt="" width={20} height={20} />
          </button>
          <button type="button" className="nf-icon-btn" aria-label="Close chat" onClick={onClose}>
            <img src={nf.close} alt="" width={24} height={24} />
          </button>
        </div>
      </header>
      {isTheme ? null : (
        <div className="nf-side-tabs" role="tablist" aria-label="Preferences">
          <button type="button" role="tab" aria-selected={tab === "prefs"} onClick={() => setTab("prefs")}>
            Preferences
          </button>
          <button type="button" role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")}>
            Chat
          </button>
        </div>
      )}
      {tab === "prefs" ? (
        <RefinePreferences />
      ) : (
        <>
          <div className="nf-side-thread" ref={thread}>
            <div className="nf-side-intro">
              <h2>{title}</h2>
              <p>{intro}</p>
            </div>
            {messages.length === 0 ? (
              <ul className="nf-side-suggestions">
                {suggestions.map((item) => (
                  <li key={item.text}>
                    <button type="button" onClick={() => send(item.text, item.reply)}>
                      <span className="nf-side-dot" aria-hidden="true" />
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              messages.map((message, index) =>
                message.from === "user" ? (
                  <UserBubble key={index} text={message.text} />
                ) : (
                  <AssistantBubble key={index} text={message.text} />
                ),
              )
            )}
          </div>
          <div className="nf-side-composer">
            <Composer
              value={value}
              onChange={setValue}
              onSubmit={() => send(value.trim())}
              placeholder={isTheme ? "Ask about this theme or anything online" : "Ask for more or less of something"}
              sendSize={32}
              toolbar={
                <button type="button" className="nf-side-add" aria-label="Add files or text">
                  +
                </button>
              }
            >
              {attached.length ? (
                <div className="nf-side-contexts">
                  {attached.map((item) => (
                    <div key={item.id} className="nf-side-context">
                      {item.thumb ? (
                        <img className="nf-side-context-thumb" src={item.thumb} alt="" />
                      ) : (
                        <span className="nf-side-context-icon">
                          <img src={item.icon} alt="" width={16} height={16} />
                        </span>
                      )}
                      <span className="nf-side-context-copy">
                        <strong>{item.title}</strong>
                        <span>{item.sub}</span>
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setAttached((current) => current.filter((entry) => entry.id !== item.id));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </Composer>
          </div>
        </>
      )}
    </aside>
  );
}

const TRACK_TIMEFRAMES = ["Last 30 days", "Last 3 months", "Last 6 months", "Last 12 months"];

type TrackCriteria = {
  timeframe: string | null;
  keywords: string[];
  match: string | null;
};
type TrackOption = {
  label: string;
  apply: (criteria: TrackCriteria) => TrackCriteria;
  reply?: string;
};

function trackQuestions(story: Story): { ask: (criteria: TrackCriteria) => string; options: TrackOption[] }[] {
  const { product } = story.about;
  return [
    {
      ask: () => `I turned “${story.heading}” into a draft custom report. First, how far back should I look?`,
      options: TRACK_TIMEFRAMES.map((label) => ({
        label,
        apply: (criteria) => ({ ...criteria, timeframe: label }),
      })),
    },
    {
      ask: (criteria) =>
        `I pulled these keywords from the theme: ${criteria.keywords.join(", ")}. Keep them, or add more?`,
      options: [
        { label: "Keep these", apply: (criteria) => criteria },
        {
          label: `Add “${product.toLowerCase()} dupe”`,
          apply: (criteria) => ({
            ...criteria,
            keywords: [...criteria.keywords, `${product.toLowerCase()} dupe`],
          }),
        },
        {
          label: "I’ll type my own",
          apply: (criteria) => criteria,
          reply: "Type keywords below, separated by commas.",
        },
      ],
    },
    {
      ask: () => "Last one. What should count as a match?",
      options: [
        "Any post with these keywords",
        `Only posts that show ${product}`,
        "Only creators already in this theme",
      ].map((label) => ({
        label,
        apply: (criteria) => ({ ...criteria, match: label }),
      })),
    },
  ];
}

function TrackPanel({
  story,
  onClose,
  onDraft,
  onStart,
}: {
  story: Story;
  onClose: () => void;
  onDraft: () => void;
  onStart: () => void;
}) {
  const { product, category, angle, format, claim } = story.about;
  const start: TrackCriteria = {
    timeframe: null,
    keywords: [product, category, angle, format, claim].map((word) => word.toLowerCase()),
    match: null,
  };
  const questions = trackQuestions(story);

  const [tab, setTab] = useState<"chat" | "criteria">("chat");
  const [criteria, setCriteria] = useState(start);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<SideMessage[]>([{ from: "ai", text: questions[0].ask(start) }]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [seen, setSeen] = useState(true);
  const thread = useRef<HTMLDivElement>(null);
  const done = step >= questions.length;

  useEffect(() => {
    thread.current?.scrollTo({
      top: thread.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, tab]);

  const advance = (answer: string, next: TrackCriteria, reply?: string) => {
    setCriteria(next);
    setSeen(false);
    if (reply) {
      setTyping(true);
      setMessages((current) => [...current, { from: "user", text: answer }, { from: "ai", text: reply }]);
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    setTyping(false);
    const followUp =
      nextStep < questions.length
        ? questions[nextStep].ask(next)
        : "All set. Check the criteria, then start tracking. I’ll add new matching posts to Your Watchlist every day.";
    setMessages((current) => [...current, { from: "user", text: answer }, { from: "ai", text: followUp }]);
  };

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    setValue("");
    if (step === 1) {
      const added = text
        .split(",")
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean);
      advance(text, {
        ...criteria,
        keywords: [...new Set([...criteria.keywords, ...added])],
      });
    } else if (step === 0) {
      advance(text, { ...criteria, timeframe: text });
    } else if (step === 2) {
      advance(text, { ...criteria, match: text });
    } else {
      setMessages((current) => [
        ...current,
        { from: "user", text },
        { from: "ai", text: "Got it. I’ll note that on the report." },
      ]);
    }
  };

  const reset = () => {
    setCriteria(start);
    setStep(0);
    setTyping(false);
    setValue("");
    setMessages([{ from: "ai", text: questions[0].ask(start) }]);
  };

  return (
    <aside className="nf-side" aria-label="Track this theme">
      <header className="nf-side-top">
        <p className="nf-side-brand">
          <img className="nf-side-logo" src={nf.plotLogo} alt="" width={24} height={24} />
          Track theme
        </p>
        <div className="nf-side-actions">
          <button type="button" className="nf-icon-btn" aria-label="Start over" onClick={reset}>
            <img src={nf.newChat} alt="" width={20} height={20} />
          </button>
          <button type="button" className="nf-icon-btn" aria-label="Close" onClick={onClose}>
            <img src={nf.close} alt="" width={24} height={24} />
          </button>
        </div>
      </header>
      <div className="nf-side-tabs" role="tablist" aria-label="Track theme">
        <button type="button" role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")}>
          Chat
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "criteria"}
          onClick={() => {
            setTab("criteria");
            setSeen(true);
          }}
        >
          Criteria
          {!seen && tab !== "criteria" ? <span className="nf-side-tab-dot" aria-label="Updated" /> : null}
        </button>
      </div>

      {tab === "chat" ? (
        <>
          <div className="nf-side-thread" ref={thread}>
            <div className="nf-side-intro">
              <h2>Let’s set up tracking.</h2>
              <p>Three quick questions, then I’ll keep this theme up to date in Your Watchlist.</p>
            </div>
            {messages.map((message, index) =>
              message.from === "user" ? (
                <UserBubble key={index} text={message.text} />
              ) : (
                <AssistantBubble key={index} text={message.text} />
              ),
            )}
            {!done && !typing ? (
              <ul className="nf-side-suggestions">
                {questions[step].options.map((option) => (
                  <li key={option.label}>
                    <button type="button" onClick={() => advance(option.label, option.apply(criteria), option.reply)}>
                      <span className="nf-side-dot" aria-hidden="true" />
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {done ? (
              <div className="nf-track-done">
                <button type="button" className="nf-btn is-sm is-soft" onClick={() => setTab("criteria")}>
                  Review criteria
                </button>
                <button type="button" className="nf-midcard-submit" onClick={onStart}>
                  Generate custom report
                </button>
              </div>
            ) : null}
          </div>
          <div className="nf-side-composer">
            <Composer
              value={value}
              onChange={setValue}
              onSubmit={submit}
              placeholder={step === 1 ? "Add keywords, separated by commas" : "Reply…"}
              sendSize={32}
            />
          </div>
        </>
      ) : (
        <>
          <div className="nf-track-criteria">
            <div className="nf-track-cover" style={{ background: story.theme.band.ink }}>
              <img src={story.theme.posts[0].src} alt="" />
            </div>
            <h3>{story.heading}</h3>
            <p className="nf-track-summary">{story.theme.summary}</p>
            <TrackField label="Timeframe" empty={!criteria.timeframe}>
              {criteria.timeframe}
            </TrackField>
            <TrackField label="Keywords" empty={!criteria.keywords.length}>
              <div className="nf-track-chips">
                {criteria.keywords.map((word) => (
                  <span key={word} className="nf-pill is-quiet nf-track-chip">
                    {word}
                    <button
                      type="button"
                      aria-label={`Remove ${word}`}
                      onClick={() =>
                        setCriteria((current) => ({
                          ...current,
                          keywords: current.keywords.filter((item) => item !== word),
                        }))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </TrackField>
            <TrackField label="Content tracking" empty={!criteria.match}>
              {criteria.match}
            </TrackField>
          </div>
          <footer className="nf-track-foot">
            <button type="button" className="nf-btn is-sm" onClick={onDraft}>
              Save as draft
            </button>
            <button type="button" className="nf-midcard-submit" disabled={!done} onClick={onStart}>
              Generate custom report
            </button>
          </footer>
        </>
      )}
    </aside>
  );
}

function TrackField({ label, empty, children }: { label: string; empty: boolean; children: ReactNode }) {
  return (
    <div className={empty ? "nf-track-field is-empty" : "nf-track-field"}>
      <h4>{label}</h4>
      {empty ? <p>Not set yet</p> : typeof children === "string" ? <p>{children}</p> : children}
    </div>
  );
}

function PickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="nf-stat">
      <span className="nf-stat-label">{label}</span>
      <span className="nf-stat-value">{value}</span>
    </div>
  );
}

const ROLES = ["Community management", "Creator partnerships", "Social media", "Insights", "Leadership"] as const;

const CATCH_FIRST = [
  "What people say about us",
  "Risks and complaints",
  "Category trends",
  "Competitors",
  "Cultural moments",
  "Rising creators",
] as const;

const PACE = ["While it's rising", "Once it's big"] as const;

function RefinePreferences() {
  const [role, setRole] = useState<string | null>(null);
  const [catchFirst, setCatchFirst] = useState<string[]>([]);
  const [pace, setPace] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const change =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setSaved(false);
    };
  const toggleCatch = (label: string) =>
    change(setCatchFirst)(
      catchFirst.includes(label)
        ? catchFirst.filter((item) => item !== label)
        : catchFirst.length >= 3
          ? catchFirst
          : [...catchFirst, label],
    );

  return (
    <>
      <div className="nf-track-criteria">
        <p className="nf-track-summary">
          We’ll use these to order your top themes. The shared list stays the same for everyone.
        </p>
        <div className="nf-track-field">
          <h4>What’s your role?</h4>
          <div className="nf-midcard-pills">
            {ROLES.map((label) => (
              <Pill key={label} quiet on={role === label} onClick={() => change(setRole)(label)}>
                {label}
              </Pill>
            ))}
          </div>
        </div>
        <div className="nf-track-field">
          <h4>What should we catch first?</h4>
          <p>Pick up to 3.</p>
          <div className="nf-midcard-pills">
            {CATCH_FIRST.map((label) => (
              <Pill key={label} quiet on={catchFirst.includes(label)} onClick={() => toggleCatch(label)}>
                {label}
              </Pill>
            ))}
          </div>
        </div>
        <div className="nf-track-field">
          <h4>Early, or already big?</h4>
          <div className="nf-midcard-pills">
            {PACE.map((label) => (
              <Pill key={label} quiet on={pace === label} onClick={() => change(setPace)(label)}>
                {label}
              </Pill>
            ))}
          </div>
        </div>
      </div>
      <footer className="nf-track-foot">
        <button type="button" className="nf-midcard-submit" disabled={saved} onClick={() => setSaved(true)}>
          {saved ? "Saved" : "Save preferences"}
        </button>
      </footer>
    </>
  );
}

function ThemePage({
  story,
  number,
  related,
  tracked,
  vote,
  onClose,
  onAsk,
  onVote,
  onTrack,
  onOpenPost,
  onOpenTheme,
}: {
  story: Story;
  number: number;
  related: Story[];
  tracked: boolean;
  vote: "up" | "down" | null;
  onClose: () => void;
  onAsk: () => void;
  onVote: (next: "up" | "down") => void;
  onTrack: () => void;
  onOpenPost: (index: number) => void;
  onOpenTheme: (story: Story) => void;
}) {
  const { theme, about } = story;
  const body = useRef<HTMLDivElement>(null);
  const [lead, second, third] = [0, 1, 2].map((index) => theme.posts[index % theme.posts.length]);
  const highlights = [
    {
      post: lead,
      index: 0,
      title: `The post everyone is stitching.`,
      copy: `${lead.handle} shows ${about.product} up close, and the ${about.angle} moment is what people keep replaying in the comments.`,
      stat: `${compactNumber(Math.round(theme.stats.views * 0.34))} views`,
    },
    {
      post: second,
      index: 1,
      title: `${about.format} lead the way.`,
      copy: `Most of the ${theme.stats.posts} posts are ${about.format.toLowerCase()}. They feel personal, so viewers trust the result more than an ad.`,
      stat: `${compactNumber(Math.round(theme.stats.engagement * 0.22))} engagements`,
    },
  ];
  const signals = [
    {
      lead: `${about.claim} come up again and again.`,
      copy: `Creators test ${about.product} against a full day and share the before and after.`,
      seen: Math.round(theme.stats.posts * 0.41),
    },
    {
      lead: `${about.category} comparisons.`,
      copy: `Viewers ask how it stacks up against other ${about.category.toLowerCase()} in the comments.`,
      seen: Math.round(theme.stats.posts * 0.27),
    },
    {
      lead: "A few mixed reactions.",
      copy: "Some viewers say the results look filtered or ask for an unedited version.",
      seen: Math.round(theme.stats.posts * 0.09),
    },
  ];

  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [story.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector(".nf-post-scrim")) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="nf-theme-page" role="dialog" aria-modal="true" aria-label={story.heading}>
      <header className="tp-mast">
        <div className="tp-mast-side">
          <button type="button" className="nf-icon-btn" aria-label="Back to Feed Stories" onClick={onClose}>
            <img src={nf.back} alt="" width={20} height={20} />
          </button>
          <span>Updated {theme.ago}</span>
          <span className="tp-mast-dot" aria-hidden="true" />
          <span>{about.category}</span>
        </div>
        <p className="tp-mast-title">Feed Stories</p>
        <div className="tp-mast-side is-end">
          <span>
            Theme No. <strong>{String(number).padStart(2, "0")}</strong>
          </span>
          <span className="tp-mast-dot" aria-hidden="true" />
          <span>
            <strong>{compactNumber(theme.stats.posts)}</strong> posts
          </span>
          <button type="button" className="nf-icon-btn" aria-label="Close theme" onClick={onClose}>
            <img src={nf.close} alt="" width={24} height={24} />
          </button>
        </div>
      </header>

      <div className="tp-body" ref={body} key={story.id}>
        <section className="tp-intro">
          <h1>{story.heading}</h1>
          <p className="tp-prose">{theme.summary}</p>
          <div className="tp-actions">
            <button type="button" className="cc-btn" onClick={onAsk}>
              <img src={nf.sparkles} alt="" />
              Ask AI
            </button>
            <button type="button" className="cc-btn" aria-pressed={tracked} onClick={onTrack}>
              <img src={nf.track} alt="" />
              {tracked ? "Report created" : "Generate custom report"}
            </button>
            <div className="nf-votes">
              <button
                type="button"
                className={vote === "up" ? "nf-vote is-up is-on" : "nf-vote is-up"}
                aria-pressed={vote === "up"}
                aria-label="Useful"
                onClick={() => onVote("up")}
              >
                <img src={nf.like} alt="" width={16} height={16} />
              </button>
              <button
                type="button"
                className={vote === "down" ? "nf-vote is-down is-on" : "nf-vote is-down"}
                aria-pressed={vote === "down"}
                aria-label="Not for me"
                onClick={() => onVote("down")}
              >
                <img src={nf.dislike} alt="" width={16} height={16} />
              </button>
            </div>
          </div>
        </section>

        <section
          className={theme.backdrop && story.theme.id === "nyx" ? "tp-feature has-backdrop" : "tp-feature"}
          aria-label="Featured posts"
        >
          {theme.backdrop && story.theme.id === "nyx" ? (
            <img className="tp-feature-bg" src={theme.backdrop} alt="" />
          ) : null}
          {[second, lead, third].map((post, index) => (
            <button
              key={index}
              type="button"
              className={index === 1 ? "tp-feature-post is-lead" : "tp-feature-post"}
              aria-label={`Open post from ${post.handle}`}
              onClick={() => onOpenPost(index)}
            >
              <span className="fc-post-inner">
                <img src={post.src} alt="" />
                <span className="fc-handle">{post.handle}</span>
                <span className="fc-caption">{CAPTION}</span>
              </span>
            </button>
          ))}
        </section>

        <div className="tp-stats">
          <span>
            Posts<strong>{compactNumber(theme.stats.posts)}</strong>
          </span>
          <span>
            View count<strong>{compactNumber(theme.stats.views)}</strong>
          </span>
          <span>
            Total engagement<strong>{compactNumber(theme.stats.engagement)}</strong>
          </span>
        </div>

        <p className="tp-prose">
          The conversation started {theme.ago.replace(" ago", "")} ago and is still growing. Creators keep coming back
          to {about.angle}, and the comments are full of people asking where to buy {about.product}.
        </p>

        {highlights.map((item, index) => (
          <section key={item.title} className={index % 2 ? "tp-row is-flipped" : "tp-row"}>
            <button
              type="button"
              className="tp-row-media"
              aria-label={`Open post from ${item.post.handle}`}
              onClick={() => onOpenPost(item.index)}
            >
              <img src={item.post.src} alt="" />
            </button>
            <div className="tp-row-copy">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <p className="tp-byline">
                <img src={item.post.src} alt="" />
                <span>
                  <em>posted by</em>
                  {item.post.handle} · {item.stat}
                </span>
              </p>
            </div>
          </section>
        ))}

        <section className="tp-more">
          <h2>What else we’re seeing</h2>
          <ul>
            {signals.map((item) => (
              <li key={item.lead}>
                <strong>{item.lead}</strong> {item.copy}
                <em>Seen in {item.seen} posts.</em>
              </li>
            ))}
          </ul>
          <p className="tp-prose">
            …plus a lot more. Ask AI to dig into any of these, or start tracking to get a daily update when new posts
            come in.
          </p>
        </section>

        {related.length ? (
          <section className="tp-related">
            <h2>More themes</h2>
            <div className="tp-related-row">
              {related.map((item) => (
                <button key={item.id} type="button" className="tp-related-card" onClick={() => onOpenTheme(item)}>
                  <span className="tp-related-meta">
                    {item.theme.ago} · {compactNumber(item.theme.stats.posts)} posts
                  </span>
                  <strong>{item.heading}</strong>
                  <img src={item.theme.posts[0].src} alt="" />
                </button>
              ))}
            </div>
            <button type="button" className="nf-btn nf-more" onClick={onClose}>
              Back to all themes
            </button>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function compactNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(value);
}

const LESS_REASONS = [
  "Not about this brand",
  "Not useful",
  "This content is repetitive",
  "This is our own content",
] as const;

export function ThemeLessFeedback({
  theme,
  onUndo,
  onSave,
}: {
  theme: GridTheme;
  onUndo: () => void;
  onSave: () => void;
}) {
  const story = STORIES.find((item) => item.theme.id === theme.id) ?? STORIES[0];
  return <LessLikeThis story={story} onUndo={onUndo} onSave={onSave} />;
}

function LessLikeThis({
  story,
  wide,
  onUndo,
  onSave,
}: {
  story: Story;
  wide?: boolean;
  onUndo: () => void;
  onSave: () => void;
}) {
  const { product, category, format, claim } = story.about;
  const less = [product, category, format, claim];

  const [reasons, setReasons] = useState<string[]>([]);
  const [writeIn, setWriteIn] = useState(false);
  const [note, setNote] = useState("");
  const [fewer, setFewer] = useState<string[]>([]);

  const toggle = (label: string) => (current: string[]) =>
    current.includes(label) ? current.filter((item) => item !== label) : [...current, label];

  return (
    <aside className={wide ? "nf-less tg-span" : "nf-less"} aria-label={`Feedback on ${story.heading}`}>
      <div className="nf-less-head">
        <h3>We’ll suggest fewer themes like this.</h3>
        <button type="button" className="nf-less-undo" onClick={onUndo}>
          Undo
        </button>
      </div>
      <LessQuestion title="What’s off about this one?">
        {LESS_REASONS.map((label) => (
          <Pill key={label} quiet on={reasons.includes(label)} onClick={() => setReasons(toggle(label))}>
            {label}
          </Pill>
        ))}
        <Pill quiet on={writeIn} onClick={() => setWriteIn((value) => !value)}>
          Write in your own words
        </Pill>
        {writeIn ? (
          <textarea
            className="nf-less-note"
            aria-label="Tell us what’s off"
            placeholder={`What’s off about “${story.heading}”?`}
            rows={2}
            value={note}
            autoFocus
            onChange={(event) => setNote(event.target.value)}
          />
        ) : null}
      </LessQuestion>
      <LessQuestion title="What should we show less of?">
        {less.map((label) => (
          <Pill key={label} quiet on={fewer.includes(label)} onClick={() => setFewer(toggle(label))}>
            {label}
          </Pill>
        ))}
      </LessQuestion>
      <div className="nf-midcard-save">
        <button type="button" className="nf-midcard-submit" onClick={onSave}>
          Save preferences
        </button>
      </div>
    </aside>
  );
}

const FIT_OPTIONS = ["Spot on", "Somewhat useful", "Not for us"] as const;

export function ThemeFeedbackCard({ theme }: { theme: GridTheme }) {
  const story = STORIES.find((item) => item.theme.id === theme.id) ?? STORIES[0];
  const { product, category, format, claim } = story.about;
  const topics = [product, category, format, claim];

  const [fit, setFit] = useState<string | null>(null);
  const [more, setMore] = useState<string[]>([]);
  const [writeIn, setWriteIn] = useState(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <aside className="nf-less is-thanks" aria-live="polite">
        <h3>Thanks for the feedback.</h3>
        <p className="nf-less-thanks">We’ll use it to shape which themes show up in your newsfeed.</p>
        <button type="button" className="nf-less-undo" onClick={() => setSaved(false)}>
          Undo
        </button>
      </aside>
    );
  }

  return (
    <aside className="nf-less" aria-label={`Feedback on ${story.heading}`}>
      <div className="nf-less-head">
        <h3>How’s this theme?</h3>
      </div>
      <LessQuestion title="How useful is it?">
        {FIT_OPTIONS.map((label) => (
          <Pill key={label} quiet on={fit === label} onClick={() => setFit(fit === label ? null : label)}>
            {label}
          </Pill>
        ))}
      </LessQuestion>
      <LessQuestion title="What do you want to see more of?">
        {topics.map((label) => (
          <Pill
            key={label}
            quiet
            on={more.includes(label)}
            onClick={() =>
              setMore((current) =>
                current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
              )
            }
          >
            {label}
          </Pill>
        ))}
        <Pill quiet on={writeIn} onClick={() => setWriteIn((value) => !value)}>
          Write in your own words
        </Pill>
        {writeIn ? (
          <textarea
            className="nf-less-note"
            aria-label="Tell us more"
            placeholder={`What would make “${story.heading}” more useful?`}
            rows={2}
            value={note}
            autoFocus
            onChange={(event) => setNote(event.target.value)}
          />
        ) : null}
      </LessQuestion>
      <div className="nf-midcard-save">
        <button
          type="button"
          className="nf-midcard-submit"
          disabled={!fit && !more.length && !note.trim()}
          onClick={() => setSaved(true)}
        >
          Save feedback
        </button>
      </div>
    </aside>
  );
}

export function ThemeDownReasons({ onSave }: { onSave: () => void }) {
  const [reasons, setReasons] = useState<string[]>([]);
  const [writeIn, setWriteIn] = useState(false);
  const [note, setNote] = useState("");

  return (
    <div className="nf-down-reasons">
      <LessQuestion title="What’s off about this one?">
        {LESS_REASONS.map((label) => (
          <Pill
            key={label}
            quiet
            on={reasons.includes(label)}
            onClick={() =>
              setReasons((current) =>
                current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
              )
            }
          >
            {label}
          </Pill>
        ))}
        <Pill quiet on={writeIn} onClick={() => setWriteIn((value) => !value)}>
          Write in your own words
        </Pill>
        {writeIn ? (
          <textarea
            className="nf-less-note"
            aria-label="Tell us what’s off"
            rows={2}
            value={note}
            autoFocus
            onChange={(event) => setNote(event.target.value)}
          />
        ) : null}
      </LessQuestion>
      <div className="nf-midcard-save">
        <button type="button" className="nf-midcard-submit" disabled={!reasons.length && !note.trim()} onClick={onSave}>
          Send
        </button>
      </div>
    </div>
  );
}

function LessQuestion({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="nf-less-question">
      <p>{title}</p>
      <div className="nf-midcard-pills">{children}</div>
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="#230603" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeedbackCard({ done, onSave, onSkip }: { done: boolean; onSave: () => void; onSkip: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (topic: string) =>
    setPicked((current) => (current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]));

  if (done) {
    return (
      <aside className="tg-card nf-pulse is-done" aria-live="polite">
        <span className="nf-pulse-check" aria-hidden="true">
          <CheckMark />
        </span>
        <h3>Thanks, we’ll tune your feed.</h3>
        <p className="tg-summary">You’ll see more {picked.join(", ").toLowerCase()} in Feed Stories.</p>
      </aside>
    );
  }

  return (
    <aside className="tg-card nf-pulse" aria-label="Feed feedback">
      <p className="tg-kicker">Quick check</p>
      <h3>What should we surface more of?</h3>
      <p className="tg-summary">Pick a few and we’ll shape your Feed Stories around them.</p>
      <div className="nf-pulse-pills">
        {FEEDBACK_TOPICS.map((topic) => (
          <Pill key={topic} quiet on={picked.includes(topic)} onClick={() => toggle(topic)}>
            {topic}
          </Pill>
        ))}
      </div>
      <div className="nf-pulse-foot">
        <button type="button" className="nf-less-undo" onClick={onSkip}>
          Not now
        </button>
        <button type="button" className="nf-midcard-submit" disabled={!picked.length} onClick={onSave}>
          Save
        </button>
      </div>
    </aside>
  );
}

function Pill({
  on,
  quiet,
  onClick,
  children,
}: {
  on: boolean;
  quiet?: boolean;
  onClick: () => void;
  children: string;
}) {
  const className = ["nf-pill", quiet ? "is-quiet" : "", on ? "is-on" : ""].filter(Boolean).join(" ");
  return (
    <button type="button" className={className} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}

function NfButton({
  icon,
  iconWidth = 16,
  iconHeight = 16,
  size = "md",
  tonal,
  pressed,
  onClick,
  children,
}: {
  icon: string;
  iconWidth?: number;
  iconHeight?: number;
  size?: "sm" | "md";
  tonal?: boolean;
  pressed?: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      className={`nf-btn is-${size}${tonal ? " is-soft" : ""}${pressed ? " is-on" : ""}`}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <span className="nf-btn-icon">
        <img src={icon} alt="" width={iconWidth} height={iconHeight} />
      </span>
      {children}
    </button>
  );
}

type Crumb = { label: string; onClick?: () => void };

export function PlotTopBar({
  crumbs,
  className,
  onBack,
  onAction = () => undefined,
}: {
  crumbs: Crumb[];
  className?: string;
  onBack?: () => void;
  onAction?: (label: string) => void;
}) {
  const trail: Crumb[] = [{ label: "📣 Social Listening" }, { label: "Unwell" }, ...crumbs];
  return (
    <header className={className ? `nf-top ${className}` : "nf-top"}>
      <div className="nf-top-left">
        <button className="nf-icon-btn" type="button" aria-label="Open menu" onClick={() => onAction("Menu")}>
          <img src={nf.menu} alt="" width={24} height={29.051} />
        </button>
        <nav className="nf-crumbs" aria-label="Breadcrumb">
          <button className="nf-icon-btn" type="button" aria-label="Back" onClick={onBack}>
            <img src={nf.back} alt="" width={20} height={20} />
          </button>
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <Fragment key={crumb.label}>
                {index > 0 ? <span className="nf-crumb-sep">/</span> : null}
                {last ? (
                  <span className="nf-crumb is-current" aria-current="page">
                    {crumb.label}
                  </span>
                ) : crumb.onClick ? (
                  <button type="button" className="nf-crumb is-link" onClick={crumb.onClick}>
                    {crumb.label}
                  </button>
                ) : (
                  <span className="nf-crumb">{crumb.label}</span>
                )}
              </Fragment>
            );
          })}
        </nav>
      </div>
      <div className="nf-top-right">
        <div className="nf-faces" aria-label="10 collaborators">
          <img src={nf.avatarBarbara} alt="" width={24} height={24} />
          <img src={nf.avatarBlume} alt="" width={24} height={24} />
          <span className="nf-face-badge">
            <img src={nf.avatarRs} alt="" width={24} height={24} />
            <span className="is-initials">RS</span>
          </span>
          <span className="nf-face-badge">
            <img src={nf.avatarPlus} alt="" width={24} height={24} />
            <span className="is-count">+8</span>
          </span>
        </div>
        <button className="nf-invite" type="button" onClick={() => onAction("Invite link copied")}>
          <img src={nf.invite} alt="" width={16} height={16} />
          Invite
        </button>
        <button
          className="nf-icon-btn"
          type="button"
          aria-label="More options"
          onClick={() => onAction("More options")}
        >
          <MoreVert />
        </button>
      </div>
    </header>
  );
}

function MoreVert() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1D1B20" aria-hidden="true">
      <circle cx="12" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="18" r="2" />
    </svg>
  );
}
