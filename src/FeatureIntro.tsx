import { useEffect, useRef, useState } from "react";
import { assets } from "./assets";

export type IntroVariant =
  | "spotlight"
  | "bubble"
  | "bubble-titled"
  | "confirm"
  | "rich"
  | "rich-stacked"
  | "corner"
  | "modal"
  | "plotting"
  | "plotting-serif"
  | "off";

export type IntroEmphasis = "dim" | "veil" | "blur" | "ring" | "glow" | "none";

export type LaunchId = "comments" | "sentiment";

export type Launch = {
  id: LaunchId;
  title: string;
  body: string;
  tag: "New" | "Updated";
  lead: string;
  rest: string;
  detail: string;
};

export const LAUNCHES: Launch[] = [
  {
    id: "comments",
    title: "See what your comments are saying",
    body: "Get the gist of every comment on your post: overall sentiment and what people keep bringing up. No more scrolling.",
    tag: "New",
    lead: "Comment Summary",
    rest: "is here. Get the gist of every comment on your post without scrolling through them all.",
    detail: "Get the gist of every comment on your post without scrolling through them all.",
  },
  {
    id: "sentiment",
    title: "Sentiment now shows as a score",
    body: "One number for how people feel about a post, with the breakdown a click away.",
    tag: "Updated",
    lead: "Sentiment",
    rest: "now shows as one score for how people feel, with the breakdown a click away.",
    detail: "One number for how people feel about a post, with the breakdown a click away.",
  },
];

const maskStyle = (src: string) => ({ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` });

export function BubbleTip({
  id = "comments",
  titled = false,
  onSkip,
}: {
  id?: LaunchId;
  titled?: boolean;
  onSkip: () => void;
}) {
  const item = LAUNCHES.find((launch) => launch.id === id) ?? LAUNCHES[0];
  return (
    <div className={`intro-bubble${titled ? " is-titled" : ""}`} role="dialog" aria-label={item.title}>
      <div className="intro-bubble-head">
        {titled ? (
          <h3 className="intro-bubble-title">{item.title}</h3>
        ) : (
          <span className="intro-bubble-tag">{item.tag}</span>
        )}
        <button className="intro-bubble-close" type="button" aria-label="Close" onClick={onSkip}>
          <span className="intro-bubble-icon" style={maskStyle(assets.intro.closeSm)} />
        </button>
      </div>
      {titled ? (
        <p className="intro-bubble-text">{item.detail}</p>
      ) : (
        <h3 className="intro-bubble-title">{item.title}</h3>
      )}
    </div>
  );
}

export function CornerTip({
  inline = false,
  emphasis = "none",
  onDismiss,
}: {
  inline?: boolean;
  emphasis?: IntroEmphasis;
  onDismiss: () => void;
}) {
  const primary = useRef<HTMLButtonElement>(null);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    if (inline) return;
    primary.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inline]);

  return (
    <aside
      className={`intro-corner is-${emphasis}${inline ? " is-inline" : ""}`}
      role="dialog"
      aria-labelledby="intro-corner-title"
      aria-describedby="intro-corner-body"
    >
      <div className="intro-rich-card">
        <IntroPreview bg="halftone" />
        <div className="intro-rich-body">
          <div className="intro-rich-head">
            <h2 id="intro-corner-title" className="intro-rich-title">
              Label your comments to group and compare.
            </h2>
          </div>
          <p id="intro-corner-body" className="intro-rich-text">
            Comments on posts in custom reports or topics are labeled automatically.
          </p>
          <div className="intro-btns intro-rich-btns">
            <button ref={primary} className="intro-btn is-primary is-sm" type="button" onClick={onDismiss}>
              Sweet
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ConfirmDialog({ inline = false, onDismiss }: { inline?: boolean; onDismiss: () => void }) {
  const primary = useRef<HTMLButtonElement>(null);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    if (inline) return;
    primary.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inline]);
  return (
    <div className="intro-modal-wrap is-dim is-confirm" onClick={onDismiss}>
      <div
        className="intro-confirm"
        role="alertdialog"
        aria-modal={!inline}
        aria-labelledby="intro-confirm-title"
        aria-describedby="intro-confirm-body"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="intro-confirm-head">
          <div className="intro-confirm-copy">
            <img src={assets.intro.plotLogo} alt="" width={28.8} height={28.8} />
            <h2 id="intro-confirm-title" className="intro-confirm-title">
              See what your comments are saying
            </h2>
            <p id="intro-confirm-body" className="intro-confirm-body">
              Get the gist of every comment on your post: overall sentiment and what people keep bringing up.
            </p>
          </div>
          <button className="intro-confirm-close" type="button" aria-label="Close" onClick={onDismiss}>
            <img src={assets.intro.closeSm} alt="" width={12} height={12} />
          </button>
        </div>
        <div className="intro-btns intro-confirm-actions">
          <button ref={primary} className="intro-btn is-primary is-sm" type="button" onClick={onDismiss}>
            Got it
          </button>
          <button className="intro-btn is-sm" type="button" onClick={onDismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

const RICH_TOP_POSTS = [
  { handle: "@marisolgetsready", value: "94.1K", icon: assets.rich.tiktok },
  { handle: "@thequietshelf", value: "51.3K", icon: assets.rich.instagram },
  { handle: "@dermdiaries", value: "38.7K", icon: assets.rich.tiktok },
];

export type RichCaret =
  "right-top" | "right-bottom" | "left-top" | "left-bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function RichTip({
  id = "comments",
  stacked = false,
  caret,
  onNext,
  onSkip,
}: {
  id?: LaunchId;
  stacked?: boolean;
  caret?: RichCaret;
  onNext: (next: LaunchId | null) => void;
  onSkip: () => void;
}) {
  const index = Math.max(
    0,
    LAUNCHES.findIndex((item) => item.id === id),
  );
  const item = LAUNCHES[index];
  const next = LAUNCHES[index + 1]?.id ?? null;
  const head = (
    <div className="intro-rich-head">
      <h3 className="intro-rich-title">{item.lead}</h3>
      <button className="intro-rich-close" type="button" aria-label="Close" onClick={onSkip}>
        <span>
          <img src={assets.rich.close} alt="" width={9.5} height={9.5} />
        </span>
      </button>
    </div>
  );
  return (
    <div
      className={`intro-rich${stacked ? " is-stacked" : ""}${caret ? ` is-caret-${caret}` : ""}`}
      role="dialog"
      aria-label={item.lead}
    >
      <span className="intro-rich-arrow" aria-hidden="true">
        <span>
          {stacked ? null : (
            <span className="intro-rich-arrow-fill">
              <span className="intro-rich-orchid">
                <img src={assets.intro.bgOrchidLayout} alt="" />
              </span>
            </span>
          )}
        </span>
      </span>
      <div className="intro-rich-card">
        {stacked ? head : null}
        <div className="intro-rich-media" aria-hidden="true">
          <img className="intro-rich-base" src={assets.plotting.bgBase} alt="" />
          <span className="intro-rich-orchid">
            <img src={assets.intro.bgOrchidLayout} alt="" />
          </span>
          <p className="intro-rich-ask">Which posts drove the most engagement last week?</p>
          <div className="intro-rich-answer">
            <p className="intro-rich-label">Top posts • Aug 4 - 10</p>
            <ul>
              {RICH_TOP_POSTS.map((row) => (
                <li key={row.handle}>
                  <span>
                    <img src={row.icon} alt="" width={9.81} height={9.81} />
                    {row.handle}
                  </span>
                  <strong>{row.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="intro-rich-body">
          {stacked ? null : head}
          <p className="intro-rich-text">{item.detail}</p>
          <div className="intro-btns intro-rich-btns">
            <button className="intro-btn is-primary is-sm" type="button" onClick={() => onNext(next)}>
              Try it
            </button>
            <button className="intro-btn is-sm" type="button" onClick={onSkip}>
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type PlottingAction = { kind: "try" | "setup" | "learn"; label: string; href: string };

const PLOTTING: {
  name: string;
  body: string;
  icon: "dataOrg" | "messageQuestion" | "trello";
  preview: string;
  action?: PlottingAction;
  notesHref?: string;
}[] = [
  {
    name: "Plot MCP",
    body: "Your brand data, in whatever AI assistant you already use.",
    icon: "dataOrg",
    preview: assets.plotting.previewMcp,
    action: { kind: "setup", label: "Set up", href: "#plot-mcp-setup" },
  },
  {
    name: "Comment Labels",
    body: "Reply-ready drafts for the comments that matter most.",
    icon: "messageQuestion",
    preview: assets.plotting.previewLabels,
    action: { kind: "try", label: "Try it", href: "#comment-suggestions" },
    notesHref: "#release-notes-comment-suggestions",
  },
  {
    name: "Comment Summary",
    body: "See what your comments are saying without scrolling through them all.",
    icon: "trello",
    preview: assets.plotting.previewSharing,
    action: { kind: "try", label: "Try it", href: "#comment-summary" },
  },
];

export function PlottingModal({
  emphasis,
  serif = false,
  onDismiss,
}: {
  emphasis: IntroEmphasis;
  serif?: boolean;
  onDismiss: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const last = current === PLOTTING.length - 1;
  const { action } = PLOTTING[current];
  const advance = () => (last ? onDismiss() : setCurrent(current + 1));
  const advanceLabel = last ? "Done" : "Next";
  return (
    <div className={`intro-modal-wrap is-${emphasis}`} onClick={onDismiss}>
      <div
        className={`intro-sheet intro-plot${serif ? " is-serif" : ""}`}
        role="dialog"
        aria-label="We’ve been Plotting!"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="intro-plot-main">
          <div className="intro-plot-content">
            <div className="intro-plot-head">
              <p className="intro-plot-kicker">Psst!</p>
              <h2 className="intro-plot-title">We’ve been Plotting!</h2>
            </div>
            <ul className="intro-plot-list">
              {PLOTTING.map((item, index) => (
                <li key={item.name} className={index === current ? "is-active" : undefined}>
                  <button
                    className={`intro-plot-row${index === current ? " is-active" : ""}`}
                    type="button"
                    aria-expanded={index === current}
                    onClick={() => setCurrent(index)}
                  >
                    <span className="intro-plot-row-head">
                      <span className="intro-plot-name">
                        <span className={`intro-plot-icon is-${item.icon}`}>
                          <img src={assets.plotting[item.icon]} alt="" />
                        </span>
                        {item.name}
                      </span>
                      <img src={assets.plotting.arrowRight} alt="" width={24} height={24} />
                    </span>
                  </button>
                  <div className="intro-plot-body">
                    <p>
                      {item.body}
                      {item.notesHref ? (
                        <>
                          {" "}
                          <a
                            href={item.notesHref}
                            tabIndex={index === current ? undefined : -1}
                            onClick={(event) => event.preventDefault()}
                          >
                            Read release notes
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="intro-btns">
            {action ? (
              <>
                <a
                  className="intro-btn is-primary"
                  href={action.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onDismiss();
                  }}
                >
                  {action.label}
                </a>
                <button className="intro-btn" type="button" onClick={advance}>
                  {advanceLabel}
                </button>
              </>
            ) : (
              <button className="intro-btn is-primary" type="button" onClick={advance}>
                {advanceLabel}
              </button>
            )}
          </div>
        </div>
        <div className="intro-plot-stage">
          <button className="intro-rich-close intro-plot-close" type="button" aria-label="Close" onClick={onDismiss}>
            <span>
              <img src={assets.rich.close} alt="" width={9.5} height={9.5} />
            </span>
          </button>
          {PLOTTING.map(({ name, preview }, index) => (
            <img
              key={name}
              className={`intro-plot-slide${index === current ? " is-active" : ""}`}
              src={preview}
              alt=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TOP_POSTS = [
  { handle: "@marisolgetsready", value: "94.1K", icon: assets.intro.tiktok },
  { handle: "@thequietshelf", value: "51.3K", icon: assets.intro.instagram },
  { handle: "@dermdiaries", value: "38.7K", icon: assets.intro.tiktok },
];

export function SpotlightPopover({
  id = "comments",
  onNext,
  onSkip,
}: {
  id?: LaunchId;
  onNext: (next: LaunchId | null) => void;
  onSkip: () => void;
}) {
  const index = Math.max(
    0,
    LAUNCHES.findIndex((item) => item.id === id),
  );
  const item = LAUNCHES[index];
  const next = LAUNCHES[index + 1]?.id ?? null;
  return (
    <div className="intro-pop" role="dialog" aria-label={item.title}>
      <div className="intro-pop-head">
        <div className="intro-pop-copy">
          <h3 className="intro-pop-title">{item.title}</h3>
          <p className="intro-pop-body">{item.body}</p>
        </div>
        <button className="intro-pop-close" type="button" aria-label="Close" onClick={onSkip}>
          <img src={assets.intro.closeSm} alt="" width={12} height={12} />
        </button>
      </div>
      <div className="intro-pop-foot">
        <span className="intro-step">
          {index + 1}/{LAUNCHES.length}
        </span>
        <div className="intro-btns">
          <button className="intro-btn is-primary is-sm" type="button" onClick={() => onNext(next)}>
            {next ? "Next" : "Done"}
          </button>
          {next ? (
            <button className="intro-btn is-sm" type="button" onClick={onSkip}>
              Skip all
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function IntroPreview({ bg, className = "" }: { bg: "smooth" | "halftone"; className?: string }) {
  return (
    <div className={`intro-preview ${className}`}>
      <img className="intro-preview-base" src={assets.intro.previewBase} alt="" />
      {bg === "smooth" ? (
        <img className="intro-preview-bg" src={assets.intro.bgSmoothOrchid} alt="" />
      ) : (
        <span className="intro-preview-bg is-rotated">
          <img src={assets.intro.bgOrchidLayout} alt="" />
        </span>
      )}
      <p className="intro-preview-ask">Which posts drove the most engagement last week?</p>
      <div className="intro-preview-answer">
        <p className="intro-preview-label">Top posts • Aug 4 - 10</p>
        <ul>
          {TOP_POSTS.map((row) => (
            <li key={row.handle}>
              <span>
                <img src={row.icon} alt="" width={20} height={20} />
                {row.handle}
              </span>
              <strong>{row.value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function IntroModal({
  emphasis,
  serif = false,
  onDismiss,
}: {
  emphasis: IntroEmphasis;
  serif?: boolean;
  onDismiss: () => void;
}) {
  return (
    <div className={`intro-modal-wrap is-${emphasis}`} onClick={onDismiss}>
      <div
        className={`intro-sheet intro-single${serif ? " is-serif" : ""}`}
        role="dialog"
        aria-label="The Plot MCP is here"
        onClick={(event) => event.stopPropagation()}
      >
        <IntroPreview bg="halftone" />
        <div className="intro-single-body">
          <div className="intro-single-copy">
            <h2 className="intro-sheet-title">The Plot MCP is here</h2>
            <p className="intro-single-text">Your brand data, in whatever AI assistant you already use.</p>
          </div>
          <div className="intro-btns">
            <button className="intro-btn is-primary" type="button" onClick={onDismiss}>
              Learn more
            </button>
            <button className="intro-btn" type="button" onClick={onDismiss}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
