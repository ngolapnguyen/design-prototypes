import { useState } from "react";
import "./chat.css";
import "./rules.css";
import "./page-style.css";
import { EMPTY_FEEDBACK, ThemeDownReasons, ThemeFeedbackCard, type ThemeFeedbackValue } from "./Newsfeed";
import { GRID_THEMES, Votes } from "./ThemeGrid";

export function Experiments() {
  const theme = GRID_THEMES[0];
  const [feedback, setFeedback] = useState<ThemeFeedbackValue>(EMPTY_FEEDBACK);
  const update = (patch: Partial<ThemeFeedbackValue>) => setFeedback((current) => ({ ...current, ...patch }));
  const vote = feedback.fit === "Spot on" ? "up" : feedback.fit === "Not for us" ? "down" : null;

  const onVote = (next: "up" | "down") => {
    const value = vote === next ? null : next;
    update({
      fit: value === "up" ? "Spot on" : value === "down" ? "Not for us" : null,
      fromThumb: value !== null,
      saved: false,
    });
  };

  return (
    <div className="chat-lab is-catalog rules-page">
      <div className="chat-catalog">
        <header className="chat-catalog-intro">
          <p>Theme page</p>
          <h1>Experiments</h1>
          <p>Ideas we’ve taken off the page for now, kept here so they still work and can be picked back up.</p>
        </header>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Parked Sep 29</p>
              <h2>Detailed theme feedback</h2>
            </div>
          </header>
          <p className="chat-explore-note">
            A “How’s this theme?” card that sat next to Top creators, synced with the thumbs in the right rail. It
            duplicated the thumbs on the theme page, so the page keeps only the thumbs. Try both controls below; they
            share one answer.
          </p>
          <div className="exp-feedback">
            <div className="ps-rail exp-rail">
              <div className="ps-cta">
                <span className="exp-rail-label">Right rail</span>
                <Votes vote={vote} onVote={onVote} />
              </div>
              {vote === "down" && !feedback.saved ? (
                <ThemeDownReasons value={feedback} onChange={update} onSave={() => update({ saved: true })} />
              ) : null}
            </div>
            <div className="ps-insights exp-card">
              <ThemeFeedbackCard theme={theme} value={feedback} onChange={update} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
