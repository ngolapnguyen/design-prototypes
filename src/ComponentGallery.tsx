import { useState, type ReactNode } from "react";
import { BubbleTip, IntroModal, LogoTip, PlottingModal, RichTip, type LaunchId, type RichCaret } from "./FeatureIntro";

type TipKind = "bubble" | "bubble-titled" | "logo" | "rich";

function TipDemo({ kind, caret = "right-top" }: { kind: TipKind; caret?: RichCaret }) {
  const [id, setId] = useState<LaunchId>("comments");
  const [run, setRun] = useState(0);
  const restart = () => {
    setId("comments");
    setRun(run + 1);
  };
  const onNext = (next: LaunchId | null) => (next ? setId(next) : restart());
  return (
    <div className={`gallery-stage gallery-tip-stage is-${kind}${kind === "rich" ? ` is-caret-${caret}` : ""}`}>
      <article className="card gallery-target">
        {kind === "rich" ? (
          <RichTip key={`${caret}-${run}`} id={id} caret={caret} onNext={onNext} onSkip={restart} />
        ) : kind === "logo" ? (
          <LogoTip key={run} id={id} onNext={onNext} onSkip={restart} />
        ) : (
          <BubbleTip key={run} id={id} titled={kind === "bubble-titled"} onSkip={restart} />
        )}
        <h3 className="gallery-target-title">Comment Summary</h3>
        <p className="gallery-target-meta">31 comments, last pulled today, 8:00am</p>
        <div className="gallery-target-bar">
          <span style={{ flex: 90 }} />
          <span style={{ flex: 6 }} />
          <span style={{ flex: 3 }} />
        </div>
        <span className="gallery-target-line" />
        <span className="gallery-target-line" />
        <span className="gallery-target-line is-short" />
      </article>
    </div>
  );
}

function ModalDemo({ render }: { render: (onDismiss: () => void) => ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div className="gallery-stage gallery-modal-stage" key={run}>
      {render(() => setRun(run + 1))}
    </div>
  );
}

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="gallery-toggle" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={value === option.id ? "is-active" : ""}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function GallerySection({
  index,
  name,
  note,
  controls,
  children,
}: {
  index: number;
  name: string;
  note: string;
  controls?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="gallery-section">
      <div className="gallery-section-head">
        <span className="gallery-index">{String(index).padStart(2, "0")}</span>
        <div className="gallery-section-copy">
          <h2>{name}</h2>
          <p>{note}</p>
        </div>
        {controls}
      </div>
      {children}
    </section>
  );
}

const CARETS: { id: RichCaret; label: string }[] = [
  { id: "right-top", label: "Right · top" },
  { id: "right-bottom", label: "Right · bottom" },
  { id: "left-top", label: "Left · top" },
  { id: "left-bottom", label: "Left · bottom" },
  { id: "top-left", label: "Top · left" },
  { id: "top-right", label: "Top · right" },
  { id: "bottom-left", label: "Bottom · left" },
  { id: "bottom-right", label: "Bottom · right" },
];

function RichTipSection({ index }: { index: number }) {
  const [caret, setCaret] = useState<RichCaret>("right-top");
  return (
    <GallerySection
      index={index}
      name="Tooltip · image"
      note="Illustrated callout for features that are easier to show than describe. Pick where the caret sits."
    >
      <div className="gallery-toolbar">
        <span className="gallery-toolbar-label">Caret</span>
        <Toggle label="Caret position" value={caret} options={CARETS} onChange={setCaret} />
      </div>
      <TipDemo kind="rich" caret={caret} />
    </GallerySection>
  );
}

const HEADER_FONTS = [
  { id: "sans", label: "Good Sans" },
  { id: "ionica", label: "MF Ionica" },
] as const;

type HeaderFont = (typeof HEADER_FONTS)[number]["id"];

function SingleModalSection({ index }: { index: number }) {
  const [font, setFont] = useState<HeaderFont>("sans");
  return (
    <GallerySection
      index={index}
      name="Modal · 1 feature"
      note="Single-feature announcement. It interrupts, so save it for big launches."
      controls={<Toggle label="Header font" value={font} options={HEADER_FONTS} onChange={setFont} />}
    >
      <ModalDemo
        render={(onDismiss) => <IntroModal emphasis="none" serif={font === "ionica"} onDismiss={onDismiss} />}
      />
    </GallerySection>
  );
}

const CTA_STATES = [
  { when: "Feature you can try, more after it", primary: "Try it", secondary: "Next" },
  { when: "Feature you can try, last in the list", primary: "Try it", secondary: "Done" },
  { when: "Can’t try yet (plan, setup, no data)", primary: "Set up or Learn more", secondary: "Next / Done" },
  { when: "Announcement only, nothing to do", primary: "Next / Done", secondary: "None" },
];

function PlottingRules() {
  return (
    <details className="gallery-rules">
      <summary>Button rules</summary>
      <div className="gallery-rules-body">
        <p className="gallery-rules-lead">
          The primary button belongs to the open feature. The secondary button moves you through the list.
        </p>
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Primary</th>
              <th>Secondary</th>
            </tr>
          </thead>
          <tbody>
            {CTA_STATES.map((row) => (
              <tr key={row.when}>
                <td>{row.when}</td>
                <td>{row.primary}</td>
                <td>{row.secondary}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="gallery-rules-note">
          In the sample below, Plot MCP needs setup, Comment Labels has release notes, and Comment Summary is the
          last item, so it ends with Done.
        </p>
        <h4>Rules</h4>
        <ul>
          <li>
            Exactly one primary button at a time. If the feature has no action, Next or Done becomes the filled button.
          </li>
          <li>Never show a disabled “Try it”. Swap in the best action that works, like “Set up” or “Learn more”.</li>
          <li>
            Release notes are an inline link under the description, only for features that have them. They never take a
            button slot.
          </li>
          <li>The × closes the whole thing. No “Skip all”.</li>
          <li>“Try it”, not “Try now” or “Try [feature name]”, so button widths stay steady across rows.</li>
        </ul>
        <h4>For engineering</h4>
        <ul>
          <li>
            Each feature: <code>name</code>, <code>body</code>, <code>media</code>, optional{" "}
            <code>action: {"{ kind: try | setup | learn, label, href }"}</code>, optional <code>notesHref</code>.
          </li>
          <li>
            Primary is picked in order: Try if the user can use it now, then Set up, then Learn more, then Next / Done.
          </li>
          <li>Taking the primary action leaves the modal and marks the whole batch as seen.</li>
          <li>Keep a “What’s new” entry point so people can reopen it later.</li>
        </ul>
      </div>
    </details>
  );
}

function PlottingSection({ index }: { index: number }) {
  const [font, setFont] = useState<HeaderFont>("sans");
  return (
    <GallerySection
      index={index}
      name="What’s new · Plotting"
      note="Roundup of several launches at once. Toggle the header font to compare."
      controls={<Toggle label="Header font" value={font} options={HEADER_FONTS} onChange={setFont} />}
    >
      <PlottingRules />
      <ModalDemo
        render={(onDismiss) => <PlottingModal emphasis="none" serif={font === "ionica"} onDismiss={onDismiss} />}
      />
    </GallerySection>
  );
}

export function ComponentGallery() {
  return (
    <main className="gallery">
      <header className="gallery-head">
        <h1>Feature intro components</h1>
        <p>Every option side by side. Buttons work; closing or finishing restarts the demo.</p>
      </header>
      <GallerySection
        index={1}
        name="Tooltip · maroon"
        note="One-line callout pinned to the feature. The lightest touch."
      >
        <TipDemo kind="bubble" />
      </GallerySection>
      <GallerySection
        index={2}
        name="Tooltip · maroon + title"
        note="Same callout with a headline and a supporting line."
      >
        <TipDemo kind="bubble-titled" />
      </GallerySection>
      <GallerySection
        index={3}
        name="Tooltip · white + logo"
        note="Quiet branded callout with a headline, a supporting line, and a clear way to say yes or later."
      >
        <TipDemo kind="logo" />
      </GallerySection>
      <RichTipSection index={4} />
      <SingleModalSection index={5} />
      <PlottingSection index={6} />
    </main>
  );
}
