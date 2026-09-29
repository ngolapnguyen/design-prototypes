import { useState } from "react";

const file = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;
const caret = file("icon-caret.svg");

export const TIME_OPTIONS = [
  "All time",
  "Last 48 hours",
  "Last 7 days",
  "Last 14 days",
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "Last 12 months",
  "This year",
  "Custom range",
] as const;

export const SORT_OPTIONS = [
  "Recency",
  "Views",
  "Likes",
  "Comments",
  "Engagement rate",
  "Total engagement",
  "Shares",
  "Follower count",
] as const;

type FilterGroup = {
  id: string;
  label: string;
  options: string[];
  sub?: { parent: string; label: string; options: string[] };
};

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "platform",
    label: "Platform",
    options: ["Instagram", "TikTok", "YouTube Shorts"],
    sub: {
      parent: "Instagram",
      label: "Post type",
      options: ["Reels", "Photos", "Carousel", "Stories"],
    },
  },
  {
    id: "followers",
    label: "Followers",
    options: ["Under 10K", "10K–100K", "100K–1M", "Over 1M"],
  },
  {
    id: "sentiment",
    label: "Sentiment",
    options: ["Positive", "Neutral", "Negative"],
  },
  {
    id: "relevancy",
    label: "Topic relevancy",
    options: ["High", "Medium", "Low"],
  },
  { id: "organic", label: "Organic/Paid", options: ["Organic", "Paid"] },
  {
    id: "language",
    label: "Language",
    options: ["English", "Spanish", "French", "Portuguese"],
  },
  {
    id: "country",
    label: "Country",
    options: ["United States", "Canada", "United Kingdom", "Australia"],
  },
];

export const DEFAULT_FILTERS = [
  "Instagram",
  "Reels",
  "Stories",
  "TikTok",
  "YouTube Shorts",
];

export function Menu<T extends string>({
  label,
  className,
  variant,
  options,
  value,
  onPick,
}: {
  label: string;
  className: string;
  variant: "radio" | "check";
  options: readonly T[];
  value: T;
  onPick: (value: T) => void;
}) {
  return (
    <div className={`nf-menu ${className}`} role="menu" aria-label={label}>
      {options.map((option) => {
        const on = value === option;
        return (
          <button
            key={option}
            type="button"
            role="menuitemradio"
            aria-checked={on}
            className={on ? "nf-menu-item is-on" : "nf-menu-item"}
            onClick={() => onPick(option)}
          >
            {variant === "radio" ? <span className={on ? "nf-radio is-on" : "nf-radio"} aria-hidden="true" /> : null}
            <span className="nf-menu-label">{option}</span>
            {option === "Custom range" ? <img src={caret} alt="" width={14} height={14} /> : null}
            {variant === "check" && on ? <CheckMark /> : null}
          </button>
        );
      })}
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

export function FiltersMenu({
  groups = FILTER_GROUPS,
  selected,
  onChange,
}: {
  groups?: FilterGroup[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState<string[]>([groups[0]?.id, groups[1]?.id].filter(Boolean) as string[]);
  const toggle = (label: string) =>
    onChange(selected.includes(label) ? selected.filter((item) => item !== label) : [...selected, label]);

  return (
    <div className="nf-menu is-filters" role="dialog" aria-label="Posts filters">
      {groups.map((group) => {
        const expanded = open.includes(group.id);
        const count = group.options.concat(group.sub?.options ?? []).filter((item) => selected.includes(item)).length;
        return (
          <div key={group.id} className="nf-filter-group">
            <button
              type="button"
              className="nf-filter-head"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? open.filter((id) => id !== group.id) : [...open, group.id])}
            >
              <span>{group.label}</span>
              {count ? <span className="nf-control-count">{count}</span> : null}
              <img
                className={expanded ? "nf-filter-caret is-open" : "nf-filter-caret"}
                src={caret}
                alt=""
                width={14}
                height={14}
              />
            </button>
            {expanded ? (
              <div className="nf-filter-options">
                {group.options.map((option) => (
                  <div key={option}>
                    <FilterCheck label={option} on={selected.includes(option)} onToggle={() => toggle(option)} />
                    {group.sub && group.sub.parent === option && selected.includes(option) ? (
                      <div className="nf-filter-sub">
                        <p>{group.sub.label}</p>
                        {group.sub.options.map((subOption) => (
                          <FilterCheck
                            key={subOption}
                            label={subOption}
                            on={selected.includes(subOption)}
                            onToggle={() => toggle(subOption)}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="nf-filter-foot">
        <button type="button" className="nf-btn is-sm" onClick={() => onChange([])}>
          Clear all
        </button>
      </div>
    </div>
  );
}

function FilterCheck({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <label className="nf-filter-check">
      <input type="checkbox" checked={on} onChange={onToggle} />
      <span className="nf-checkbox" aria-hidden="true">
        {on ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5.2l2 2 4-4.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      {label}
    </label>
  );
}
