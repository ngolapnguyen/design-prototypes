import { useEffect, useRef } from "react";
import type { IntroEmphasis, IntroVariant } from "./FeatureIntro";
export type ProtoView = "prototype" | "components";

type PrototypeNavProps = {
  view: ProtoView;
  onView: (view: ProtoView) => void;
  intro: IntroVariant;
  onIntro: (variant: IntroVariant) => void;
  onReplay: () => void;
  emphasis: IntroEmphasis;
  onEmphasis: (value: IntroEmphasis) => void;
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

export function PrototypeNav({ view, onView, intro, onIntro, onReplay, emphasis, onEmphasis }: PrototypeNavProps) {
  const showIntro = view === "prototype";

  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--proto-bar-h", `${el.offsetHeight}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={bar} className="proto-bar">
      <p className="proto-kicker">Prototype</p>
      <Segment
        label="View"
        value={view}
        onChange={onView}
        options={[
          { id: "prototype", label: "Prototype" },
          { id: "components", label: "Components" },
        ]}
      />
      {showIntro ? (
        <Segment
          label="Intro"
          value={intro}
          onChange={onIntro}
          options={[
            { id: "spotlight", label: "Tooltip" },
            { id: "bubble", label: "Tooltip · maroon" },
            { id: "bubble-titled", label: "Tooltip · maroon + title" },
            { id: "confirm", label: "Confirm · white + logo" },
            { id: "rich", label: "Tooltip · image" },
            { id: "rich-stacked", label: "Tooltip · title + image" },
            { id: "corner", label: "Tooltip · corner" },
            { id: "modal", label: "Modal · 1 feature" },
            { id: "plotting", label: "What’s new · Plotting" },
            { id: "plotting-serif", label: "What’s new · Plotting serif" },
            { id: "off", label: "Off" },
          ]}
        />
      ) : null}
      {showIntro && intro !== "off" && intro !== "confirm" ? (
        <Segment
          label="Emphasis"
          value={emphasis}
          onChange={onEmphasis}
          options={[
            { id: "dim", label: "Dim" },
            { id: "veil", label: "Light veil" },
            { id: "blur", label: "Blur" },
            { id: "ring", label: "Ring" },
            { id: "glow", label: "Glow" },
            { id: "none", label: "None" },
          ]}
        />
      ) : null}
      {showIntro && intro !== "off" ? (
        <button className="proto-replay" type="button" onClick={onReplay}>
          Replay
        </button>
      ) : null}
    </header>
  );
}
