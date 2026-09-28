import { useEffect, useRef, useState, type ReactNode } from "react";
import { chatAssets } from "./chat-assets";

export function ChatIcon({ src, size, alt = "" }: { src: string; size: number; alt?: string }) {
  return (
    <span className="icon" style={{ width: size, height: size }}>
      <img src={src} alt={alt} width={size} height={size} />
    </span>
  );
}

export function ChatChrome({
  path = ["Plot", "Creator Sourcing", "New search"],
  onBack,
  onClose,
}: {
  path?: [string, string, string];
  onBack?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="chat-top">
      <button className="chat-crumb" type="button" onClick={onBack}>
        <ChatIcon src={chatAssets.back} size={16} />
        <p>
          {path[0]} / {path[1]} / <strong>{path[2]}</strong>
        </p>
      </button>
      <button className="chat-close" type="button" aria-label="Close" onClick={onClose}>
        <ChatIcon src={chatAssets.close} size={16} />
      </button>
    </div>
  );
}

export function IntercomFab() {
  const [open, setOpen] = useState(false);
  return (
    <div className="chat-intercom-wrap">
      {open ? (
        <div className="chat-intercom-panel">
          <p>Need help with this search?</p>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      ) : null}
      <button
        className="chat-intercom"
        type="button"
        aria-label={open ? "Close messenger" : "Open messenger"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <ChatIcon src={chatAssets.intercom} size={24} />
      </button>
    </div>
  );
}

export function UserBubble({ text }: { text: string }) {
  return (
    <div className="chat-user-row">
      <div className="chat-user">
        <p>{text}</p>
      </div>
    </div>
  );
}

export function AssistantBubble({ text }: { text: string }) {
  return (
    <div className="chat-assistant">
      <p>{text}</p>
    </div>
  );
}

export function ChoiceCard({
  title,
  detail,
  selected = false,
  onSelect,
}: {
  title: string;
  detail: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      className={`chat-choice${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <p>{title}</p>
      <p>{detail}</p>
    </button>
  );
}

export type FollowUpLayout = "chips" | "numbered" | "checks";

export function FollowUpQ({
  question,
  step = 1,
  total = 3,
  options,
  layout = "chips",
  selected,
  writeIn = true,
  skip = false,
  pager = true,
  className,
  onSelect,
  onPrev,
  onNext,
  onSkip,
  onWriteIn,
}: {
  question: string;
  step?: number;
  total?: number;
  options: string[];
  layout?: FollowUpLayout;
  selected?: string | null;
  writeIn?: boolean;
  skip?: boolean;
  pager?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  onWriteIn?: () => void;
}) {
  return (
    <div className={`follow-q is-${layout}${className ? ` ${className}` : ""}`}>
      <div className="follow-q-top">
        <p>{question}</p>
        {pager ? (
          <div className="follow-q-pager">
            <button type="button" aria-label="Previous question" onClick={onPrev} disabled={step <= 1}>
              <ChatIcon src={chatAssets.chevronLeft} size={14} />
            </button>
            <span>
              {step} of {total}
            </span>
            <button type="button" aria-label="Next question" onClick={onNext} disabled={step >= total}>
              <ChatIcon src={chatAssets.chevronRight} size={14} />
            </button>
          </div>
        ) : null}
      </div>
      {layout === "chips" ? (
        <div className="follow-q-chips">
          {options.map((option) => (
            <button
              key={option}
              className={`follow-q-chip${selected === option ? " is-selected" : ""}`}
              type="button"
              onClick={() => onSelect?.(option)}
            >
              {option}
            </button>
          ))}
          {writeIn ? (
            <button className="follow-q-chip is-write" type="button" onClick={onWriteIn}>
              <ChatIcon src={chatAssets.edit} size={16} />
              Write in your own words
            </button>
          ) : null}
        </div>
      ) : (
        <div className="follow-q-list">
          {options.map((option, index) => (
            <button
              key={option}
              className={`follow-q-row${selected === option ? " is-selected" : ""}`}
              type="button"
              onClick={() => onSelect?.(option)}
            >
              {layout === "checks" ? (
                <ChatIcon src={selected === option ? chatAssets.checkBox : chatAssets.checkBoxEmpty} size={24} />
              ) : (
                <span className="follow-q-num">{index + 1}</span>
              )}
              <span>{option}</span>
            </button>
          ))}
          <div className="follow-q-foot">
            {writeIn ? (
              <button className="follow-q-row is-write" type="button" onClick={onWriteIn}>
                <span className="follow-q-num">
                  <ChatIcon src={chatAssets.edit} size={14} />
                </span>
                <span>Write in your own words</span>
              </button>
            ) : (
              <span />
            )}
            {skip ? (
              <button className="follow-q-skip" type="button" onClick={onSkip}>
                Skip
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function FileGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.2 1.5h5.1L12.5 4.7V13c0 .8-.6 1.5-1.4 1.5H4.2C3.4 14.5 2.8 13.8 2.8 13V3c0-.8.6-1.5 1.4-1.5Z"
        stroke="#230603"
        strokeLinejoin="round"
      />
      <path d="M9.2 1.6V5h3.2" stroke="#230603" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatLink({
  title,
  meta,
  kicker,
  compact = false,
}: {
  title: string;
  meta: string;
  kicker?: string;
  compact?: boolean;
}) {
  const card = (
    <button
      className={`chat-link${compact ? " is-compact" : ""}`}
      type="button"
      onClick={(event) => event.stopPropagation()}
    >
      <span className="chat-link-preview">
        <FileGlyph size={compact ? 18 : 16} />
      </span>
      <span className="chat-link-copy">
        <strong>{title}</strong>
        <span>{meta}</span>
      </span>
    </button>
  );

  if (!kicker) return card;

  return (
    <div className="chat-link-thread">
      <p className="chat-link-kicker">
        <FileGlyph size={16} />
        {kicker}
      </p>
      {card}
    </div>
  );
}

export function RecommendActions({
  actions,
  recommended,
  selected,
  onSelect,
}: {
  actions: string[];
  recommended?: string;
  selected?: string | null;
  onSelect?: (value: string) => void;
}) {
  return (
    <div className="recommend-actions">
      <div className="follow-q-chips">
        {actions.map((action) => {
          const isSelected = selected === action;
          const isRecommended = Boolean(recommended) && recommended === action && !selected;
          return (
            <button
              key={action}
              className={`follow-q-chip${isSelected ? " is-selected" : ""}${isRecommended ? " is-recommended" : ""}`}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect?.(action)}
            >
              {isSelected ? <ChatIcon src={chatAssets.check} size={14} /> : null}
              {action}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusCopy({
  text,
  where,
  state,
}: {
  text: string;
  where?: string;
  state: "in" | "out";
}) {
  return (
    <p className={`status-line-copy is-${state}`} aria-hidden={state === "out"}>
      {text}
      {where ? <span className="status-line-where"> · {where}</span> : null}
      <span className="status-line-ellipsis"> ...</span>
    </p>
  );
}

export function StatusLine({
  label,
  where,
  onSelect,
}: {
  label: string;
  where?: string;
  onSelect?: () => void;
}) {
  const [current, setCurrent] = useState(label);
  const [currentWhere, setCurrentWhere] = useState(where);
  const [outgoing, setOutgoing] = useState<{ text: string; where?: string } | null>(null);

  useEffect(() => {
    if (label === current && where === currentWhere) return;
    setOutgoing({ text: current, where: currentWhere });
    setCurrent(label);
    setCurrentWhere(where);
    const timer = window.setTimeout(() => setOutgoing(null), 320);
    return () => window.clearTimeout(timer);
  }, [label, where, current, currentWhere]);

  const body = (
    <>
      <span className="status-line-mark" aria-hidden="true">
        <span className="status-line-face">
          <img src={chatAssets.statusSpin} alt="" width={16} height={16} />
        </span>
      </span>
      <span className="status-line-slot">
        {outgoing ? <StatusCopy text={outgoing.text} where={outgoing.where} state="out" /> : null}
        <StatusCopy text={current} where={currentWhere} state="in" />
      </span>
    </>
  );

  if (onSelect) {
    return (
      <button className="status-line" type="button" onClick={onSelect}>
        {body}
      </button>
    );
  }

  return <div className="status-line">{body}</div>;
}

export type SearchDraft = {
  title: string;
  brief: string;
  criteria: string[];
  platforms: string[];
  size: string[];
};

export function deriveDraft(text: string): SearchDraft {
  const lower = text.toLowerCase();
  if (lower.includes("nyc")) {
    return {
      title: "NYC Creators",
      brief:
        "Find me NYC creators who are fashion forward, make day in the life videos with 2-5k followers who create cinematic vlogs. Women only. ",
      criteria: ["#nycfashion", "#nycvlog"],
      platforms: ["Instagram"],
      size: ["2-5k"],
    };
  }
  const sizeMatch = text.match(/\d+\s*[-–]\s*\d+\s*k/i)?.[0].replace(/\s+/g, "") ?? "";
  const words = text.replace(/[^\w\s-]/g, "").split(/\s+/).filter(Boolean);
  const title = words.slice(0, 3).join(" ") || "New search";
  const criteria: string[] = [];
  if (lower.includes("fashion")) criteria.push("#fashion");
  if (lower.includes("skincare") || lower.includes("dermat")) criteria.push("#skincare");
  if (lower.includes("vlog")) criteria.push("#vlog");
  if (!criteria.length) criteria.push("#creators");
  return {
    title: title.length > 28 ? `${title.slice(0, 26)}…` : title,
    brief: text,
    criteria,
    platforms: lower.includes("tiktok") ? ["TikTok"] : ["Instagram"],
    size: sizeMatch ? [sizeMatch] : [],
  };
}

export function Chip({
  label,
  variant = "default",
  selected = false,
  options,
  icon,
  onRemove,
  onEdit,
  onChange,
  onSelect,
}: {
  label: string;
  variant?: "default" | "dismiss" | "edit" | "menu" | "action";
  selected?: boolean;
  options?: string[];
  icon?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onChange?: (value: string) => void;
  onSelect?: () => void;
}) {
  if (variant === "menu" && options?.length) {
    return (
      <label className="chat-chip is-menu">
        <select value={label} onChange={(event) => onChange?.(event.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const className = `chat-chip${variant !== "default" ? ` is-${variant}` : ""}${selected ? " is-selected" : ""}`;

  const mark = !icon && selected ? <ChatIcon src={chatAssets.check} size={14} /> : null;
  const leading = icon ? <ChatIcon src={icon} size={16} /> : mark;

  if (onSelect) {
    return (
      <button className={className} type="button" aria-pressed={selected} onClick={onSelect}>
        {leading}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <span className={className}>
      {leading}
      <span>{label}</span>
      {variant === "edit" ? (
        <button type="button" aria-label={`Edit ${label}`} onClick={onEdit}>
          <ChatIcon src={chatAssets.edit} size={16} />
        </button>
      ) : null}
      {variant === "dismiss" ? (
        <button type="button" aria-label={`Remove ${label}`} onClick={onRemove}>
          <ChatIcon src={chatAssets.close} size={10} />
        </button>
      ) : null}
    </span>
  );
}

export type DraftBlock = {
  title: string;
  chips: { label: string; variant?: "default" | "edit" }[];
};

export function DraftPanel({
  draft,
  fillLevel,
  title,
  summary,
  blocks,
  kicker = "Draft",
  onEditChip,
}: {
  draft?: SearchDraft;
  fillLevel?: number;
  title?: string;
  summary?: string;
  blocks?: DraftBlock[];
  kicker?: string;
  onEditChip?: (label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const brief = draft?.brief ?? "";
  const long = brief.length > 120;
  const shown = open || !long ? brief : `${brief.slice(0, 118).trim()}…`;
  const level = fillLevel ?? 0;

  if (blocks) {
    return (
      <aside className="chat-draft">
        <div className="chat-draft-top">
          <p>{kicker}</p>
          <button
            className={saved ? "chat-draft-save is-saved" : "chat-draft-save"}
            type="button"
            onClick={() => setSaved(true)}
          >
            {saved ? "Saved" : "Save as draft"}
          </button>
        </div>
        <div className="chat-draft-copy">
          {title ? <h2>{title}</h2> : null}
          {summary ? <p>{summary}</p> : null}
        </div>
        {blocks.map((block) => (
          <div key={block.title} className="chat-draft-block">
            <h3>{block.title}</h3>
            <div className="chat-chips">
              {block.chips.map((chip) => (
                <Chip
                  key={chip.label}
                  label={chip.label}
                  variant={chip.variant ?? "edit"}
                  onEdit={() => onEditChip?.(chip.label)}
                />
              ))}
            </div>
          </div>
        ))}
      </aside>
    );
  }

  return (
    <aside className="chat-draft">
      <div className="chat-draft-top">
        <p>{kicker}</p>
        <button
          className={saved ? "chat-draft-save is-saved" : "chat-draft-save"}
          type="button"
          onClick={() => setSaved(true)}
        >
          {saved ? "Saved" : "Save as draft"}
        </button>
      </div>
      {level < 1 || !draft ? (
        <div className="chat-draft-copy">
          <span className="chat-draft-skel is-title" />
          <span className="chat-draft-skel is-line" />
          <span className="chat-draft-skel is-line is-short" />
        </div>
      ) : (
        <div className="chat-draft-copy">
          <h2>{draft.title}</h2>
          <p>{shown}</p>
          {long ? (
            <button className="chat-draft-more" type="button" onClick={() => setOpen((value) => !value)}>
              {open ? "See less" : "See more"}
            </button>
          ) : null}
        </div>
      )}
      {level >= 2 && draft ? (
        <div className="chat-draft-block">
          <h3>Criteria</h3>
          <div className="chat-chips">
            {draft.criteria.map((item) => (
              <Chip key={item} label={item} variant="edit" onEdit={() => onEditChip?.(item)} />
            ))}
          </div>
        </div>
      ) : null}
      {level >= 3 && draft ? (
        <>
          <div className="chat-draft-block">
            <h3>Platforms</h3>
            <div className="chat-chips">
              {draft.platforms.map((item) => (
                <Chip key={item} label={item} variant="edit" onEdit={() => onEditChip?.(item)} />
              ))}
            </div>
          </div>
          {draft.size.length ? (
            <div className="chat-draft-block">
              <h3>Creator Size</h3>
              <div className="chat-chips">
                {draft.size.map((item) => (
                  <Chip key={item} label={item} variant="edit" onEdit={() => onEditChip?.(item)} />
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </aside>
  );
}

export function WorkingStatus({ label = "Plot AI is working" }: { label?: string }) {
  return (
    <div className="chat-status">
      <p>{label}</p>
      <div className="chat-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export type ProcessVariant = "default" | "wash" | "bordered" | "compact" | "bar" | "numbered";

export function ProcessCard({
  title = "Processing your response",
  elapsed,
  steps,
  onToggle,
  variant = "default",
  activeIndex,
  meta,
}: {
  title?: string;
  elapsed: number;
  steps: { label: string; done: boolean }[];
  onToggle?: (index: number) => void;
  variant?: ProcessVariant;
  activeIndex?: number;
  meta?: string;
}) {
  const mins = Math.floor(elapsed / 60);
  const secs = String(elapsed % 60).padStart(2, "0");
  const doneCount = steps.filter((step) => step.done).length;
  const progress = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className={`chat-process is-${variant}`}>
      <div className="chat-process-head">
        <p>{title}</p>
        <span>{meta ?? `${mins}:${secs}`}</span>
      </div>
      {variant === "bar" ? (
        <div className="chat-process-bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {steps.map((step, index) => {
        const current = activeIndex === index && !step.done;
        return (
          <button
            key={step.label}
            className={`chat-process-row${current ? " is-current" : ""}${step.done ? " is-done" : ""}`}
            type="button"
            onClick={onToggle ? () => onToggle(index) : undefined}
            disabled={!onToggle}
          >
            <span
              className={`chat-check${step.done ? " is-done" : ""}${current ? " is-current" : ""}${
                variant === "numbered" ? " is-num" : ""
              }`}
            >
              {variant === "numbered" ? index + 1 : null}
            </span>
            <p>{step.label}</p>
          </button>
        );
      })}
    </div>
  );
}

export function Composer({
  value,
  onChange,
  onSubmit,
  docked = false,
  busy = false,
  placeholder,
  autoFocus = false,
  quote,
  quotes,
  onClearQuote,
  sendSize = 36,
  toolbar,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  docked?: boolean;
  busy?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  quote?: string | null;
  quotes?: string[];
  onClearQuote?: (quote: string) => void;
  sendSize?: number;
  toolbar?: ReactNode;
  children?: ReactNode;
}) {
  const field = useRef<HTMLTextAreaElement>(null);
  const canSend = !busy && value.trim().length > 0;

  useEffect(() => {
    if (!autoFocus || busy) return;
    const node = field.current;
    if (!node) return;
    node.focus();
    const end = node.value.length;
    node.setSelectionRange(end, end);
  }, [autoFocus, busy]);

  return (
    <form
      className={`chat-composer${docked ? " is-docked" : ""}${busy ? " is-busy" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        if (canSend) onSubmit();
      }}
      onClick={() => {
        if (!busy) field.current?.focus();
      }}
    >
      {children ? <div className="chat-composer-attach">{children}</div> : null}
      {(() => {
        const chips = quotes?.length ? quotes : quote ? [quote] : [];
        if (!chips.length) return null;
        return (
          <div className="chat-composer-quotes">
            {chips.map((item) => (
              <div className="chat-composer-quote" key={item}>
                <p>{item}</p>
                {onClearQuote ? (
                  <button
                    type="button"
                    aria-label={`Clear ${item}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onClearQuote(item);
                    }}
                  >
                    <ChatIcon src={chatAssets.close} size={14} />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        );
      })()}
      <textarea
        ref={field}
        value={busy && docked ? "Working on it…" : value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={busy}
        rows={docked ? 3 : 2}
        placeholder={placeholder ?? "Describe the creators you want…"}
        aria-label={busy ? "Composer unavailable" : "Message"}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (canSend) onSubmit();
          }
        }}
      />
      <div className={`chat-composer-foot${toolbar ? " is-split" : ""}`}>
        {toolbar}
        <button
          className={`chat-send${sendSize < 36 ? " is-sm" : ""}`}
          type="submit"
          disabled={!canSend}
          aria-label={canSend ? "Send" : "Send unavailable"}
        >
          <ChatIcon src={canSend ? chatAssets.send : chatAssets.sendDisabled} size={sendSize} />
        </button>
      </div>
    </form>
  );
}

export function useElapsed(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }
    setElapsed(0);
    const id = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return elapsed;
}
