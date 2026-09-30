import type { CSSProperties } from "react";
import { CAPTION, FocusStrip } from "./FocusCarousel";
import { BleedBand, CamoBand, PixelCloud, StripePanel } from "./theme-textures";

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export type PanelTexture = "pink" | "mauve" | "periwinkle" | "sage";

const PANEL_COLORS: Record<PanelTexture, string> = {
  pink: "#e4b3c3",
  mauve: "#baa1cd",
  periwinkle: "#a0b5d5",
  sage: "#99bfba",
};

const PANEL_GRAIN: Record<PanelTexture, string> = {
  pink: asset("newsfeed/bg-grain-orange.jpg"),
  mauve: asset("newsfeed/bg-grain-purple.jpg"),
  periwinkle: asset("newsfeed/bg-grain-blue.jpg"),
  sage: asset("newsfeed/bg-grain-teal.jpg"),
};

const themeWellStyle = (theme: GridTheme): CSSProperties =>
  ({
    "--tg-glow-1": PANEL_COLORS[theme.panel],
    "--tg-grain": `url(${PANEL_GRAIN[theme.panel]})`,
  }) as CSSProperties;

export type GridTheme = {
  id: string;
  ago: string;
  title: string;
  summary: string;
  band: { ink: string; soft: string };
  bleed: { mid: string; bottom: string };
  stats: { posts: number; creators?: number; views: number; engagement: number };
  glow: [string, string, string];
  pixel: string;
  backdrop?: string;
  panel: PanelTexture;
  posts: { src: string; handle: string }[];
};

export const GRID_THEMES: GridTheme[] = [
  {
    id: "nyx",
    panel: "pink",
    ago: "4h ago",
    title: "NYX Brow Glue: ‘Crazy Lift’ and Long-Lasting Hold",
    summary:
      "Creators are showcasing the NYX The Brow Glue product, emphasizing its strong hold and ability to defy droopiness for lifted, laminated, and fluffy brows.",
    band: { ink: "#7a1034", soft: "#dca6dc" },
    bleed: { mid: "#fdf1c9", bottom: "#f3b8d6" },
    stats: { posts: 144, creators: 38, views: 2390000, engagement: 237500 },
    glow: ["#ecc4b6", "#bcd6f2", "#f4df9e"],
    pixel: "#d63f8f",
    backdrop: asset("newsfeed/bg-stipple-pink.png"),
    posts: [
      { src: asset("newsfeed/pick-image.png"), handle: "@uhodom_edinym" },
      { src: asset("newsfeed/clip-2.png"), handle: "@uhodom_edinym" },
      { src: asset("newsfeed/clip-3.png"), handle: "@uhodom_edinym" },
    ],
  },
  {
    id: "vb",
    panel: "mauve",
    ago: "6h ago",
    title: "Bridal Lip Combos Built Around Portofino ’97",
    summary:
      "Brides and makeup artists are pairing Victoria Beckham’s Portofino ’97 liner with glossy nudes, calling it the one combo that survives a full wedding day.",
    band: { ink: "#1f6f6a", soft: "#bfe3dc" },
    bleed: { mid: "#e2ecdc", bottom: "#a9ccf0" },
    stats: { posts: 96, creators: 27, views: 1480000, engagement: 162300 },
    glow: ["#ecc6bb", "#b9d4cf", "#e3d3c4"],
    pixel: "#5a7fd8",
    posts: [
      { src: asset("homepage/post-01.png"), handle: "@glowbymaya" },
      { src: asset("homepage/post-02.png"), handle: "@vbbeauty" },
      { src: asset("homepage/post-03.png"), handle: "@katiadoesmakeup" },
    ],
  },
  {
    id: "anne",
    panel: "periwinkle",
    ago: "9h ago",
    title: "Anne Hathaway’s Red Carpet Looks Drive Brown Shadow Tutorials",
    summary:
      "Beauty editors are breaking down Anne Hathaway’s monochrome brown eyes and soft updos, and creators are recreating them step by step with drugstore swaps.",
    band: { ink: "#4a2a1a", soft: "#e2c3a4" },
    bleed: { mid: "#f4ead9", bottom: "#dcbc9c" },
    stats: { posts: 71, creators: 19, views: 910000, engagement: 88400 },
    glow: ["#f2c4b0", "#d8c3b2", "#ead9cc"],
    pixel: "#8a5a3c",
    backdrop: asset("newsfeed/bg-plaster-blue.png"),
    posts: [
      { src: asset("post2/slide-1.png"), handle: "@allure" },
      { src: asset("post2/slide-2.png"), handle: "@allure" },
      { src: asset("post2/slide-3.png"), handle: "@allure" },
    ],
  },
  {
    id: "lulu",
    panel: "sage",
    ago: "12h ago",
    title: "Lululemon’s Summer Series Turns Pilates Into a Mood",
    summary:
      "Lululemon’s rooftop Pilates videos are being stitched by instructors who love the pacing, while a few call out the “no distractions” line as a little much.",
    band: { ink: "#c24a24", soft: "#f6d2bb" },
    bleed: { mid: "#fcebdc", bottom: "#f3b597" },
    stats: { posts: 54, creators: 12, views: 640000, engagement: 51200 },
    glow: ["#e6b9a4", "#c5d3b2", "#d6dfdc"],
    pixel: "#d9683a",
    backdrop: asset("newsfeed/bg-collage-orange.jpg"),
    posts: [
      { src: asset("post1/video.png"), handle: "@lululemon" },
      { src: asset("post1/thumb.jpg"), handle: "@lululemon" },
      { src: asset("post2/video.png"), handle: "@lewishamilton" },
    ],
  },
];

const POSTS_PER_THEME = 5;

export type CardLayout = "carousel" | "stack" | "split";

export type CardSources = "creators" | "posts";
export type SourcesChrome = "chip" | "plain";

function Sources({
  theme,
  kind,
  chrome = "chip",
  onOpen,
  cta,
}: {
  theme: GridTheme;
  kind: CardSources;
  chrome?: SourcesChrome;
  onOpen?: () => void;
  cta?: string;
}) {
  if (kind === "posts") {
    const stack = (
      <span className="tg-sources-stack" aria-hidden="true">
        <img src={theme.posts[1 % theme.posts.length].src} alt="" />
        <img src={theme.posts[0].src} alt="" />
      </span>
    );
    return onOpen ? (
      <button
        type="button"
        className={`tg-sources is-posts is-button${chrome === "plain" ? " is-plain" : ""}${cta ? " is-link" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
      >
        {cta ? null : stack}
        <span className="tg-sources-count">{cta ?? `View ${theme.stats.posts} posts`}</span>
        <span
          className="tg-sources-arrow"
          style={{ "--tg-arrow": `url(${asset("newsfeed/icon-arrow-right.svg")})` } as CSSProperties}
          aria-hidden="true"
        />
      </button>
    ) : (
      <div className="tg-sources is-posts">
        {stack}
        <span className="tg-sources-count">+{theme.stats.posts} posts</span>
      </div>
    );
  }
  return (
    <div className="tg-sources is-creators">
      <span className="tg-sources-stack" aria-hidden="true">
        {theme.posts.map((post, index) => (
          <img key={index} src={post.src} alt="" />
        ))}
      </span>
      <span className="tg-sources-count">{theme.stats.creators ?? Math.ceil(theme.stats.posts / 4)} creators</span>
    </div>
  );
}

export function Votes({ vote, onVote }: { vote: "up" | "down" | null; onVote: (next: "up" | "down") => void }) {
  return (
    <div className="nf-votes">
      <button
        type="button"
        className={vote === "up" ? "nf-vote is-up is-on" : "nf-vote is-up"}
        aria-pressed={vote === "up"}
        aria-label="Useful"
        onClick={() => onVote("up")}
      >
        <img src={asset("newsfeed/icon-like.svg")} alt="" width={16} height={16} />
      </button>
      <button
        type="button"
        className={vote === "down" ? "nf-vote is-down is-on" : "nf-vote is-down"}
        aria-pressed={vote === "down"}
        aria-label="Not for me"
        onClick={() => onVote("down")}
      >
        <img src={asset("newsfeed/icon-dislike.svg")} alt="" width={16} height={16} />
      </button>
    </div>
  );
}

const FEATURE_POSTS = 8;

export function ThemeFeature({
  theme,
  vote = null,
  onVote,
  onOpen,
  onOpenPost,
  stage = "stack",
  cta,
}: {
  theme: GridTheme;
  vote?: "up" | "down" | null;
  onVote?: (next: "up" | "down") => void;
  onOpen?: () => void;
  onOpenPost?: (index: number) => void;
  stage?: "stack" | "single";
  cta?: string;
}) {
  const count = stage === "single" ? 1 : FEATURE_POSTS;
  const posts = Array.from({ length: count }, (_, index) => theme.posts[index % theme.posts.length]);
  return (
    <article
      className={`tg-card tg-feature${stage === "single" ? " is-single" : ""}${onOpen ? " is-clickable" : ""}`}
      style={themeWellStyle(theme)}
      onClick={onOpen}
    >
      <div className="tg-feature-copy">
        <div className="tg-feature-text">
          <h3>
            {onOpen ? (
              <button
                type="button"
                className="tg-open"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen();
                }}
              >
                {theme.title}
              </button>
            ) : (
              theme.title
            )}
          </h3>
          <p className="tg-summary">{theme.summary}</p>
          <div className="tg-feature-stats">
            <span>
              <strong>
                {compact(theme.stats.posts)}
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
        <div className="tg-feature-foot" onClick={(event) => event.stopPropagation()}>
          <Sources theme={theme} kind="posts" onOpen={onOpen} cta={cta} />
          {onVote ? <Votes vote={vote} onVote={onVote} /> : null}
        </div>
      </div>
      <div className="tg-feature-stage" onClick={(event) => event.stopPropagation()}>
        <FocusStrip
          posts={posts}
          label={`Posts for ${theme.title}`}
          onOpen={onOpenPost}
          interactive={false}
          limit={stage === "single" ? 1 : 3}
        />
      </div>
    </article>
  );
}

export type GridVariant = "plain" | "band" | "bleed" | "panel" | "corner" | "glow" | "gray" | "pixel" | "photo";

export function ThemeGrid({
  variant = "plain",
  layout,
  textured,
  sources,
  sourcesChrome,
}: {
  variant?: GridVariant;
  layout?: CardLayout;
  textured?: boolean;
  sources?: CardSources;
  sourcesChrome?: SourcesChrome;
}) {
  return (
    <div className="tg-grid">
      {GRID_THEMES.map((theme, index) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          variant={variant}
          seed={index + 3}
          layout={layout}
          textured={textured}
          sources={sources}
          sourcesChrome={sourcesChrome}
          onOpen={sourcesChrome ? () => undefined : undefined}
        />
      ))}
    </div>
  );
}

export function ThemeCard({
  theme,
  variant,
  seed,
  tracked = false,
  vote = null,
  onAsk,
  onTrack,
  onVote,
  onOpenPost,
  onOpen,
  layout = "carousel",
  textured = false,
  sources,
  sourcesChrome,
  cta,
  kicker,
  texture,
}: {
  theme: GridTheme;
  variant: GridVariant;
  seed: number;
  tracked?: boolean;
  vote?: "up" | "down" | null;
  onAsk?: () => void;
  onTrack?: () => void;
  onVote?: (next: "up" | "down") => void;
  onOpenPost?: (index: number) => void;
  onOpen?: () => void;
  layout?: CardLayout;
  textured?: boolean;
  sources?: CardSources;
  sourcesChrome?: SourcesChrome;
  cta?: string;
  kicker?: string;
  texture?: string;
}) {
  const posts = Array.from({ length: POSTS_PER_THEME }, (_, index) => theme.posts[index % theme.posts.length]);

  if (layout !== "carousel") {
    const lead = theme.posts[0];
    const votes = onVote ? <Votes vote={vote} onVote={onVote} /> : null;
    const actions = (
      <div className="tg-single-actions" onClick={(event) => event.stopPropagation()}>
        {layout === "stack" ? votes : null}
        <button type="button" className="cc-btn" onClick={onAsk}>
          <img src={asset("newsfeed/icon-sparkles.svg")} alt="" />
          Ask AI
        </button>
        <button type="button" className="cc-btn" aria-pressed={tracked} onClick={onTrack}>
          <img src={asset("newsfeed/icon-track.svg")} alt="" />
          {tracked ? "Report created" : "Generate custom report"}
        </button>
      </div>
    );
    const title = (
      <h3>
        {onOpen ? (
          <button
            type="button"
            className="tg-open"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
          >
            {theme.title}
          </button>
        ) : (
          theme.title
        )}
      </h3>
    );

    return (
      <article
        className={`tg-card is-single is-${layout}${onOpen ? " is-clickable" : ""}${
          layout === "split" ? (seed % 2 === 0 ? " is-tilt-pos" : " is-tilt-neg") : ""
        }`}
        style={{ ...themeWellStyle(theme), ...(texture ? { "--tg-grain": texture } : {}) } as CSSProperties}
        onClick={onOpen}
      >
        <div
          className={textured ? `tg-single tg-panel is-${theme.panel}` : "tg-single"}
          style={
            textured
              ? ({
                  "--tg-panel-glow": `url(${asset("newsfeed/bg-soft-glow.png")})`,
                  "--tg-panel-sky": `url(${asset("newsfeed/bg-pixel-sky.png")})`,
                  "--tg-panel-streaks": `url(${asset("newsfeed/bg-pink-streaks.png")})`,
                  "--tg-panel-halftone": `url(${asset("newsfeed/bg-pink-halftone.png")})`,
                } as CSSProperties)
              : undefined
          }
        >
          <span className="fc-post-inner">
            <img src={lead.src} alt="" />
            <span className="fc-handle">{lead.handle}</span>
            <span className="fc-caption">{CAPTION}</span>
          </span>
        </div>
        <div className="tg-single-body">
          {layout === "stack" ? (
            <div className="tg-head">
              <p className="tg-kicker">Updated {theme.ago}</p>
              {actions}
            </div>
          ) : null}
          {kicker && layout !== "stack" ? <p className="tg-kicker">{kicker}</p> : null}
          {title}
          <p className="tg-summary">{theme.summary}</p>
          {sources || (layout === "split" && votes) ? (
            <div className="tg-card-foot" onClick={(event) => event.stopPropagation()}>
              {sources ? (
                <Sources theme={theme} kind={sources} chrome={sourcesChrome} onOpen={onOpen} cta={cta} />
              ) : null}
              {layout === "split" ? votes : null}
            </div>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`tg-card is-${variant}${onOpen ? " is-clickable" : ""}`}
      onClick={onOpen}
      style={
        {
          "--tg-tint": theme.bleed.bottom,
          "--tg-tint-2": theme.bleed.mid,
          "--tg-glow-1": theme.glow[0],
          "--tg-glow-2": theme.glow[1],
          "--tg-glow-3": theme.glow[2],
        } as CSSProperties
      }
    >
      <div className="tg-head">
        {variant !== "plain" ? (
          <p className="tg-kicker">Updated {theme.ago}</p>
        ) : (
          <div className="cc-top">
            <span className="cc-chip">Unique Posts</span>
            <span className="cc-dot" aria-hidden="true">
              ·
            </span>
            <span className="cc-ago">{theme.ago}</span>
          </div>
        )}
        {onVote ? (
          <div className="nf-votes" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={vote === "up" ? "nf-vote is-up is-on" : "nf-vote is-up"}
              aria-pressed={vote === "up"}
              aria-label="Useful"
              onClick={() => onVote("up")}
            >
              <img src={asset("newsfeed/icon-like.svg")} alt="" width={16} height={16} />
            </button>
            <button
              type="button"
              className={vote === "down" ? "nf-vote is-down is-on" : "nf-vote is-down"}
              aria-pressed={vote === "down"}
              aria-label="Not for me"
              onClick={() => onVote("down")}
            >
              <img src={asset("newsfeed/icon-dislike.svg")} alt="" width={16} height={16} />
            </button>
          </div>
        ) : null}
      </div>
      <h3>
        {onOpen ? (
          <button
            type="button"
            className="tg-open"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
          >
            {theme.title}
          </button>
        ) : (
          theme.title
        )}
      </h3>
      <p className="tg-summary">{theme.summary}</p>
      <div className="fc-stats tg-stats">
        <span>
          Posts<strong>{compact(theme.stats.posts)}</strong>
        </span>
        <span>
          View count<strong>{compact(theme.stats.views)}</strong>
        </span>
        <span>
          Total engagement<strong>{compact(theme.stats.engagement)}</strong>
        </span>
      </div>
      <div className="tg-stage">
        {variant === "band" ? (
          <div className="tg-band">
            <CamoBand ink={theme.band.ink} soft={theme.band.soft} seed={seed} />
          </div>
        ) : null}
        {variant === "panel" ? (
          <div className="tg-band">
            <StripePanel ink={theme.band.ink} soft={theme.band.soft} seed={seed} />
          </div>
        ) : null}
        {variant === "pixel" ? (
          <div className="tg-band">
            <PixelCloud ink={theme.pixel} seed={seed} />
          </div>
        ) : null}
        {variant === "photo" ? (
          <div className="tg-band">
            <img
              className="theme-texture is-cover"
              src={theme.backdrop ?? asset("newsfeed/bg-stipple-pink.png")}
              alt=""
            />
          </div>
        ) : null}
        {variant === "bleed" ? (
          <div className="tg-band">
            <BleedBand mid={theme.bleed.mid} bottom={theme.bleed.bottom} seed={seed} />
          </div>
        ) : null}
        <div className="tg-carousel">
          <FocusStrip posts={posts} label={`Posts for ${theme.title}`} onOpen={onOpenPost} />
        </div>
        <div className="tg-actions" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="cc-btn" onClick={onAsk}>
            <img src={asset("newsfeed/icon-sparkles.svg")} alt="" />
            Ask AI
          </button>
          <button type="button" className="cc-btn" aria-pressed={tracked} onClick={onTrack}>
            <img src={asset("newsfeed/icon-track.svg")} alt="" />
            {tracked ? "Report created" : "Generate custom report"}
          </button>
        </div>
      </div>
    </article>
  );
}

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(value);
}
