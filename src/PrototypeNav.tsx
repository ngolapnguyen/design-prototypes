export type LabPage = "newsfeed" | "decisions" | "rules" | "experiments";

type PrototypeNavProps = {
  page: LabPage;
  onPage: (page: LabPage) => void;
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

export function PrototypeNav({ page, onPage }: PrototypeNavProps) {
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
            { id: "decisions", label: "Design Decisions" },
            { id: "rules", label: "Rules" },
            { id: "experiments", label: "Experiments" },          ]}
        />
      </div>
    </header>
  );
}
