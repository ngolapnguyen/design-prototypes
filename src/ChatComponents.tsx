import { useEffect, useState } from "react";
import {
  AssistantBubble,
  ChatChrome,
  ChatIcon,
  Composer,
  DraftPanel,
  IntercomFab,
  ChatLink,
  Chip,
  ChoiceCard,
  FollowUpQ,
  RecommendActions,
  StatusLine,
  UserBubble,
  deriveDraft,
} from "./chat-ui";
import { chatAssets } from "./chat-assets";
import "./chat.css";

const FOLLOW_Q = {
  question: "How wide should I look?",
  options: ["Just our handles", "Our handles + people tagging us", "The category, not only us"],
};

const RECOMMEND_ACTIONS = ["Create a topic", "Point me at a source", "Keep going with what we have"];

const STATUS_ACTIONS = [
  "Reading your brief",
  "Breaking it into search criteria",
  "Filling gaps we can actually search on",
  "Searching creators",
  "Checking them against your must-haves",
];

export function ChatComponents() {
  const [heroDraft, setHeroDraft] = useState("");
  const [dockDraft, setDockDraft] = useState("");
  const [sentNote, setSentNote] = useState("");
  const [statusIndex, setStatusIndex] = useState(0);
  const [choiceOn, setChoiceOn] = useState(false);
  const [linkDraft, setLinkDraft] = useState("");
  const [actionPick, setActionPick] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [actionSent, setActionSent] = useState(false);
  const [dockPick, setDockPick] = useState<string | null>(null);
  const [dockNote, setDockNote] = useState("");
  const [barePick, setBarePick] = useState<string | null>(null);
  const [draftEditQuotes, setDraftEditQuotes] = useState<string[]>([]);
  const [draftEditNote, setDraftEditNote] = useState("");

  const editDraftChip = (label: string) => {
    setDraftEditQuotes((current) => (current.includes(label) ? current : [...current, label]));
    setDraftEditNote("What do you want to change?");
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatusIndex((value) => (value + 1) % STATUS_ACTIONS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="chat-lab is-catalog">
      <div className="chat-catalog">
        <header className="chat-catalog-intro">
          <p>Chat design system</p>
          <h1>Components</h1>
          <p>Shared pieces used across Plot chat use-cases. Try them here before dropping them into a flow.</p>
        </header>

        <section className="chat-spec">
          <h2>Chrome</h2>
          <div className="chat-spec-canvas">
            <ChatChrome onBack={() => setSentNote("Back")} onClose={() => setSentNote("Close")} />
          </div>
        </section>

        <section className="chat-spec">
          <h2>Composer — hero</h2>
          <div className="chat-spec-canvas">
            <Composer
              autoFocus
              value={heroDraft}
              onChange={setHeroDraft}
              onSubmit={() => {
                setSentNote(heroDraft);
                setHeroDraft("");
              }}
              placeholder="Describe the creators you want…"
            />
            {sentNote ? <p className="chat-spec-note">Last action: {sentNote}</p> : null}
          </div>
        </section>

        <section className="chat-spec">
          <h2>Composer — docked</h2>
          <div className="chat-spec-canvas">
            <Composer
              docked
              value={dockDraft}
              onChange={setDockDraft}
              onSubmit={() => setDockDraft("")}
              placeholder="Ask a follow-up…"
            />
          </div>
        </section>

        <section className="chat-spec">
          <h2>User bubble</h2>
          <div className="chat-spec-canvas">
            <UserBubble text="Find me NYC creators who are fashion forward, make day in the life videos with 2-5k followers" />
          </div>
        </section>

        <section className="chat-spec">
          <h2>Assistant reply</h2>
          <div className="chat-spec-canvas">
            <AssistantBubble text="I found creators who match that brief. Want me to tighten location, follower range, or topics?" />
          </div>
        </section>

        <section className="chat-spec">
          <h2>Recommended actions</h2>
          <div className="chat-spec-canvas">
            <div className="recommend-thread">
              <UserBubble text="How are we showing up against Glossier this month?" />
              <AssistantBubble text="I don’t have enough data on this yet. I can create a topic first so we have something to watch." />
              <RecommendActions
                actions={RECOMMEND_ACTIONS}
                recommended={RECOMMEND_ACTIONS[0]}
                selected={actionPick}
                onSelect={(value) => {
                  setActionPick(value);
                  setActionNote("");
                  setActionSent(false);
                }}
              />
              {actionPick === "Create a topic" ? <StatusLine label="Creating a topic" where="Topics" /> : null}
              {actionPick === "Keep going with what we have" ? (
                <StatusLine label="Continuing with what we have" where="this search" />
              ) : null}
              {actionPick === "Point me at a source" && !actionSent ? (
                <Composer
                  autoFocus
                  value={actionNote}
                  onChange={setActionNote}
                  placeholder="Paste a source or tell me where to look…"
                  onSubmit={() => {
                    setActionSent(true);
                    setActionNote("");
                  }}
                />
              ) : null}
              {actionPick === "Point me at a source" && actionSent ? (
                <StatusLine label="Reading that source" where="this thread" />
              ) : null}
            </div>
          </div>
        </section>

        <section className="chat-spec">
          <h2>Follow-up question</h2>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas is-wide">
              <figcaption>On the composer</figcaption>
              <div className="follow-q-dock">
                <FollowUpQ
                  className="is-bare"
                  pager={false}
                  question={FOLLOW_Q.question}
                  options={FOLLOW_Q.options}
                  selected={dockPick}
                  onSelect={setDockPick}
                />
                <Composer
                  value={dockNote}
                  onChange={setDockNote}
                  onSubmit={() => {
                    setDockNote("");
                    setDockPick(null);
                  }}
                  placeholder="Ask a question, create a topic, build a report, or source creators..."
                />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Bare in the thread</figcaption>
              <div className="follow-q-stack">
                <AssistantBubble text="I can look, but I need one call from you first." />
                <FollowUpQ
                  className="is-bare"
                  pager={false}
                  question={FOLLOW_Q.question}
                  options={FOLLOW_Q.options}
                  selected={barePick}
                  skip
                  onSelect={setBarePick}
                />
              </div>
            </figure>
          </div>
        </section>

        <section className="chat-spec">
          <h2>Status line</h2>
          <div className="chat-spec-canvas">
            <StatusLine label={STATUS_ACTIONS[statusIndex]} />
          </div>
        </section>

        <section className="chat-spec">
          <h2>Link</h2>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas is-wide">
              <figcaption>In the thread</figcaption>
              <div className="chat-link-demo">
                <UserBubble text="What does the Adobe snapshot say about us this month?" />
                <ChatLink title="Adobe Social Listening Snapshot" meta="index.html" />
                <AssistantBubble text="Here’s the breakdown from that snapshot." />
              </div>
            </figure>
            <figure className="chat-spec-canvas is-wide">
              <figcaption>In the composer</figcaption>
              <Composer
                value={linkDraft}
                onChange={setLinkDraft}
                onSubmit={() => setLinkDraft("")}
                placeholder="Ask a follow-up…"
              >
                <ChatLink compact title="Adobe Social Listening Snapshot" meta="File" />
              </Composer>
            </figure>
          </div>
        </section>

        <section className="chat-spec">
          <h2>Choice card</h2>
          <div className="chat-spec-canvas">
            <ChoiceCard
              title="Brand mentions"
              detail="Any time Plot is tagged or mentioned."
              selected={choiceOn}
              onSelect={() => setChoiceOn((value) => !value)}
            />
          </div>
        </section>

        <section className="chat-spec">
          <h2>Draft panel</h2>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas">
              <figcaption>Empty — waiting</figcaption>
              <div className="chat-draft-preview">
                <DraftPanel fillLevel={0} />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Filled</figcaption>
              <div className="chat-draft-preview">
                <DraftPanel
                  fillLevel={3}
                  draft={deriveDraft(
                    "Find me NYC creators who are fashion forward, make day in the life videos with 2-5k followers",
                  )}
                  onEditChip={editDraftChip}
                />
                <Composer
                  value={draftEditNote}
                  quotes={draftEditQuotes}
                  placeholder="Ask a follow-up…"
                  onChange={setDraftEditNote}
                  onClearQuote={(quote) => {
                    setDraftEditQuotes((current) => current.filter((item) => item !== quote));
                  }}
                  onSubmit={() => {
                    setDraftEditNote("");
                    setDraftEditQuotes([]);
                  }}
                />
              </div>
            </figure>
            <figure className="chat-spec-canvas chat-draft-preview">
              <figcaption>Headings + pills</figcaption>
              <DraftPanel
                kicker="New Notification"
                title="Brand Mentions"
                summary="We'll deliver matching posts to your channels."
                blocks={[
                  { title: "Notify about", chips: [{ label: "Brand mentions" }] },
                  {
                    title: "Triggers",
                    chips: [{ label: "Neutral sentiment" }, { label: "Negative sentiment" }],
                  },
                  { title: "Frequency", chips: [{ label: "As it happens" }] },
                  { title: "Deliver to", chips: [{ label: "Slack", variant: "edit" }] },
                ]}
                onEditChip={editDraftChip}
              />
            </figure>
          </div>
        </section>

        <section className="chat-spec">
          <h2>Editable pills</h2>
          <div className="chat-spec-canvas">
            <div className="chat-chips">
              <Chip label="#nycfashion" variant="edit" onEdit={() => undefined} />
              <Chip label="Instagram" variant="edit" onEdit={() => undefined} />
              <Chip label="2-5k" variant="edit" onEdit={() => undefined} />
            </div>
          </div>
        </section>

        <section className="chat-spec">
          <h2>Send</h2>
          <div className="chat-spec-canvas is-row">
            <button className="chat-send" type="button" aria-label="Send active">
              <ChatIcon src={chatAssets.send} size={36} />
            </button>
            <button className="chat-send" type="button" disabled aria-label="Send disabled">
              <ChatIcon src={chatAssets.sendDisabled} size={36} />
            </button>
          </div>
        </section>

        <section className="chat-spec">
          <h2>Messenger</h2>
          <div className="chat-spec-canvas is-fab">
            <IntercomFab />
          </div>
        </section>
      </div>
    </div>
  );
}
