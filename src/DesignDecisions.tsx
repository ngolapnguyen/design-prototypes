import { useState, type ReactNode } from "react";
import { ChatIcon, Chip, StatusLine } from "./chat-ui";
import { chatAssets } from "./chat-assets";
import { designDecisions } from "./design-decisions";
import { CaptureCard } from "./CaptureCard";
import { FocusCarousel } from "./FocusCarousel";
import { ThemeBrowser } from "./ThemeBrowser";
import { GRID_THEMES, ThemeFeature, ThemeGrid } from "./ThemeGrid";
import { catalog, PostCard, PostLayouts, type MetricStyle } from "./PageStyle";

const METRIC_SAMPLE = catalog()[0];
const METRIC_VARIANTS: { id: MetricStyle; name: string; note: string }[] = [
  {
    id: "spaced",
    name: "Spaced icons",
    note: "What the theme page uses. Outline icons in black, grouped by spacing alone.",
  },
  { id: "pill", name: "Pills", note: "Same chips as the engagement page. Felt heavy under every post." },
  { id: "circle", name: "Icon circles", note: "Each icon in its own grey circle, number beside it." },
  { id: "plain", name: "Plain icons", note: "Lightest option. Icon and number, no container." },
];
import "./newsfeed.css";
import { FRAME_TEXTURES, FRAME_THEMES, TEXTURES, TexturedFrame, TexturedThemePreview } from "./theme-textures";
import "./chat.css";

const BLOCKS = [
  { title: "Notify about", values: ["Brand mentions"] },
  { title: "Triggers", values: ["Neutral sentiment", "Negative sentiment"] },
  { title: "Frequency", values: ["As it happens"] },
  { title: "Deliver to", values: ["Slack"] },
];

function CardShell({ children }: { children: ReactNode }) {
  return (
    <aside className="chat-draft">
      <div className="chat-draft-top">
        <p>New Notification</p>
        <button className="chat-draft-save" type="button">
          Save as draft
        </button>
      </div>
      {children}
    </aside>
  );
}

function Heading() {
  return (
    <div className="chat-draft-copy">
      <h2>Brand Mentions</h2>
      <p>We'll deliver matching posts to your channels.</p>
    </div>
  );
}

function ContentSectionEdit() {
  return (
    <CardShell>
      <Heading />
      {BLOCKS.map((block) => (
        <div key={block.title} className="chat-draft-block">
          <div className="dd-section-head">
            <h3>{block.title}</h3>
            <button className="dd-edit" type="button">
              <ChatIcon src={chatAssets.edit} size={16} />
              Edit
            </button>
          </div>
          <div className="chat-chips">
            {block.values.map((value) => (
              <span key={value} className="dd-chip-tight">
                {value}
              </span>
            ))}
          </div>
        </div>
      ))}
    </CardShell>
  );
}

function ContentCriteria() {
  return (
    <CardShell>
      <Heading />
      <div className="dd-criteria">
        <div className="dd-criteria-head">
          <p>
            Notification • v1 <span>4</span>
          </p>
        </div>
        <div className="dd-criteria-field">
          <p className="dd-criteria-label">Notify about</p>
          <p>Brand mentions of Plot across Instagram and TikTok.</p>
        </div>
        <div className="chat-chips">
          <span className="dd-chip-tint">Neutral sentiment</span>
          <span className="dd-chip-tint">Negative sentiment</span>
          <span className="dd-chip-tint">As it happens</span>
          <span className="dd-chip-tint">Slack</span>
        </div>
        <p className="dd-criteria-hint">Ask Plot to add, drop, or update any of these.</p>
      </div>
    </CardShell>
  );
}

function ContentRows() {
  return (
    <CardShell>
      <Heading />
      <dl className="dd-rows">
        {BLOCKS.map((block) => (
          <div key={block.title}>
            <dt>{block.title}</dt>
            <dd>{block.values.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </CardShell>
  );
}

function ContentAccordion() {
  return (
    <CardShell>
      <Heading />
      <div className="dd-accords">
        {BLOCKS.map((block, index) => (
          <details key={block.title} className="dd-accord" open={index === 0}>
            <summary>
              {block.title}
              <span>{block.values.length}</span>
            </summary>
            <div className="chat-chips">
              {block.values.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </CardShell>
  );
}

export function DesignDecisions() {
  const [index, setIndex] = useState(0);
  const current = designDecisions[index];

  if (!current) return null;

  return (
    <div className="chat-lab is-catalog">
      <div className="chat-catalog">
        <header className="chat-catalog-intro">
          <p>Chat design system</p>
          <h1>Design decisions</h1>
          <p>Calls we make and keep. Click the line to see the next one.</p>
        </header>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 15 · Workflows · Open</p>
              <h2>Side content</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            Same subtle card. Different ways to write the notification inside — including the criteria wash we already
            use in sourcing.
          </p>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas chat-draft-preview">
              <figcaption>Section + Edit — Workflows</figcaption>
              <ContentSectionEdit />
            </figure>
            <figure className="chat-spec-canvas chat-draft-preview">
              <figcaption>Criteria wash — sourcing</figcaption>
              <ContentCriteria />
            </figure>
            <figure className="chat-spec-canvas chat-draft-preview">
              <figcaption>Text rows</figcaption>
              <ContentRows />
            </figure>
            <figure className="chat-spec-canvas chat-draft-preview">
              <figcaption>Accordion</figcaption>
              <ContentAccordion />
            </figure>
          </div>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>Theme card texture</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            A texture behind the reference posts, like the stipple in Figma (2884:41806). Each theme gets a different
            one so the feed doesn’t read as the same card five times. Same seed, same texture, so a theme keeps its look
            every time you come back.
          </p>
          <div className="tt-grid">
            {TEXTURES.map((texture, index) => (
              <figure key={texture.id}>
                <TexturedThemePreview id={texture.id} seed={index + 3} />
                <figcaption>
                  <strong>{texture.name}</strong>
                  <span>{texture.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>Focus carousel</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            The post in the center is full size; the rest sit a little smaller and softer. Scroll, swipe, or use the
            arrows and whichever post lands in the middle grows into focus (Figma 2902:45918).
          </p>
          <FocusCarousel />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 28 · Newsfeed · Open</p>
              <h2>Key theme · stacked posts</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            The earlier key-theme treatment: copy on the left, a pile of three captures on the right. Front card shows
            the handle and caption; the two behind sit at ±2° with the text hidden. Kept here so we can compare it to
            the single-post version on the newsfeed.
          </p>
          <ThemeFeature theme={GRID_THEMES[0]} />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 28 · Theme page · Decided</p>
              <h2>Theme page post layout</h2>
            </div>
            <p className="chat-explore-flag">Cards</p>
          </header>
          <p className="chat-explore-note">
            How the theme page lays out its posts. We went with Cards, a 4-up grid, so people can scan the whole theme
            at once. Filmstrip, Pages and Stage stay here for reference.
          </p>
          <PostLayouts />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 28 · Theme page · Decided</p>
              <h2>Post card metrics</h2>
            </div>
            <p className="chat-explore-flag">Spaced icons</p>
          </header>
          <p className="chat-explore-note">
            Views, likes and comments under each post on the theme page. We moved from pills to plain grey icons and let
            spacing do the grouping, so the post content stays the focus. The other options stay here for reference.
          </p>
          <div className="dd-metric-grid">
            {METRIC_VARIANTS.map((variant) => (
              <figure key={variant.id}>
                <PostCard post={METRIC_SAMPLE} metrics={variant.id} />
                <figcaption>
                  <strong>{variant.name}</strong>
                  <span>{variant.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>Capture container</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            The posts drop their frames and sit straight on the card, like captures, and the card edge cuts the row off
            so it reads as scrollable. Ask AI and Start tracking move up next to the source (Figma 2884:41054).
          </p>
          <CaptureCard />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>2×2 theme grid</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            Four themes at a glance instead of one long list. Each card stacks the copy over a carousel of tilted
            captures that runs to the card edge, so you can swipe through a theme’s videos without leaving the grid
            (Figma 2925:64776).
          </p>
          <ThemeGrid />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>2×2 theme grid · textured base</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            Same grid, but the posts sit on a two-tone camo band that bleeds to the card edges, with a ragged top that
            spills a few blobs into the copy. Each theme gets its own colors (Figma 2925:64990).
          </p>
          <ThemeGrid variant="band" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>2×2 theme grid · sky bleed</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            The card fades from white into a soft two-color wash behind the posts, with wispy edges where the colors
            meet. Sage into blue by default, tinted per theme.
          </p>
          <ThemeGrid variant="bleed" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>2×2 theme grid · color panel</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            The copy stays on white and the posts sit fully inside a textured panel that runs to the card edges, so the
            color frames the videos instead of peeking out behind them (Figma 2933:65200).
          </p>
          <ThemeGrid variant="panel" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>2×2 theme grid · corner glow</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            The quietest option: a soft radial wash of the theme color rising from the bottom corner, with a faint echo
            in the opposite corner. No texture, just enough tint to tell themes apart.
          </p>
          <ThemeGrid variant="corner" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · image glow</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            The posts sit in a full-bleed panel washed with soft radial gradients. Each theme’s colors are pulled from
            its own videos (skin tones, sky, foliage) and lightened, so the panel feels like part of the content.
          </p>
          <ThemeGrid variant="glow" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · photo backdrop</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            Real image backdrops behind the posts: the maroon stipple on pink from Figma 3090:66378 for NYX, a pale blue
            plaster for Anne Hathaway, and a torn-paper orange collage for Lululemon. Themes without their own image
            fall back to the pink.
          </p>
          <ThemeGrid variant="photo" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · pixel clouds</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            A dithered pixel band with white clouds breaking in at the top and bottom, and small patches of plus marks,
            like a low-res sky.
          </p>
          <ThemeGrid variant="pixel" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · single post, stacked</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            From Figma 3153:2464. One post centred in a grey block across the top, with the updated time, actions,
            headline and summary underneath. Clicking the card opens the full theme page.
          </p>
          <ThemeGrid variant="gray" layout="stack" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · single post, side by side</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            From Figma 3153:2519. The post sits in a grey panel on the left, with the headline, summary and actions on
            the right.
          </p>
          <ThemeGrid variant="gray" layout="split" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · creator avatars</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            Overlapping creator avatars with the number of creators, under the summary.
          </p>
          <ThemeGrid variant="gray" layout="split" sources="creators" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · post stack</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            A small stack of post thumbnails with the total number of posts in the theme. This is what the newsfeed
            uses.
          </p>
          <ThemeGrid variant="gray" layout="split" sources="posts" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · view posts, no chip</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            Same “View 96 posts” control as the newsfeed, without the grey pill. The stack, count, and arrow sit on the
            card so the copy column stays quieter.
          </p>
          <ThemeGrid variant="gray" layout="split" sources="posts" sourcesChrome="plain" />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Open</p>
              <h2>2×2 theme grid · side by side, textured panels</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            From Figma 3165:2923. Each theme gets its own colour with an image on top: pink halftone at 30%, lavender
            glow at 35%, blue pixel clouds at 50% and pink streaks over sage at 35%.
          </p>
          <ThemeGrid variant="gray" layout="split" textured />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 25 · Newsfeed · Superseded Sep 29</p>
              <h2>Browsing all 52 themes</h2>
            </div>
            <p className="chat-explore-flag">Superseded</p>
          </header>
          <p className="chat-explore-note">
            Superseded by a 14-day default. The feed shows every theme from the last 14 days (about 52 raw themes, 21
            after merging near-duplicates, 17 with 5+ posts) with no cap. “Show all themes” reveals the rest of the
            timeframe at once. Longer timeframes add older themes inline under “Week of …” dividers. Kept for reference:
          </p>
          <p className="chat-explore-note">
            “Show all 52 themes” needs a way to move through a lot of content. Five ways to do it, each working with the
            same 52 themes. Switch between them to compare.
          </p>
          <ThemeBrowser />
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 24 · Newsfeed · Open</p>
              <h2>Textured post frames</h2>
            </div>
            <p className="chat-explore-flag">Exploring</p>
          </header>
          <p className="chat-explore-note">
            Instead of a white frame, the frame around each post carries the texture (Figma 2908:63848). The colors come
            from the theme itself, so Brow Glue feels pink and yellow and the golf wager feels green.
          </p>
          <div className="tt-frame-rows">
            {FRAME_THEMES.map((theme, row) => (
              <section key={theme.id} className="tt-frame-row">
                <div className="tt-frame-head">
                  <span className="tt-swatches" aria-hidden="true">
                    {[theme.palette.ink, theme.palette.soft, theme.palette.base].map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <strong>{theme.name}</strong>
                  <span>{theme.why}</span>
                </div>
                <div className="tt-frame-set">
                  {FRAME_TEXTURES.map((texture, index) => (
                    <figure key={texture.id}>
                      <TexturedFrame
                        texture={texture.id}
                        palette={theme.palette}
                        seed={row * 10 + index + 2}
                        src={theme.post}
                        handle={theme.handle}
                      />
                      <figcaption>{texture.name}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <StatusLine label={current.title} onSelect={() => setIndex((value) => (value + 1) % designDecisions.length)} />
        <dl className="dd-detail">
          <div>
            <dt>We</dt>
            <dd>{current.we}</dd>
          </div>
          <div>
            <dt>Because</dt>
            <dd>{current.because}</dd>
          </div>
          <div>
            <dt>Not</dt>
            <dd>{current.not}</dd>
          </div>
          <div>
            <dt>Lives</dt>
            <dd>{current.lives}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
