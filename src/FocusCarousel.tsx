import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { ThemeTexture } from "./theme-textures";

const file = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;
const IMAGES = [file("pick-image.png"), file("clip-2.png"), file("clip-3.png")];
const POSTS = Array.from({ length: 5 }, (_, index) => ({ src: IMAGES[index % IMAGES.length], handle: "@uhodom_edinym" }));
export const CAPTION = "A beauty creator names Victoria Beckham by Augustinus Bader The Foundation Drops as one of her top";

const MIN_SCALE = 0.78;
const FOCUS_ANGLE = 2.39;
const SIDE_ANGLE = -0.68;

export type FocusPost = { src: string; handle: string };

export function FocusStrip({
  posts,
  label,
  onOpen,
  actions,
  interactive = true,
  limit = 3,
}: {
  posts: FocusPost[];
  label: string;
  onOpen?: (index: number) => void;
  actions?: ReactNode;
  interactive?: boolean;
  limit?: number;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const settle = useRef(0);
  const count = posts.length;
  const still = posts.slice(0, limit);
  const loop = [0, 1, 2].flatMap((copy) => posts.map((post, index) => ({ post, index, copy })));

  const update = useCallback(() => {
    const node = strip.current;
    if (!node) return;
    const center = node.scrollLeft + node.clientWidth / 2;
    node.querySelectorAll<HTMLElement>(".fc-post").forEach((item) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const t = Math.min(1, Math.abs(center - itemCenter) / (item.offsetWidth * 1.1));
      item.style.setProperty("--fc-scale", String(1 - (1 - MIN_SCALE) * t));
      item.style.setProperty("--fc-rotate", `${FOCUS_ANGLE + (SIDE_ANGLE - FOCUS_ANGLE) * t}deg`);
      item.classList.toggle("is-focus", t < 0.5);
    });
  }, []);

  const wrap = useCallback(() => {
    const node = strip.current;
    const items = node?.querySelectorAll<HTMLElement>(".fc-post");
    if (!node || !items || items.length < count * 3) return;
    const set = items[count].offsetLeft - items[0].offsetLeft;
    const center = node.scrollLeft + node.clientWidth / 2;
    const start = items[count].offsetLeft;
    const end = items[count * 2].offsetLeft;
    if (center < start) node.scrollLeft += set;
    else if (center >= end) node.scrollLeft -= set;
  }, [count]);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(update);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(wrap, 160);
  };

  const center = (item: HTMLElement, behavior: ScrollBehavior) => {
    const node = strip.current;
    if (node) node.scrollTo({ left: item.offsetLeft + item.offsetWidth / 2 - node.clientWidth / 2, behavior });
  };

  const go = (direction: 1 | -1) => {
    const node = strip.current;
    const first = node?.querySelector<HTMLElement>(".fc-post");
    if (!node || !first) return;
    node.scrollBy({ left: direction * (first.offsetWidth + 12), behavior: "smooth" });
  };

  useEffect(() => {
    if (!interactive) return;
    const middle = strip.current?.querySelectorAll<HTMLElement>(".fc-post")[count + Math.floor(count / 2)];
    if (middle) center(middle, "instant");
    update();
    return () => {
      cancelAnimationFrame(frame.current);
      window.clearTimeout(settle.current);
    };
  }, [count, interactive, update]);

  if (!interactive) {
    const focus = Math.min(1, still.length - 1);
    return (
      <div className="fc-media is-static">
        <div className="fc-strip" role="list" aria-label={label}>
          {still.map((post, index) => (
            <button
              key={`${post.src}-${index}`}
              type="button"
              className={`fc-post${index === focus ? " is-focus" : ""}`}
              aria-label={`Open post ${index + 1} from ${post.handle}`}
              onClick={() => onOpen?.(index)}
            >
              <span className="fc-post-inner">
                <img src={post.src} alt="" />
                <span className="fc-handle">{post.handle}</span>
                <span className="fc-caption">{CAPTION}</span>
              </span>
            </button>
          ))}
        </div>
        {actions ? <div className="fc-actions">{actions}</div> : null}
      </div>
    );
  }

  return (
    <div className="fc-media">
      <div className="fc-strip" ref={strip} onScroll={onScroll} tabIndex={0} role="region" aria-label={label}>
        {loop.map(({ post, index, copy }) => (
          <button
            key={`${copy}-${index}`}
            type="button"
            className="fc-post"
            aria-label={`Open post ${index + 1} from ${post.handle}`}
            aria-hidden={copy !== 1 || undefined}
            tabIndex={copy === 1 ? undefined : -1}
            onClick={(event) => {
              const item = event.currentTarget;
              if (item.classList.contains("is-focus")) onOpen?.(index);
              else center(item, "smooth");
            }}
          >
            <span className="fc-post-inner">
              <img src={post.src} alt="" />
              <span className="fc-handle">{post.handle}</span>
              <span className="fc-caption">{CAPTION}</span>
            </span>
          </button>
        ))}
      </div>
      {actions ? <div className="fc-actions">{actions}</div> : null}
      <div className="fc-nav">
        <button type="button" aria-label="Previous post" onClick={() => go(-1)}>
          ‹
        </button>
        <button type="button" aria-label="Next post" onClick={() => go(1)}>
          ›
        </button>
      </div>
    </div>
  );
}

export function FocusCarousel() {
  return (
    <article className="fc-card">
      <div className="fc-copy">
        <p className="fc-kicker">Updated 4h ago</p>
        <h3>NYX Brow Glue: ‘Crazy Lift’ and Long-Lasting Hold</h3>
        <p className="fc-summary">
          Creators are showcasing the NYX The Brow Glue product, emphasizing its strong hold and ability to defy
          droopiness for lifted, laminated, and fluffy brows.
        </p>
        <div className="fc-stats">
          <span>
            Posts<strong>144</strong>
          </span>
          <span>
            View count<strong>2.39M</strong>
          </span>
          <span>
            Total engagement<strong>237.5k</strong>
          </span>
        </div>
      </div>
      <div className="fc-stage">
        <ThemeTexture id="glow" seed={4} />
        <FocusStrip posts={POSTS} label="Reference posts" />
      </div>
    </article>
  );
}
