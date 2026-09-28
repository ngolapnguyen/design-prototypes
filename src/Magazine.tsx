import { useEffect, useRef, useState } from "react";
import { magazineLeaves } from "./magazine-assets";
import "./magazine.css";

const FLIP_MS = 820;
const DRAG_THRESHOLD = 48;
const MAX_FLIPPED = magazineLeaves.length - 1;

export function Magazine() {
  const [flipped, setFlipped] = useState(0);
  const [busy, setBusy] = useState(false);
  const [turning, setTurning] = useState<number | null>(null);
  const drag = useRef<{ x: number; active: boolean } | null>(null);
  const flippedRef = useRef(0);
  const busyRef = useRef(false);

  const open = flipped > 0;
  const canPrev = flipped > 0;
  const canNext = flipped < MAX_FLIPPED;

  const go = (dir: 1 | -1) => {
    if (busyRef.current) return;
    const current = flippedRef.current;
    if (dir === 1 && current >= MAX_FLIPPED) return;
    if (dir === -1 && current <= 0) return;
    const next = current + dir;
    busyRef.current = true;
    flippedRef.current = next;
    setBusy(true);
    setTurning(dir === 1 ? current : next);
    setFlipped(next);
    window.setTimeout(() => {
      setTurning(null);
      busyRef.current = false;
      setBusy(false);
    }, FLIP_MS);
  };

  useEffect(() => {
    magazineLeaves.forEach((leaf) => {
      const front = new Image();
      front.src = leaf.front;
      if (leaf.back) {
        const back = new Image();
        back.src = leaf.back;
      }
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        go(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, active: true };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    drag.current = null;
    if (!start?.active) return;
    const delta = event.clientX - start.x;
    if (delta <= -DRAG_THRESHOLD) {
      go(1);
      return;
    }
    if (delta >= DRAG_THRESHOLD) {
      go(-1);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    if (!open || x > bounds.width * 0.5) go(1);
    else go(-1);
  };

  return (
    <div className="magazine">
      <div className="magazine-stage">
        <div
          className={`magazine-book${open ? " is-open" : " is-closed"}`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            drag.current = null;
          }}
          role="region"
          aria-label="Flippable magazine"
        >
          {magazineLeaves.map((leaf, index) => {
            const isFlipped = index < flipped;
            const z = turning === index ? 40 : isFlipped ? index + 1 : magazineLeaves.length - index;
            return (
              <div
                key={leaf.id}
                className={`magazine-leaf${isFlipped ? " is-flipped" : ""}`}
                style={{ zIndex: z }}
              >
                <div className="magazine-face magazine-face-front">
                  <img src={leaf.front} alt={leaf.frontAlt} draggable={false} />
                </div>
                {leaf.back ? (
                  <div className="magazine-face magazine-face-back">
                    <img src={leaf.back} alt={leaf.backAlt} draggable={false} />
                  </div>
                ) : (
                  <div className="magazine-face magazine-face-back magazine-face-blank" />
                )}
              </div>
            );
          })}
          <div className="magazine-gutter" aria-hidden="true" />
        </div>
      </div>

      <div className="magazine-controls">
        <button type="button" className="magazine-nav" onClick={() => go(-1)} disabled={!canPrev || busy}>
          Previous
        </button>
        <p className="magazine-folio">{open ? folioLabel(flipped) : "Cover"}</p>
        <button type="button" className="magazine-nav" onClick={() => go(1)} disabled={!canNext || busy}>
          Next
        </button>
      </div>
    </div>
  );
}

function folioLabel(flipped: number) {
  if (flipped >= MAX_FLIPPED) return "14–15";
  const left = flipped * 2 - 1;
  const right = flipped * 2;
  return `${left}–${right}`;
}
