import { useEffect } from "react";
import { PostPrototype } from "./PostPrototype";
import type { PostId } from "./posts";

const file = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;

export type OpenPost = { postId: PostId; title: string; source: string; queue?: { index: number; total: number } };

const ACTIONS = [
  { label: "Comment", icon: file("icon-action-comment.svg") },
  { label: "Label", icon: file("icon-action-label.svg") },
  { label: "Skip", icon: file("icon-action-skip.svg") },
  { label: "Report", icon: file("icon-action-report.svg") },
] as const;

export function NewsfeedPost({
  post,
  onClose,
  onAction,
  onPrev,
  onNext,
}: {
  post: OpenPost;
  onClose: () => void;
  onAction: (action: "Copy link" | (typeof ACTIONS)[number]["label"]) => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const queue = post.queue;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && onPrev && queue && queue.index > 0) onPrev();
      if (event.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, queue]);

  if (queue) {
    return (
      <div className="nf-review" role="dialog" aria-modal="true" aria-label={`Daily Picks, ${queue.index + 1} of ${queue.total}`}>
        <header className="nf-review-top">
          <div className="nf-review-progress">
            <span className="nf-review-count">
              {queue.index + 1}/{queue.total}
            </span>
            <span className="nf-review-bar">
              <span style={{ width: `${((queue.index + 1) / queue.total) * 100}%` }} />
            </span>
          </div>
          <button type="button" className="nf-icon-btn" aria-label="Close Daily Picks" onClick={onClose}>
            <img src={file("icon-close.svg")} alt="" width={24} height={24} />
          </button>
        </header>

        <div className="nf-review-stage">
          <button type="button" className="nf-review-nav" disabled={queue.index === 0} onClick={onPrev}>
            <span>
              <img className="is-flipped" src={file("icon-arrow-right.svg")} alt="" width={28} height={28} />
            </span>
            Previous
          </button>
          <div className="nf-post nf-review-card" key={queue.index}>
            <header className="nf-post-top">
              <div className="nf-post-heading">
                <p>{post.source}</p>
                <h2>{post.title}</h2>
              </div>
            </header>
            <div className="nf-post-body">
              <PostPrototype postId={post.postId} summaryMode="themes" sentimentMode="score" />
            </div>
            <footer className="nf-post-actions">
              {ACTIONS.filter((action) => action.label !== "Skip").map((action) => (
                <button key={action.label} type="button" className="nf-btn is-soft" onClick={() => onAction(action.label)}>
                  <img src={action.icon} alt="" width={16} height={16} />
                  {action.label}
                </button>
              ))}
            </footer>
          </div>
          <button type="button" className="nf-review-nav" onClick={onNext}>
            <span>
              <img src={file("icon-arrow-right.svg")} alt="" width={28} height={28} />
            </span>
            {queue.index === queue.total - 1 ? "Finish" : "Skip"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nf-post-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="nf-post" role="dialog" aria-modal="true" aria-label={post.title}>
        <header className="nf-post-top">
          <button type="button" className="nf-icon-btn" aria-label="Back" onClick={onClose}>
            <img src={file("icon-back.svg")} alt="" width={20} height={20} />
          </button>
          <div className="nf-post-heading">
            <p>{post.source}</p>
            <h2>{post.title}</h2>
          </div>
          <button type="button" className="nf-btn is-sm is-soft" onClick={() => onAction("Copy link")}>
            Copy link
          </button>
          <button type="button" className="nf-icon-btn" aria-label="Close post" onClick={onClose}>
            <img src={file("icon-close.svg")} alt="" width={24} height={24} />
          </button>
        </header>
        <div className="nf-post-body">
          <PostPrototype postId={post.postId} summaryMode="themes" sentimentMode="score" />
        </div>
        <footer className="nf-post-actions">
          {ACTIONS.map((action) => (
            <button key={action.label} type="button" className="nf-btn is-soft" onClick={() => onAction(action.label)}>
              <img src={action.icon} alt="" width={16} height={16} />
              {action.label}
            </button>
          ))}
        </footer>
      </div>
    </div>
  );
}
