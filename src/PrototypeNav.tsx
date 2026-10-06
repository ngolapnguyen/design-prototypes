export type LabPage = "newsfeed" | "newsfeed-v2" | "decisions" | "rules" | "experiments";

type PrototypeNavProps = {
  page: LabPage;
  onPage: (page: LabPage) => void;
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

export function PrototypeNav({ page, onPage, commenting, noteCount, onCommenting }: PrototypeNavProps) {
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
            { id: "decisions", label: "Design Decisions" },
            { id: "rules", label: "Rules" },
            { id: "experiments", label: "Experiments" },
          ]}
        />
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
