import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { assets } from "./assets";
import { chatAssets } from "./chat-assets";
import { ChatIcon } from "./chat-ui";
import { ob } from "./outbound-assets";
import "./chat.css";
import "./homepage.css";

const TIME_OPTIONS = [
  "All time",
  "Last 7 days",
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "Last 12 months",
  "This year",
  "Custom range",
] as const;

type TimeOption = (typeof TIME_OPTIONS)[number];

const SORTS = [
  { id: "recency", label: "Recency", icon: ob.status },
  { id: "reviewed", label: "Date reviewed", icon: ob.calendar },
  { id: "views", label: "Views", icon: assets.views },
  { id: "likes", label: "Likes", icon: assets.likes },
  { id: "comments", label: "Comments", icon: assets.comments },
  { id: "engagement", label: "Engagement rate", icon: ob.engagement },
  { id: "total", label: "Total engagement", icon: ob.engagement },
  { id: "saves", label: "Saves", icon: assets.saves },
  { id: "shares", label: "Shares", icon: assets.shares },
  { id: "followers", label: "Follower count", icon: assets.followers },
] as const;

type SortId = (typeof SORTS)[number]["id"];

const POST_TYPES = [
  { id: "reels", label: "Reels" },
  { id: "photos", label: "Photos" },
  { id: "carousel", label: "Carousel" },
  { id: "stories", label: "Stories" },
] as const;

type PostType = (typeof POST_TYPES)[number]["id"];

const RELATIONSHIPS = [
  { id: "very-strong", label: "Very strong" },
  { id: "strong", label: "Strong" },
  { id: "neutral", label: "Neutral" },
  { id: "weak", label: "Weak" },
  { id: "very-weak", label: "Very weak" },
] as const;

type Relationship = (typeof RELATIONSHIPS)[number]["id"];

const BRANDS = ["Walmart", "Internet"] as const;
type Brand = (typeof BRANDS)[number];

type Story = {
  id: string;
  kind: "Theme" | "Unique Posts";
  heading: string;
  summary: string;
  ago: string;
  updated?: boolean;
  daysAgo: number;
  lines: 2 | 3;
  more?: boolean;
  brands: Brand[];
  postTypes: PostType[];
  tiktok: boolean;
  shorts: boolean;
  relationship: Relationship;
  reviewed: number;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
  total: number;
  saves: number;
  shares: number;
  followers: number;
  sentiment: string;
  relevancy: string;
  paid: string;
  plays: string;
  language: string;
  signal: string;
  country: string;
  followerBand: string;
};

const STORIES: Story[] = [
  story(
    "1",
    "Theme",
    "Victoria Beckham Beauty Lip Products for 'Milky Lip Combo' Aesthetic",
    "Creators are utilizing Victoria Beckham Beauty's lip liners and glosses to achieve the popular 'milky lip combo' aesthetic. These posts showcase how the brand's lip products contribute to soft, natural-looking lips with a desirable texture and finish, aligning with current lip trends.",
    "6h ago",
    0.25,
    3,
    true,
  ),
  story(
    "2",
    "Theme",
    "Victoria Beckham Beauty Blush Stick in the Shade Rose",
    "Creators are applying Victoria Beckham Beauty’s blush stick in the shade Rose to add color and blend it into a makeup look. These posts show how the cream formula builds a soft flush and sits with the rest of the face.",
    "6h ago",
    0.25,
    3,
  ),
  story(
    "3",
    "Unique Posts",
    "Victoria Beckham Beauty Portofino ’97 Decant Review",
    "A creator reviews Victoria Beckham Beauty Portofino ’97 obtained through a decant service, covering the scent and how it wears.",
    "6h ago",
    0.25,
    3,
  ),
  story(
    "4",
    "Unique Posts",
    "Victoria Beckham Beauty Lip Liner for a Bridal Lip Combo",
    "A professional makeup artist details a bridal lip combo using Victoria Beckham Beauty lip liner to create a fuller look.",
    "6h ago",
    0.25,
    2,
  ),
  story(
    "5",
    "Unique Posts",
    "Victoria Beckham Beauty Foundation Drops for Wedding Guest Makeup",
    "A creator walks through a wedding guest makeup tutorial built on Victoria Beckham Beauty foundation drops.",
    "1d ago",
    1,
    3,
  ),
  story(
    "6",
    "Theme",
    "Victoria Beckham Beauty VICTORIA Fragrance, Peppery Then Sexy",
    "Creators describe Victoria Beckham Beauty’s VICTORIA fragrance as peppery and masculine at first, then sexy as it settles. These posts focus on how the scent shifts through the wear.",
    "2d ago",
    2,
    3,
    false,
    true,
  ),
  story(
    "7",
    "Theme",
    "Victoria Beckham Beauty Bronzer Water Tint for a Subtle Glow",
    "Creators apply Victoria Beckham Beauty’s bronzer water tint to build a light, skin-like glow. These posts show the tint blended into the complexion for a soft, sunlit finish.",
    "5d ago",
    5,
    2,
    false,
    true,
  ),
  story(
    "8",
    "Unique Posts",
    "Victoria Beckham Beauty Contour Stick in a Makeup Routine",
    "A creator uses the Victoria Beckham Beauty contour stick through a makeup routine, placing and blending it to define the face.",
    "40d ago",
    40,
    2,
    false,
    true,
  ),
];

function story(
  id: string,
  kind: Story["kind"],
  heading: string,
  summary: string,
  ago: string,
  daysAgo: number,
  lines: 2 | 3,
  updated = false,
  more = false,
): Story {
  return {
    id,
    kind,
    heading,
    summary,
    ago,
    updated,
    daysAgo,
    lines,
    more,
    brands: ["Walmart", "Internet"],
    postTypes: ["reels", "stories"],
    tiktok: true,
    shorts: true,
    relationship: id === "4" ? "weak" : id === "5" ? "very-weak" : "very-strong",
    reviewed: 10 - Number(id),
    views: 120000 - Number(id) * 8000,
    likes: 9000 - Number(id) * 400,
    comments: 640 - Number(id) * 30,
    engagement: 6.4 - Number(id) * 0.2,
    total: 18000 - Number(id) * 700,
    saves: 1400 - Number(id) * 80,
    shares: 900 - Number(id) * 40,
    followers: 240000 - Number(id) * 12000,
    sentiment: "Positive",
    relevancy: "High",
    paid: "Organic",
    plays: "10k+",
    language: "English",
    signal: "Climbing",
    country: "United States",
    followerBand: "100k–1M",
  };
}

const EXTRA_GROUPS = [
  { id: "followers", label: "Followers", icon: assets.followers, options: ["Under 10k", "10k–100k", "100k–1M", "1M+"] },
  { id: "sentiment", label: "Sentiment", icon: assets.sentiment, options: ["Positive", "Neutral", "Negative"] },
  { id: "relevancy", label: "Topic relevancy", icon: chatAssets.topics, options: ["High", "Medium", "Low"] },
  { id: "paid", label: "Organic/Paid", icon: ob.brandAnalytics, options: ["Organic", "Paid"] },
  { id: "plays", label: "Minimum Play Count", icon: assets.views, options: ["Any", "1k+", "10k+", "100k+"] },
  { id: "language", label: "Language", icon: chatAssets.messages, options: ["English", "Spanish"] },
  { id: "signal", label: "Signal", icon: chatAssets.flash, options: ["New", "Climbing"] },
  { id: "country", label: "Country", icon: ob.platforms, options: ["United States", "International"] },
] as const;

type ExtraId = (typeof EXTRA_GROUPS)[number]["id"];

const TIME_LIMIT: Record<Exclude<TimeOption, "All time" | "Custom range">, number> = {
  "Last 7 days": 7,
  "Last 30 days": 30,
  "Last 3 months": 92,
  "Last 6 months": 183,
  "Last 12 months": 365,
  "This year": 266,
};

export function Homepage() {
  const [toast, setToast] = useState<string | null>(null);
  const [menu, setMenu] = useState<"time" | "sort" | "filters" | null>(null);
  const [time, setTime] = useState<TimeOption>("Last 7 days");
  const [range, setRange] = useState({ from: "", to: "" });
  const [sort, setSort] = useState<SortId>("recency");
  const [brand, setBrand] = useState<Brand>("Walmart");
  const [postTypes, setPostTypes] = useState<PostType[]>(["reels", "stories"]);
  const [instagram, setInstagram] = useState(true);
  const [tiktok, setTiktok] = useState(true);
  const [shorts, setShorts] = useState(true);
  const [relationships, setRelationships] = useState<Relationship[]>(["very-strong", "weak", "very-weak"]);
  const [openSections, setOpenSections] = useState<string[]>(["platform", "instagram", "relationship"]);
  const [extras, setExtras] = useState<Record<ExtraId, string[]>>({
    followers: [],
    sentiment: [],
    relevancy: [],
    paid: [],
    plays: [],
    language: [],
    signal: [],
    country: [],
  });
  const [showMore, setShowMore] = useState(false);
  const [tracked, setTracked] = useState<string[]>([]);
  const barRef = useRef<HTMLDivElement>(null);

  const ping = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
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

  const visible = useMemo(() => {
    const matched = STORIES.filter((item) => {
      if (!showMore && item.more) return false;
      if (!item.brands.includes(brand)) return false;
      if (!withinTime(item, time, range)) return false;
      if (!matchesPlatform(item, { instagram, postTypes, tiktok, shorts })) return false;
      if (!relationships.includes(item.relationship)) return false;
      return EXTRA_GROUPS.every((group) => {
        const picked = extras[group.id];
        if (!picked.length || picked.includes("Any")) return true;
        const value = group.id === "followers" ? item.followerBand : item[group.id];
        return picked.includes(value);
      });
    });
    return [...matched].sort((a, b) => compareStories(a, b, sort));
  }, [brand, extras, instagram, postTypes, range, relationships, shorts, showMore, sort, tiktok, time]);

  const toggle = <T extends string>(list: T[], value: T, set: (next: T[]) => void) => {
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const sortLabel = SORTS.find((item) => item.id === sort)?.label ?? "Recency";

  return (
    <div className="home-lab">
      <div className="home">
        <header className="home-top">
          <div className="home-top-left">
            <button className="home-icon-btn" type="button" aria-label="Open menu" onClick={() => ping("Menu")}>
              <ChatIcon src={chatAssets.sidebar} size={24} />
            </button>
            <button className="home-crumb" type="button" onClick={() => ping("Back")}>
              <ChatIcon src={chatAssets.back} size={16} />
              <p>
                Social Listening / Unwell / <strong>Home</strong>
              </p>
            </button>
          </div>
          <div className="home-top-right">
            <div className="home-faces" aria-hidden="true">
              <img src={chatAssets.avatarRhea} alt="" width={24} height={24} />
              <img src={ob.avatar} alt="" width={24} height={24} />
            </div>
            <button className="home-invite" type="button" onClick={() => ping("Invite sent to clipboard")}>
              <ChatIcon src={ob.invite} size={16} />
              Invite
            </button>
          </div>
        </header>

        <div className="home-main">
          <div className="feed-wrap">
            <div className="feed-toolbar">
              <h1 className="feed-title">Feed Stories</h1>
              <header className="feed-head">
              <div className="feed-brands" role="radiogroup" aria-label="Brand">
                {BRANDS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    className={`feed-brand${brand === option ? " is-on" : ""}`}
                    aria-checked={brand === option}
                    onClick={() => setBrand(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              </header>
            </div>

            <div className="feed-bar" ref={barRef}>
              <div className="feed-controls">
                <button
                  type="button"
                  className={`feed-control${menu === "time" ? " is-open" : ""}`}
                  aria-expanded={menu === "time"}
                  onClick={() => setMenu(menu === "time" ? null : "time")}
                >
                  <ChatIcon src={ob.calendar} size={16} />
                  <span>{time}</span>
                  <ChatIcon src={chatAssets.caretDown16} size={16} />
                </button>
                <button
                  type="button"
                  className={`feed-control${menu === "sort" ? " is-open" : ""}`}
                  aria-expanded={menu === "sort"}
                  onClick={() => setMenu(menu === "sort" ? null : "sort")}
                >
                  <ChatIcon src={ob.sortCol} size={16} />
                  <span>Sort by {sortLabel}</span>
                  <ChatIcon src={chatAssets.caretDown16} size={16} />
                </button>
                <button
                  type="button"
                  className={`feed-control${menu === "filters" ? " is-open" : ""}`}
                  aria-expanded={menu === "filters"}
                  onClick={() => setMenu(menu === "filters" ? null : "filters")}
                >
                  <ChatIcon src={ob.filter} size={16} />
                  <span>Filters</span>
                  <ChatIcon src={chatAssets.caretDown16} size={16} />
                </button>
              </div>

              {menu === "time" ? (
                <div className="feed-menu feed-menu-time" role="menu" aria-label="Timeframe">
                  {TIME_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="menuitemradio"
                      aria-checked={time === option}
                      className={`feed-option${time === option ? " is-on" : ""}`}
                      onClick={() => {
                        setTime(option);
                        if (option !== "Custom range") setMenu(null);
                      }}
                    >
                      <span className="feed-radio" />
                      <span>{option}</span>
                      {option === "Custom range" ? <span className="feed-option-caret" aria-hidden="true" /> : null}
                    </button>
                  ))}
                  {time === "Custom range" ? (
                    <div className="feed-range">
                      <label>
                        From
                        <input
                          type="date"
                          value={range.from}
                          onChange={(event) => setRange({ ...range, from: event.target.value })}
                        />
                      </label>
                      <label>
                        To
                        <input
                          type="date"
                          value={range.to}
                          onChange={(event) => setRange({ ...range, to: event.target.value })}
                        />
                      </label>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {menu === "sort" ? (
                <div className="feed-menu feed-menu-sort" role="menu" aria-label="Sort">
                  {SORTS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={sort === option.id}
                      className={`feed-option${sort === option.id ? " is-on" : ""}`}
                      onClick={() => {
                        setSort(option.id);
                        setMenu(null);
                      }}
                    >
                      <ChatIcon src={option.icon} size={16} />
                      <span>{option.label}</span>
                      {sort === option.id ? <span className="feed-tick" aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              ) : null}

              {menu === "filters" ? (
                <div className="feed-menu feed-menu-filters" role="dialog" aria-label="Posts filters">
                  <FilterSection
                    label="Platform"
                    icon={ob.platforms}
                    open={openSections.includes("platform")}
                    onToggle={() => toggle(openSections, "platform", setOpenSections)}
                  >
                    <div className="feed-nest">
                      <div className="feed-platform">
                        <button
                          type="button"
                          className={`feed-disclosure${openSections.includes("instagram") ? " is-open" : ""}`}
                          aria-expanded={openSections.includes("instagram")}
                          onClick={() => toggle(openSections, "instagram", setOpenSections)}
                        >
                          <ChatIcon src={chatAssets.caretDown16} size={14} />
                        </button>
                        <Check on={instagram} label="Instagram" onToggle={() => setInstagram((value) => !value)} />
                      </div>
                      {openSections.includes("instagram") ? (
                        <div className="feed-sub">
                          <p>Post Type</p>
                          {POST_TYPES.map((type) => (
                            <Check
                              key={type.id}
                              on={postTypes.includes(type.id)}
                              label={type.label}
                              onToggle={() => toggle(postTypes, type.id, setPostTypes)}
                            />
                          ))}
                        </div>
                      ) : null}
                      <Check on={tiktok} label="TikTok" trailing onToggle={() => setTiktok((value) => !value)} />
                      <Check
                        on={shorts}
                        label="YouTube Shorts"
                        trailing
                        onToggle={() => setShorts((value) => !value)}
                      />
                    </div>
                  </FilterSection>

                  <FilterSection
                    label="Relationship strength"
                    icon={assets.followers}
                    open={openSections.includes("relationship")}
                    faces
                    onToggle={() => toggle(openSections, "relationship", setOpenSections)}
                  >
                    {RELATIONSHIPS.map((item) => (
                      <Check
                        key={item.id}
                        on={relationships.includes(item.id)}
                        label={item.label}
                        trailing
                        onToggle={() => toggle(relationships, item.id, setRelationships)}
                      />
                    ))}
                  </FilterSection>

                  {EXTRA_GROUPS.map((group) => (
                    <FilterSection
                      key={group.id}
                      label={group.label}
                      icon={group.icon}
                      open={openSections.includes(group.id)}
                      onToggle={() => toggle(openSections, group.id, setOpenSections)}
                    >
                      {group.options.map((option) => (
                        <Check
                          key={option}
                          on={extras[group.id].includes(option)}
                          label={option}
                          trailing
                          onToggle={() =>
                            setExtras((current) => ({
                              ...current,
                              [group.id]: current[group.id].includes(option)
                                ? current[group.id].filter((item) => item !== option)
                                : [...current[group.id], option],
                            }))
                          }
                        />
                      ))}
                    </FilterSection>
                  ))}
                </div>
              ) : null}
            </div>

            <section className="feed" aria-label="Feed Stories">
            <div className="feed-list">
              {visible.length ? (
                visible.map((item) => (
                  <FeedCard
                    key={item.id}
                    item={item}
                    tracked={tracked.includes(item.id)}
                    onAsk={() => ping(`Ask AI about ${item.heading}`)}
                    onTrack={() => {
                      const next = tracked.includes(item.id);
                      setTracked(next ? tracked.filter((id) => id !== item.id) : [...tracked, item.id]);
                      ping(next ? "Stopped tracking" : "Started tracking");
                    }}
                  />
                ))
              ) : (
                <p className="feed-empty">No themes match these filters.</p>
              )}
            </div>

            <button type="button" className="feed-more" aria-expanded={showMore} onClick={() => setShowMore((value) => !value)}>
              {showMore ? "Show fewer themes" : "Show more themes"}
              <ChatIcon src={chatAssets.caretDown16} size={16} />
            </button>
            </section>
          </div>
        </div>
      </div>
      {toast ? <p className="home-toast">{toast}</p> : null}
    </div>
  );
}

function FeedCard({
  item,
  tracked,
  onAsk,
  onTrack,
}: {
  item: Story;
  tracked: boolean;
  onAsk: () => void;
  onTrack: () => void;
}) {
  return (
    <article className="feed-card">
      <PostMedia item={item} />
      <div className="feed-card-body">
        <div className="feed-card-meta">
          <p>
            <span className="feed-kind">{item.kind}</span>
            <span className="feed-updated">· {item.updated ? `Updated ${item.ago}` : item.ago}</span>
          </p>
          <ThumbMarks />
        </div>
        <h2 className="feed-heading">{item.heading}</h2>
        <p className="feed-summary">{item.summary}</p>
        <div className="feed-card-actions">
          <AskAiButton onClick={onAsk} />
          <StartTrackingButton tracked={tracked} onClick={onTrack} />
        </div>
      </div>
    </article>
  );
}

const SURFACED = [
  {
    title: "NYX Brow Glue: 'Crazy Lift' and Long-Lasting Hold",
    why: "Leadership readout. Largest new theme, with a specific product claim.",
  },
  {
    title: "Victoria Beckham Beauty lip products for the milky lip combo",
    why: "Team share. A trend someone can act on this week.",
  },
  {
    title: "Cicaplast balm across dryness, redness, and acne",
    why: "Community. A broad concern worth watching before it peaks.",
  },
];

function TopFivePrompts() {
  return (
    <section className="prompt-lab" aria-label="Top 5 prompt">
      <div className="prompt-lab-intro">
        <h2>Top 5 prompt</h2>
        <p>
          The brand shares one list of themes. We choose the five that look most useful for this person and say why. They can tell
          us if that call was right. They don’t pin anything. Everyone can still open the full list.
        </p>
      </div>
      <PromptVariant label="Why this one" note="We already placed it. They only react.">
        <WhyThisOne />
      </PromptVariant>
      <PromptVariant label="Who it's for" note="We name the audience. They confirm or correct it.">
        <WhoItsFor />
      </PromptVariant>
      <PromptVariant label="The five we chose" note="The ranking is ours, with a reason on each.">
        <ChosenFive />
      </PromptVariant>
    </section>
  );
}

function PromptVariant({ label, note, children }: { label: string; note: string; children: ReactNode }) {
  return (
    <div className="prompt-variant">
      <div className="prompt-variant-label">
        <p>{label}</p>
        <span>{note}</span>
      </div>
      <div className="prompt-feed">
        <StoryStub kicker="Themes · 4h ago" title={SURFACED[0].title} />
        {children}
        <StoryStub kicker="Themes · 4h ago" title={SURFACED[1].title} muted />
      </div>
    </div>
  );
}

function StoryStub({ kicker, title, muted = false }: { kicker: string; title: string; muted?: boolean }) {
  return (
    <article className={muted ? "prompt-story is-muted" : "prompt-story"}>
      <p>{kicker}</p>
      <h3>{title}</h3>
    </article>
  );
}

function WhyThisOne() {
  const [choice, setChoice] = useState<"useful" | "not" | "skip" | null>(null);
  return (
    <div className="prompt-card">
      <div className="prompt-copy">
        <p className="prompt-kicker">In your top 5</p>
        <h3>We put this here because it looks useful for a leadership readout.</h3>
        <p>144 posts and a clear product claim, new in the last 4 hours. The list below is the same one your team sees.</p>
      </div>
      {choice === "skip" ? (
        <p className="prompt-result">Left as is. Refine sits next to the filters if you want to tell us more.</p>
      ) : (
        <>
          <div className="prompt-actions">
            <button
              type="button"
              className={choice === "useful" ? "prompt-choice is-on" : "prompt-choice"}
              aria-pressed={choice === "useful"}
              onClick={() => setChoice("useful")}
            >
              Useful
            </button>
            <button
              type="button"
              className={choice === "not" ? "prompt-choice is-on" : "prompt-choice"}
              aria-pressed={choice === "not"}
              onClick={() => setChoice("not")}
            >
              Not for me
            </button>
            <button type="button" className="prompt-skip" onClick={() => setChoice("skip")}>
              Not now
            </button>
          </div>
          {choice === "useful" ? (
            <p className="prompt-result">We’ll keep leading with stories like this. This one stays in the shared list either way.</p>
          ) : null}
          {choice === "not" ? (
            <p className="prompt-result">We’ll lead with different stories next time. This one stays in the full list.</p>
          ) : null}
        </>
      )}
    </div>
  );
}

function WhoItsFor() {
  const [choice, setChoice] = useState<"right" | "wrong" | null>(null);
  return (
    <div className="prompt-card">
      <div className="prompt-copy">
        <p className="prompt-kicker">Useful for leadership</p>
        <h3>This is the story we’d take into a leadership readout.</h3>
        <p>
          It’s the largest new theme, and the claim is specific enough to repeat. Teammates in other roles may see a different
          five. Everyone can still open this one.
        </p>
      </div>
      <div className="prompt-actions">
        <button
          type="button"
          className={choice === "right" ? "prompt-choice is-on" : "prompt-choice"}
          aria-pressed={choice === "right"}
          onClick={() => setChoice("right")}
        >
          That’s right
        </button>
        <button
          type="button"
          className={choice === "wrong" ? "prompt-choice is-on" : "prompt-choice"}
          aria-pressed={choice === "wrong"}
          onClick={() => setChoice("wrong")}
        >
          Not the audience
        </button>
      </div>
      {choice === "right" ? (
        <p className="prompt-result">We’ll keep leading with stories that hold up in a leadership conversation.</p>
      ) : null}
      {choice === "wrong" ? (
        <p className="prompt-result">We’ll stop using leadership readouts as the reason to put stories first for you.</p>
      ) : null}
    </div>
  );
}

function ChosenFive() {
  const [choice, setChoice] = useState<"useful" | "later" | null>(null);
  return (
    <div className="prompt-card">
      <div className="prompt-copy">
        <p className="prompt-kicker">Your top 5</p>
        <h3>Here’s what we think is most useful for you right now.</h3>
        <p>We ordered these. The rest of the shared list follows, in the same order your team sees.</p>
      </div>
      <ol className="prompt-reasons">
        {SURFACED.map((item, index) => (
          <li key={item.title}>
            <span className="prompt-rank">{index + 1}</span>
            <span>
              <strong>{item.title}</strong>
              {item.why}
            </span>
          </li>
        ))}
      </ol>
      <div className="prompt-actions">
        <button
          type="button"
          className={choice === "useful" ? "prompt-choice is-on" : "prompt-choice"}
          aria-pressed={choice === "useful"}
          onClick={() => setChoice("useful")}
        >
          Useful
        </button>
        <button
          type="button"
          className={choice === "later" ? "prompt-choice is-on" : "prompt-choice"}
          aria-pressed={choice === "later"}
          onClick={() => setChoice("later")}
        >
          Not quite
        </button>
      </div>
      {choice === "useful" ? <p className="prompt-result">We’ll keep ordering your top 5 this way.</p> : null}
      {choice === "later" ? (
        <p className="prompt-result">We’ll try a different read next time. Refine, next to the filters, is where you can tell us more.</p>
      ) : null}
    </div>
  );
}

export function ThemeCardSpecimen() {
  const item = STORIES[0];
  const [tracked, setTracked] = useState(false);
  const [pick, setPick] = useState<Record<string, string>>({
    interest: "Existing",
    ask: "Existing",
    track: "Existing",
    thumbs: "Existing",
    header: "Existing",
    body: "Existing",
    theme: "Existing",
    updated: "Existing",
  });

  const units = [
    {
      id: "interest",
      name: "Not interested indicator",
      options: [{ label: "Existing", node: <ThumbMarks /> }],
    },
    {
      id: "ask",
      name: "Ask AI button",
      options: [{ label: "Existing", node: <AskAiButton /> }],
    },
    {
      id: "track",
      name: "Start tracking button",
      options: [
        {
          label: "Existing",
          node: <StartTrackingButton tracked={tracked} onClick={() => setTracked((value) => !value)} />,
        },
      ],
    },
    {
      id: "thumbs",
      name: "Post thumbnails",
      options: [
        { label: "Existing", node: <PostMedia item={item} /> },
        { label: "Variant 2", node: <PostThumbVariant /> },
        { label: "Variant 3", node: <ClipRow layout="meta" /> },
        { label: "Variant 4", node: <ClipRow layout="overlay-light" /> },
        { label: "Variant 5", node: <ClipRow layout="meta-caption" /> },
        { label: "Variant 6", node: <ClipRow layout="overlay-dark" /> },
      ],
    },
    {
      id: "header",
      name: "Header text",
      options: [{ label: "Existing", node: <h2 className="feed-heading">{item.heading}</h2> }],
    },
    {
      id: "body",
      name: "Body text",
      options: [{ label: "Existing", node: <p className="feed-summary">{item.summary}</p> }],
    },
    {
      id: "theme",
      name: "Theme chip",
      options: [{ label: "Existing", node: <span className="feed-kind">{item.kind}</span> }],
    },
    {
      id: "updated",
      name: "Last updated chip",
      options: [
        {
          label: "Existing",
          node: <span className="feed-updated">{item.updated ? `Updated ${item.ago}` : item.ago}</span>,
        },
      ],
    },
  ];

  const chosen = (id: string) => units.find((unit) => unit.id === id)?.options.find((option) => option.label === pick[id])?.node;

  return (
    <div className="home-lab">
      <div className="home-main">
        <div className="atom-list">
          <TopFivePrompts />
          <section className="atom-viewer" aria-label="Viewer">
            <p>Viewer</p>
            <div className="feed">
              <div className="feed-list">
                <article className="feed-card">
                  {pick.thumbs === "Variant 2" ? (
                    <PostThumbCard {...POST_THUMBS[0]} summary={POST_THUMB_SUMMARY} />
                  ) : pick.thumbs === "Variant 3" ? (
                    <ClipCard layout="meta" />
                  ) : pick.thumbs === "Variant 4" ? (
                    <ClipCard layout="overlay-light" />
                  ) : pick.thumbs === "Variant 5" ? (
                    <ClipCard layout="meta-caption" />
                  ) : pick.thumbs === "Variant 6" ? (
                    <ClipCard layout="overlay-dark" />
                  ) : (
                    chosen("thumbs")
                  )}
                  <div className="feed-card-body">
                    <div className="feed-card-meta">
                      <p>
                        <span className="atom-meta-copy">
                          {chosen("theme")}
                          <span aria-hidden="true">·</span>
                          {chosen("updated")}
                        </span>
                      </p>
                      {chosen("interest")}
                    </div>
                    {chosen("header")}
                    {chosen("body")}
                    <div className="feed-card-actions">
                      {chosen("ask")}
                      {chosen("track")}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
          <ExpandableTheme />
          {units.map((unit) => (
            <div key={unit.id} className="atom-row">
              <div className="atom-head">
                <p>{unit.name}</p>
                <select
                  className="atom-pick"
                  aria-label={`${unit.name} variant`}
                  value={pick[unit.id]}
                  onChange={(event) => setPick((current) => ({ ...current, [unit.id]: event.target.value }))}
                >
                  {unit.options.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="atom-stage">
                {unit.options.map((option) => (
                  <div key={option.label} className="atom-option">
                    <p>{option.label}</p>
                    {option.node}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const EXPAND_COPY =
  'The overwhelming trend is the viral "Anthropologie Rock" meme that has exploded across social platforms. Over 100 posts in our sample are participating in this meme where people buy expensive decorative rocks from Anthropologie (typically $150–$600) to prank friends, family, or partners.';

const EXPAND_CAPTION =
  "A beauty creator names Victoria Beckham by Augustinus Bader The Foundation Drops as one of her top";

function ExpandableTheme() {
  const [open, setOpen] = useState(false);
  const [tracked, setTracked] = useState(false);

  return (
    <section className="atom-viewer" aria-label="Expandable theme">
      <p>Expandable theme</p>
      <article className={open ? "expand-card is-open" : "expand-card"}>
        <div className="expand-head">
          <p>
            <span className="expand-kind">Theme</span>
            <span className="expand-updated">· Updated 4h ago</span>
          </p>
          <div className="feed-card-actions">
            <AskAiButton />
            <StartTrackingButton tracked={tracked} onClick={() => setTracked((value) => !value)} />
            <button type="button" className="feed-action">
              <FeedbackIcon />
              Provide feedback
            </button>
          </div>
        </div>
        <div className="expand-body">
          {open ? null : (
            <div className="expand-stack" aria-hidden="true">
              <img className="is-left" src={CLIP_IMAGE} alt="" />
              <img className="is-right" src={CLIP_IMAGE} alt="" />
              <img className="is-front" src={CLIP_IMAGE} alt="" />
            </div>
          )}
          <div>
            <h2 className="expand-title">The "Anthropologie Rock" Viral Phenomenon</h2>
            <p className="expand-summary">{EXPAND_COPY}</p>
            <button type="button" className="expand-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              {open ? "Hide posts" : "View all posts"}
            </button>
          </div>
        </div>
        {open ? (
          <div className="expand-posts">
            {Array.from({ length: 5 }, (_, index) => (
              <ClipCard key={index} layout="overlay-light" caption={EXPAND_CAPTION} />
            ))}
          </div>
        ) : null}
      </article>
    </section>
  );
}

function FeedbackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.2 2.4v11.2" stroke="#230603" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3.2 3.1h8.2L9.6 5.4l1.8 2.3H3.2" stroke="#230603" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function AskAiButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className="feed-action" onClick={onClick}>
      <AskAiIcon />
      Ask AI
    </button>
  );
}

function StartTrackingButton({ tracked, onClick }: { tracked: boolean; onClick: () => void }) {
  return (
    <button type="button" className={tracked ? "feed-action is-on" : "feed-action"} aria-pressed={tracked} onClick={onClick}>
      <TrackIcon />
      {tracked ? "Tracking" : "Start tracking"}
    </button>
  );
}

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const POST_THUMBS = [
  {
    image: publicAsset("/assets/homepage/post-01.png"),
    name: "ellenwalker",
    views: "834K",
    likes: "20.3K",
    avatar: publicAsset("/assets/outbound/avatar-shaahana.png"),
  },
  {
    image: publicAsset("/assets/homepage/post-02.png"),
    name: "mia.beauty",
    views: "512K",
    likes: "18.1K",
    avatar: publicAsset("/assets/outbound/avatar-rey.jpg"),
  },
  {
    image: publicAsset("/assets/homepage/post-03.png"),
    name: "studio.mua",
    views: "291K",
    likes: "9.4K",
    avatar: publicAsset("/assets/outbound/avatar-rey.jpg"),
  },
];

const POST_THUMB_SUMMARY = "Summary of post content and why it's relevant for me as a viewer";

const CLIP_IMAGE = publicAsset("/assets/homepage/clip-post.png");
const CLIP_AVATAR = publicAsset("/assets/outbound/avatar-shaahana.png");
const CLIP_CAPTION =
  "A beauty creator names Victoria Beckham by Augustinus Bader The Foundation Drops as one of her top three foundations, praising its silky skin finish despite the high price.";

type ClipLayout = "meta" | "overlay-light" | "meta-caption" | "overlay-dark";

function ClipRow({ layout }: { layout: ClipLayout }) {
  return (
    <div className="clip-row">
      {Array.from({ length: 3 }, (_, index) => (
        <ClipCard key={index} layout={layout} />
      ))}
    </div>
  );
}

function ClipCard({ layout, caption }: { layout: ClipLayout; caption?: string }) {
  const overlay = layout === "overlay-light" || layout === "overlay-dark";
  const captionText = caption ?? CLIP_CAPTION;
  const showCaption = layout !== "meta";
  return (
    <article className={overlay ? "clip-card is-overlay" : "clip-card"}>
      <div className="clip-media">
        <img src={CLIP_IMAGE} alt="" />
        {overlay ? (
          <div className={layout === "overlay-dark" ? "clip-scrim is-dark" : "clip-scrim is-light"}>
            <ClipMeta tone={layout === "overlay-dark" ? "light" : "dark"} />
          </div>
        ) : null}
      </div>
      {overlay ? null : (
        <div className="clip-below">
          <ClipMeta tone="dark" />
        </div>
      )}
      {showCaption ? <p className="clip-caption">{captionText}</p> : null}
    </article>
  );
}

export function ClipMeta({ tone, platforms = true }: { tone: "dark" | "light"; platforms?: boolean }) {
  return (
    <div className={tone === "light" ? "clip-meta is-light" : "clip-meta"}>
      <div className="clip-meta-row">
        <span>
          Sep 15 2026
          <span className="clip-dot" aria-hidden="true">
            ·
          </span>
          <ClipEye />
          180.75K
        </span>
        {platforms ? (
          <span className="clip-meta-icons">
            <ClipIg />
            <ClipPlay />
          </span>
        ) : null}
      </div>
      <span className="clip-user">
        <img src={CLIP_AVATAR} alt="" />
        uhodom_edinym
      </span>
    </div>
  );
}

function ClipEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.8 8S4 4.6 8 4.6 14.2 8 14.2 8 12 11.4 8 11.4 1.8 8 1.8 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ClipIg() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.4" y="2.4" width="11.2" height="11.2" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.3" cy="4.7" r="0.7" fill="currentColor" />
    </svg>
  );
}

export function ClipPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.4" y="3.2" width="11.2" height="9.6" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 6.2v3.6l3-1.8-3-1.8Z" fill="currentColor" />
    </svg>
  );
}

function PostThumbVariant() {
  return (
    <div className="post-thumb-demo">
      <div className="post-thumb-row">
        {POST_THUMBS.map((thumb) => (
          <PostThumbCard key={thumb.name} {...thumb} summary={POST_THUMB_SUMMARY} />
        ))}
      </div>
    </div>
  );
}

function PostThumbCard({
  image,
  name,
  views,
  likes,
  avatar,
  summary,
}: {
  image: string;
  name: string;
  views: string;
  likes: string;
  avatar: string;
  summary: string;
}) {
  return (
    <article className="post-thumb">
      <div className="post-thumb-media">
        <img src={image} alt="" />
        <span className="post-thumb-platforms">
          <PlatformBadge>
            <rect x="3.2" y="3.2" width="9.6" height="9.6" rx="2.4" />
            <circle cx="8" cy="8" r="2" />
            <circle cx="11" cy="5" r="0.7" fill="#230603" stroke="none" />
          </PlatformBadge>
          <PlatformBadge>
            <path d="M8 3v10" />
            <path d="M10.3 5.1c0-.9-.9-1.5-2.3-1.5S5.7 4.2 5.7 5.2 6.7 6.4 8 6.8s2.3.6 2.3 1.7-1 1.7-2.3 1.7-2.3-.6-2.3-1.5" />
          </PlatformBadge>
          <PlatformBadge>
            <rect x="3.4" y="3.4" width="9.2" height="9.2" rx="2" />
            <path d="M7 6.1v3.8l3.1-1.9L7 6.1Z" fill="#230603" stroke="none" />
          </PlatformBadge>
        </span>
      </div>
      <div className="post-thumb-body">
        <div className="post-thumb-meta">
          <span className="post-thumb-user">
            <img src={avatar} alt="" />
            {name}
          </span>
          <span className="post-thumb-stats">
            <span>
              <StatPlay />
              {views}
            </span>
            <span>
              <StatHeart />
              {likes}
            </span>
          </span>
        </div>
        <p>{summary}</p>
      </div>
    </article>
  );
}

function PlatformBadge({ children }: { children: ReactNode }) {
  return (
    <span>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <g stroke="#230603" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
      </svg>
    </span>
  );
}

function StatPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="#b0b0b0" d="M5.2 3.4v9.2l7-4.6-7-4.6Z" />
    </svg>
  );
}

function StatHeart() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="#b0b0b0"
        d="M8 13.2s-4.6-2.8-4.6-6A2.6 2.6 0 0 1 8 5.4a2.6 2.6 0 0 1 4.6 1.8c0 3.2-4.6 6-4.6 6Z"
      />
    </svg>
  );
}

const SAMPLE_POSTS = [
  publicAsset("/assets/homepage/post-01.png"),
  publicAsset("/assets/homepage/post-02.png"),
  publicAsset("/assets/homepage/post-03.png"),
];

function PostMedia({ item }: { item: Story }) {
  const index = Number(item.id);
  const front = SAMPLE_POSTS[index % SAMPLE_POSTS.length];
  if (item.kind === "Unique Posts") {
    return (
      <div className="feed-media">
        <img src={front} alt="" />
      </div>
    );
  }
  const left = SAMPLE_POSTS[(index + 1) % SAMPLE_POSTS.length];
  const right = SAMPLE_POSTS[(index + 2) % SAMPLE_POSTS.length];
  return (
    <div className="feed-stack" aria-hidden="true">
      <img className="is-left" src={left} alt="" />
      <img className="is-right" src={right} alt="" />
      <img className="is-front" src={front} alt="" />
    </div>
  );
}

function ThumbMarks() {
  return (
    <span className="feed-marks" aria-hidden="true">
      <span className="is-up">
        <ThumbIcon />
      </span>
      <span className="is-down">
        <ThumbIcon />
      </span>
    </span>
  );
}

function AskAiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path fill="#230603" d="M5.1 3.8 5.98 7.22 9.4 8.1 5.98 8.98 5.1 12.4 4.22 8.98 0.8 8.1 4.22 7.22Z" />
      <path fill="#230603" d="M11.55 1.65 11.99 3.26 13.6 3.7 11.99 4.14 11.55 5.75 11.11 4.14 9.5 3.7 11.11 3.26Z" />
      <path fill="#230603" d="M11.9 10.35 12.24 11.56 13.45 11.9 12.24 12.24 11.9 13.45 11.56 12.24 10.35 11.9 11.56 11.56Z" />
    </svg>
  );
}

function TrackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8.7 14.2H4.7A3 3 0 0 1 1.7 11.2V4.8A3 3 0 0 1 4.7 1.8h6.2a3 3 0 0 1 3 3v3.6"
        stroke="#230603"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4.5 8.8 6.5 6.7 8 8 10.3 5.6"
        stroke="#230603"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12.15" cy="12.35" r="2.85" fill="#fff" />
      <path
        fill="#230603"
        fillRule="evenodd"
        d="M11.06 10.85Q12.15 9.8 13.24 10.85Q14.58 11.56 13.91 12.92Q13.65 14.41 12.15 14.2Q10.65 14.41 10.39 12.92Q9.72 11.56 11.06 10.85ZM12.15 11.2 12.43 11.96 13.24 11.99 12.61 12.5 12.83 13.28 12.15 12.83 11.47 13.28 11.69 12.5 11.06 11.99 11.87 11.96Z"
      />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
    </svg>
  );
}

function compareStories(a: Story, b: Story, sort: SortId) {
  if (sort === "recency") return a.daysAgo - b.daysAgo;
  if (sort === "reviewed") return b.reviewed - a.reviewed;
  return b[sort] - a[sort];
}

function withinTime(item: Story, time: TimeOption, range: { from: string; to: string }) {
  if (time === "All time") return true;
  if (time === "Custom range") {
    if (!range.from || !range.to) return true;
    const day = new Date(2026, 8, 23);
    day.setDate(day.getDate() - Math.floor(item.daysAgo));
    const stamp = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    return stamp >= range.from && stamp <= range.to;
  }
  return item.daysAgo <= TIME_LIMIT[time];
}

function matchesPlatform(
  item: Story,
  filters: { instagram: boolean; postTypes: PostType[]; tiktok: boolean; shorts: boolean },
) {
  const onInstagram = filters.instagram && item.postTypes.some((type) => filters.postTypes.includes(type));
  const onTiktok = filters.tiktok && item.tiktok;
  const onShorts = filters.shorts && item.shorts;
  return onInstagram || onTiktok || onShorts;
}

function FilterSection({
  label,
  icon,
  open,
  faces = false,
  onToggle,
  children,
}: {
  label: string;
  icon: string;
  open: boolean;
  faces?: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`feed-section${open ? " is-open" : ""}`}>
      <button type="button" className="feed-section-head" aria-expanded={open} onClick={onToggle}>
        <ChatIcon src={icon} size={16} />
        <span className="feed-label">{label}</span>
        {faces ? (
          <span className="feed-faces" aria-hidden="true">
            <img src={assets.avatars[0]} alt="" width={18} height={18} />
            <img src={assets.avatars[1]} alt="" width={18} height={18} />
          </span>
        ) : null}
        <ChatIcon src={chatAssets.caretDown16} size={14} />
      </button>
      {open ? <div className="feed-section-body">{children}</div> : null}
    </div>
  );
}

function Check({
  on,
  label,
  icon,
  iconClass,
  trailing = false,
  onToggle,
}: {
  on: boolean;
  label: string;
  icon?: string;
  iconClass?: string;
  trailing?: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" role="checkbox" aria-checked={on} className={`feed-check-row${on ? " is-on" : ""}`} onClick={onToggle}>
      {trailing ? null : <span className="feed-box" />}
      {icon ? (
        <span className={iconClass}>
          <ChatIcon src={icon} size={16} />
        </span>
      ) : null}
      <span className="feed-label">{label}</span>
      {trailing ? <span className="feed-box" /> : null}
    </button>
  );
}
