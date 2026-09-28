import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { assets } from "./assets";

export type ThreadComment = {
  avatar: string;
  name: string;
  time: string;
  text: string;
  likes: string;
  replies: string;
};

type CommentCountProps = {
  id: string;
  comments: ThreadComment[];
  open: boolean;
  align?: "center" | "end";
  labeled?: boolean;
  count?: number;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export function CommentCount({
  id,
  comments,
  open,
  align = "center",
  labeled = false,
  count,
  onOpen,
  onClose,
}: CommentCountProps) {
  const [index, setIndex] = useState(0);
  const hideTimer = useRef<number | undefined>(undefined);
  const comment = comments[index];
  const shown = comments.length;
  const total = count ?? shown;
  const pillLabel = labeled
    ? `${total} comment${total === 1 ? "" : "s"}`
    : String(total);

  useEffect(() => {
    if (!open) setIndex(0);
  }, [open]);

  const show = () => {
    window.clearTimeout(hideTimer.current);
    onOpen(id);
  };

  const hide = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(onClose, 400);
  };

  const previous = () => setIndex((current) => (current - 1 + shown) % shown);
  const next = () => setIndex((current) => (current + 1) % shown);

  return (
    <span
      className={`count-wrap${open ? " is-open" : ""}${align === "end" ? " align-end" : ""}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onKeyDown={(event) => {
        if (!open) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "Escape") onClose();
      }}
    >
      <button
        className={`count-pill${labeled ? " is-labeled" : ""}`}
        type="button"
        aria-expanded={open}
        aria-controls={`comment-tooltip-${id}`}
        onFocus={show}
        onBlur={hide}
      >
        {pillLabel}
      </button>
      {open && comment ? (
        <div
          className="comment-tooltip"
          id={`comment-tooltip-${id}`}
          role="dialog"
          aria-label={`Relevant comments, ${index + 1} of ${shown}`}
        >
          <div className="comment-tooltip-bar">
            <div className="comment-tooltip-nav">
              <button type="button" aria-label="Previous comment" onClick={previous} disabled={shown <= 1}>
                <Icon src={assets.arrowLeft} size={16} />
              </button>
              <button type="button" aria-label="Next comment" onClick={next} disabled={shown <= 1}>
                <Icon src={assets.arrowRight} size={16} />
              </button>
            </div>
            <p className="comment-tooltip-page">
              {index + 1}/{shown}
            </p>
          </div>
          <div className="comment-tooltip-body">
            <div className="comment-tooltip-who">
              <span className="comment-avatar">
                <img src={comment.avatar} alt="" width={24} height={24} />
              </span>
              <div className="comment-who">
                <p className="comment-name">{comment.name}</p>
                <p className="comment-time">{comment.time}</p>
              </div>
            </div>
            <p className="comment-text">{comment.text}</p>
            <p className="comment-tooltip-meta">
              <span>{comment.likes}</span>
              {comment.replies ? (
                <>
                  <span>·</span>
                  <span>{comment.replies}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>
      ) : null}
    </span>
  );
}
