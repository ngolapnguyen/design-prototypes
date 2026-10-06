import { useEffect, useRef, useState, type MouseEvent } from "react";

type Kind = "pro" | "con" | "note";

type Annotation = {
  id: string;
  x: number;
  y: number;
  kind: Kind;
  text: string;
};

const STORAGE_KEY = "homepage-annotations";

const KINDS: { id: Kind; label: string; placeholder: string }[] = [
  { id: "pro", label: "Pro", placeholder: "What’s working" },
  { id: "con", label: "Con", placeholder: "What’s off" },
  { id: "note", label: "Note", placeholder: "A note on this spot" },
];

function readAnnotations(): Annotation[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Annotation[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.text === "string" && item.text.trim());
  } catch {
    return [];
  }
}

export function Annotations({ active }: { active: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const [notes, setNotes] = useState<Annotation[]>(readAnnotations);
  const [openId, setOpenId] = useState<string | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.filter((note) => note.text.trim())));
    window.dispatchEvent(new Event("homepage-annotations"));
  }, [notes]);

  useEffect(() => {
    const root = layerRef.current?.parentElement;
    if (!root) return;
    const measure = () => setHeight(root.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    const main = root.querySelector(".nf-main");
    if (main) observer.observe(main);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    fieldRef.current?.focus();
  }, [openId]);

  useEffect(() => {
    if (active) return;
    setNotes((current) => current.filter((note) => note.text.trim()));
    setOpenId(null);
  }, [active]);

  const update = (id: string, patch: Partial<Annotation>) => {
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, ...patch } : note)));
  };

  const place = (event: MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    if ((event.target as HTMLElement).closest(".anno-spot")) return;
    const root = event.currentTarget.parentElement;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top + root.scrollTop) / root.scrollHeight;
    const id = crypto.randomUUID();
    setNotes((current) => [
      ...current.filter((note) => note.text.trim()),
      { id, x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1), kind: "note", text: "" },
    ]);
    setOpenId(id);
  };

  const open = notes.find((note) => note.id === openId);

  return (
    <div
      ref={layerRef}
      className="anno-layer"
      style={{ height }}
      onClick={place}
    >
      {notes.map((note, index) => {
        const kind = KINDS.find((item) => item.id === note.kind) ?? KINDS[2];
        const opened = note.id === openId;
        return (
          <div
            key={note.id}
            className={`anno-spot${note.x > 0.62 ? " is-flip" : ""}${note.y > 0.72 ? " is-up" : ""}`}
            style={{ left: `${note.x * 100}%`, top: `${note.y * 100}%` }}
          >
            <button
              type="button"
              className={`anno-pin is-${note.kind}${opened ? " is-open" : ""}`}
              aria-label={`${kind.label} ${index + 1}`}
              aria-expanded={opened}
              onClick={(event) => {
                event.stopPropagation();
                setOpenId(opened ? null : note.id);
              }}
            >
              {index + 1}
            </button>
            {opened && open ? (
              <div className="anno-pop" onClick={(event) => event.stopPropagation()}>
                <div className="anno-kinds" role="group" aria-label="Note type">
                  {KINDS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={note.kind === item.id ? `is-on is-${item.id}` : ""}
                      aria-pressed={note.kind === item.id}
                      onClick={() => update(note.id, { kind: item.id })}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <textarea
                  ref={fieldRef}
                  value={note.text}
                  placeholder={kind.placeholder}
                  aria-label={kind.label}
                  onChange={(event) => update(note.id, { text: event.target.value })}
                />
                <div className="anno-pop-foot">
                  <button
                    type="button"
                    className="anno-remove"
                    onClick={() => {
                      setNotes((current) => current.filter((item) => item.id !== note.id));
                      setOpenId(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
