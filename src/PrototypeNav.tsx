export type LabPage = "newsfeed" | "newsfeed-v2" | "decisions" | "rules" | "experiments";
export type StoryLayout = "side" | "bottom" | "modal";

type PrototypeNavProps = {
  page: LabPage;
  onPage: (page: LabPage) => void;
  storyLayout?: StoryLayout;
  onStoryLayout?: (layout: StoryLayout) => void;
  commenting: boolean;
  noteCount: number;
  onCommenting: (commenting: boolean) => void;
};

function Segment<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="proto-group">
      <p className="proto-label">{label}</p>
      <div className="proto-seg" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            className={value === option.id ? "is-active" : ""}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CommentMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M2 2.5h10v7.2H7.2L4.2 12.2V9.7H2V2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PrototypeNav({
  page,
  onPage,
  storyLayout,
  onStoryLayout,
  commenting,
  noteCount,
  onCommenting,
}: PrototypeNavProps) {
  return (
    <header className="proto-bar">
      <p className="proto-kicker">Prototype</p>
      <div className="proto-row">
        <Segment
          label="Page"
          value={page}
          onChange={onPage}
          options={[
            { id: "newsfeed", label: "Newsfeed" },
            { id: "newsfeed-v2", label: "Newsfeed v2" },
            { id: "rules", label: "Rules" },
          ]}
        />
        {storyLayout && onStoryLayout ? (
          <Segment
            label="Story chat"
            value={storyLayout}
            onChange={onStoryLayout}
            options={[
              { id: "side", label: "Chat on side" },
              { id: "bottom", label: "Ask a follow-up" },
              { id: "modal", label: "Modal" },
            ]}
          />
        ) : null}
        <button
          type="button"
          className={commenting ? "proto-comment is-on" : "proto-comment"}
          aria-pressed={commenting}
          onClick={() => onCommenting(!commenting)}
        >
          <CommentMark />
          {noteCount > 0 ? `Comment ${noteCount}` : "Comment"}
        </button>
        {commenting ? <p className="proto-comment-hint">Click the page to drop a pin</p> : null}
      </div>
    </header>
  );
}
