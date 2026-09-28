import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AssistantBubble, ChatIcon, Chip, Composer, FollowUpQ, ProcessCard, RecommendActions, StatusLine, UserBubble } from "./chat-ui";
import { chatAssets } from "./chat-assets";
import "./chat.css";

const RECOMMEND_ACTIONS = ["Create a topic", "Point me at a source", "Keep going with what we have"];

const FOLLOW_QS = [
  {
    question: "How wide should I look?",
    options: ["Just our handles", "Our handles + people tagging us", "The category, not only us"],
  },
  {
    question: "How far back?",
    options: ["Last 7 days", "Last 30 days", "This quarter"],
  },
  {
    question: "What should I count as about us?",
    options: ["Named mentions only", "Mentions + obvious subtweets", "The whole conversation"],
  },
];

const LAYOUT_Q = {
  question: "How central should fashion be to their content?",
  options: [
    "Lifestyle & daily vlogs with stylish aesthetic",
    "Dedicated fashion & outfit creators",
    "Either is fine",
  ],
};

const HIGHLIGHT_SUMMARY =
  "Across last 7 days, I looked at posts that name us or sit next to our owned handles. Most of the volume is on Instagram and TikTok.";

function HighlightCopy({ text, quotes }: { text: string; quotes: string[] }) {
  const ranges = quotes
    .map((quote) => {
      const start = text.toLowerCase().indexOf(quote.toLowerCase());
      return start < 0 ? null : { start, end: start + quote.length };
    })
    .filter((range): range is { start: number; end: number } => Boolean(range))
    .sort((a, b) => a.start - b.start)
    .reduce<{ start: number; end: number }[]>((kept, range) => {
      const last = kept[kept.length - 1];
      if (last && range.start < last.end) return kept;
      return [...kept, range];
    }, []);

  if (!ranges.length) return <p>{text}</p>;

  const nodes: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (range.start > cursor) nodes.push(text.slice(cursor, range.start));
    nodes.push(
      <mark className="follow-mark" key={`${range.start}-${range.end}`}>
        {text.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <p>{nodes}</p>;
}

const CHART_KPIS = [
  { label: "Mentions", value: "4.2k", delta: "+12%", up: true },
  { label: "EMV", value: "$186k", delta: "+8%", up: true },
  { label: "Sentiment", value: "64%", delta: "+3", up: true },
  { label: "Share of voice", value: "28%", delta: "−2", up: false },
];

const CHART_COMPARE = [
  { label: "Plot", value: 42, tone: "" },
  { label: "Glossier", value: 31, tone: "is-2" },
  { label: "Rhode", value: 18, tone: "is-3" },
  { label: "Summer Fridays", value: 9, tone: "is-4" },
];

const CHART_MIX = [
  { label: "Instagram", value: 48, color: "#800532" },
  { label: "TikTok", value: 31, color: "#c48a9a" },
  { label: "X", value: 12, color: "#d8c4c8" },
  { label: "YouTube", value: 9, color: "#eadde0" },
];

const CHART_TREND = [18, 22, 19, 28, 26, 34, 41];
const CHART_WEEK = [22, 28, 18, 36, 44, 31, 40];

function ChartKpis() {
  return (
    <div className="chat-chart is-kpis">
      {CHART_KPIS.map((kpi) => (
        <div className="chat-chart-kpi" key={kpi.label}>
          <em>{kpi.label}</em>
          <strong>{kpi.value}</strong>
          <span className={kpi.up ? "is-up" : "is-down"}>{kpi.delta}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCompare() {
  return (
    <div className="chat-chart">
      <div className="chat-chart-head">
        <strong>Share of conversation</strong>
        <span>Last 7 days</span>
      </div>
      <div className="chat-chart-rows">
        {CHART_COMPARE.map((row) => (
          <div className="chat-chart-row" key={row.label}>
            <b>{row.label}</b>
            <div className="chat-chart-track">
              <i className={row.tone} style={{ width: `${row.value * 2}%` }} />
            </div>
            <span>{row.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartTrend() {
  const grainId = useId().replace(/:/g, "");
  const width = 320;
  const height = 92;
  const pad = 6;
  const min = Math.min(...CHART_TREND);
  const max = Math.max(...CHART_TREND);
  const points = CHART_TREND.map((value, index) => {
    const x = pad + (index * (width - pad * 2)) / (CHART_TREND.length - 1);
    const y = height - pad - ((value - min) / (max - min)) * (height - pad * 2);
    return `${x},${y}`;
  });
  const area = `M${pad},${height - pad} L${points.join(" L")} L${width - pad},${height - pad} Z`;

  return (
    <div className="chat-chart">
      <div className="chat-chart-head">
        <strong>Mentions over the week</strong>
        <span>Mon–Sun</span>
      </div>
      <div className="chat-chart-line">
        <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <defs>
            <clipPath id={`${grainId}-clip`}>
              <path d={area} />
            </clipPath>
            <filter id={`${grainId}-dither`} x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.92"
                numOctaves="3"
                seed="7"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="luminanceToAlpha"
                result="alpha"
              />
              <feComponentTransfer in="alpha" result="bits">
                <feFuncA type="discrete" tableValues="0 0 0 0 0.15 0.35 0.7 1" />
              </feComponentTransfer>
              <feFlood floodColor="#800532" result="ink" />
              <feComposite in="ink" in2="bits" operator="in" result="dots" />
            </filter>
          </defs>
          <path d={area} fill="#f7eef1" />
          <rect
            width={width}
            height={height}
            clipPath={`url(#${grainId}-clip)`}
            filter={`url(#${grainId}-dither)`}
            opacity="0.28"
          />
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#800532"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function ChartMix() {
  return (
    <div className="chat-chart">
      <div className="chat-chart-head">
        <strong>Where it happened</strong>
        <span>By platform</span>
      </div>
      <div className="chat-chart-mix">
        <div className="chat-chart-stack">
          {CHART_MIX.map((item) => (
            <i key={item.label} style={{ width: `${item.value}%`, background: item.color }} />
          ))}
        </div>
        <div className="chat-chart-legend">
          {CHART_MIX.map((item) => (
            <p key={item.label}>
              <i style={{ background: item.color }} />
              {item.label}
              <span>{item.value}%</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartBoard() {
  return (
    <div className="chat-chart is-board">
      <div className="chat-chart-head">
        <strong>Adobe snapshot</strong>
        <span>Last 7 days</span>
      </div>
      <div className="chat-chart-board">
        <div className="chat-chart-pane">
          <em>Mentions</em>
          <strong>4.2k</strong>
          <div className="chat-chart-spark" aria-hidden="true">
            {CHART_WEEK.map((value, index) => (
              <i
                key={`${value}-${index}`}
                className={index === CHART_WEEK.length - 1 ? "is-on" : undefined}
                style={{ height: `${value * 1.2}%` }}
              />
            ))}
          </div>
        </div>
        <div className="chat-chart-pane">
          <em>Vs last week</em>
          <ul className="chat-chart-list">
            <li>
              Volume <span>+12%</span>
            </li>
            <li>
              Positive <span>64%</span>
            </li>
            <li>
              Neutral <span>27%</span>
            </li>
            <li>
              Negative <span>9%</span>
            </li>
          </ul>
        </div>
        <div className="chat-chart-pane">
          <em>Share of voice</em>
          <div className="chat-chart-rows" style={{ padding: 0 }}>
            {CHART_COMPARE.slice(0, 3).map((row) => (
              <div className="chat-chart-row" key={row.label}>
                <b>{row.label}</b>
                <div className="chat-chart-track">
                  <i className={row.tone} style={{ width: `${row.value * 2}%` }} />
                </div>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-chart-pane">
          <em>Top posts</em>
          <ul className="chat-chart-list">
            <li>
              Reel recap <span>18.4k</span>
            </li>
            <li>
              Store drop <span>11.2k</span>
            </li>
            <li>
              Creator stitch <span>9.6k</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const mid = [
  { label: "Reading your prompt", done: true },
  { label: "Matching creator criteria", done: false },
  { label: "Preparing results", done: false },
];

export function ChatExplorations() {
  const [steps, setSteps] = useState([
    { label: "Reading your prompt", done: false },
    { label: "Matching creator criteria", done: false },
    { label: "Preparing results", done: false },
  ]);
  const [dismiss, setDismiss] = useState(["#nycfashion", "#nycvlog", "Instagram", "2-5k"]);
  const [platform, setPlatform] = useState("Instagram");
  const [size, setSize] = useState("2-5k");
  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState(["#nycfashion", "#nycvlog"]);
  const [draftItem, setDraftItem] = useState("");
  const [cardPick, setCardPick] = useState<string | null>(null);
  const [cardStep, setCardStep] = useState(1);
  const [attachPick, setAttachPick] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [writeText, setWriteText] = useState("");
  const [writePick, setWritePick] = useState<string | null>(null);
  const [advanceStep, setAdvanceStep] = useState(0);
  const [advancePicks, setAdvancePicks] = useState<string[]>([]);
  const [sheetPick, setSheetPick] = useState("Just our handles");
  const [sheetNote, setSheetNote] = useState("");
  const [stackPicks, setStackPicks] = useState<(string | null)[]>([null, null, null]);
  const [highlightQuotes, setHighlightQuotes] = useState<string[]>([]);
  const [highlightNote, setHighlightNote] = useState("");
  const [suggestPick, setSuggestPick] = useState<string | null>(null);
  const [researchStep, setResearchStep] = useState(0);
  const [researchPick, setResearchPick] = useState<string | null>(null);
  const [researchNote, setResearchNote] = useState("");
  const [researchMode, setResearchMode] = useState<"chat" | "research">("research");
  const [researchOpen, setResearchOpen] = useState(false);
  const [layoutChip, setLayoutChip] = useState<string | null>(null);
  const [layoutNumber, setLayoutNumber] = useState("Dedicated fashion & outfit creators");
  const [layoutCheck, setLayoutCheck] = useState("Dedicated fashion & outfit creators");
  const [layoutStep, setLayoutStep] = useState(1);
  const highlightCopy = useRef<HTMLDivElement>(null);
  const highlightArmed = useRef(false);

  useEffect(() => {
    const takeHighlight = () => {
      if (!highlightArmed.current) return;
      highlightArmed.current = false;
      const root = highlightCopy.current;
      const selection = window.getSelection();
      if (!root || !selection || selection.rangeCount === 0 || selection.isCollapsed) return;
      if (!root.contains(selection.getRangeAt(0).commonAncestorContainer)) return;
      const picked = selection.toString().replace(/\s+/g, " ").trim();
      if (picked.length < 2) return;
      setHighlightQuotes((current) =>
        current.some((quote) => quote.toLowerCase() === picked.toLowerCase()) ? current : [...current, picked],
      );
    };
    document.addEventListener("mouseup", takeHighlight);
    return () => document.removeEventListener("mouseup", takeHighlight);
  }, []);

  const currentFollow = FOLLOW_QS[Math.min(cardStep, FOLLOW_QS.length) - 1];
  const advanceFollow = FOLLOW_QS[Math.min(advanceStep, FOLLOW_QS.length - 1)];

  return (
    <div className="chat-lab is-catalog">
      <div className="chat-catalog">
        <header className="chat-catalog-intro">
          <p>Chat design system</p>
          <h1>Explorations</h1>
          <p>Park ideas here while we try them. Nothing on this page ships in the playground until we pick a direction.</p>
        </header>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 17 · Charts</p>
              <h2>Dashboard cards</h2>
            </div>
            <p className="chat-explore-flag">Trying</p>
          </header>
          <p className="chat-explore-note">
            Ways a snapshot can land in the thread as a dashboard, not a file. Same Adobe week — different density.
          </p>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas is-wide">
              <figcaption>Pulse — KPI tiles</figcaption>
              <div className="chat-link-demo">
                <UserBubble text="What does the Adobe snapshot say about us this month?" />
                <AssistantBubble text="Here’s the week at a glance." />
                <ChartKpis />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Compare — share of conversation</figcaption>
              <ChartCompare />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Trend — mentions over the week</figcaption>
              <ChartTrend />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Mix — where it happened</figcaption>
              <ChartMix />
            </figure>
            <figure className="chat-spec-canvas is-wide">
              <figcaption>Board — one dashboard card</figcaption>
              <ChartBoard />
            </figure>
          </div>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 17 · Actions</p>
              <h2>Recommended actions</h2>
            </div>
            <p className="chat-explore-flag">Trying</p>
          </header>
          <p className="chat-explore-note">
            Follow-up questions hone the ask. These are the next moves the agent can take — when it can’t do the job
            yet, or when the better first step is to set something up.
          </p>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas">
              <figcaption>Suggested first</figcaption>
              <RecommendActions
                actions={RECOMMEND_ACTIONS}
                recommended={RECOMMEND_ACTIONS[0]}
                selected={suggestPick}
                onSelect={setSuggestPick}
              />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>After a pick — what only</figcaption>
              <div className="recommend-thread">
                <RecommendActions
                  actions={RECOMMEND_ACTIONS}
                  recommended={RECOMMEND_ACTIONS[0]}
                  selected="Create a topic"
                />
                <StatusLine label="Creating a topic so we can watch this" />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>After a pick — what and where</figcaption>
              <div className="recommend-thread">
                <RecommendActions
                  actions={RECOMMEND_ACTIONS}
                  recommended={RECOMMEND_ACTIONS[0]}
                  selected="Create a topic"
                />
                <StatusLine label="Creating a topic" where="Topics" />
              </div>
            </figure>
          </div>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 17 · Follow-up</p>
              <h2>Follow-up question</h2>
            </div>
            <p className="chat-explore-flag">Trying</p>
          </header>
          <p className="chat-explore-note">
            Same ask, different layouts and different places it can sit in the thread — chips, numbered, checks, then
            where it lives, when it moves, and how write-in works.
          </p>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas">
              <figcaption>Chips</figcaption>
              <FollowUpQ
                question={LAYOUT_Q.question}
                step={layoutStep}
                options={LAYOUT_Q.options}
                selected={layoutChip}
                onSelect={setLayoutChip}
                onPrev={() => setLayoutStep((value) => Math.max(1, value - 1))}
                onNext={() => setLayoutStep((value) => Math.min(3, value + 1))}
              />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Numbered</figcaption>
              <FollowUpQ
                layout="numbered"
                question={LAYOUT_Q.question}
                step={1}
                options={LAYOUT_Q.options}
                selected={layoutNumber}
                skip
                onSelect={setLayoutNumber}
              />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Checks</figcaption>
              <FollowUpQ
                layout="checks"
                question={LAYOUT_Q.question}
                step={1}
                options={LAYOUT_Q.options}
                selected={layoutCheck}
                skip
                onSelect={setLayoutCheck}
              />
            </figure>
            <figure className="chat-spec-canvas is-wide">
              <figcaption>Highlight to change</figcaption>
              <div className="follow-highlight">
                <UserBubble text="What's happening around our brand this week?" />
                <StatusLine label="Prepared follow-up questions" />
                <div
                  ref={highlightCopy}
                  className="follow-highlight-copy"
                  onMouseDown={() => {
                    highlightArmed.current = true;
                  }}
                >
                  <h3>Prompt summary</h3>
                  <HighlightCopy text={HIGHLIGHT_SUMMARY} quotes={highlightQuotes} />
                </div>
                <p className="follow-highlight-hint">Highlight anything you want to change before we gather the data.</p>
                <Composer
                  autoFocus={highlightQuotes.length > 0}
                  value={highlightNote}
                  quotes={highlightQuotes}
                  placeholder={highlightQuotes.length ? "What should this be instead?" : "Ask a follow-up…"}
                  onChange={setHighlightNote}
                  onClearQuote={(quote) => {
                    setHighlightQuotes((current) => current.filter((item) => item !== quote));
                  }}
                  onSubmit={() => {
                    setHighlightNote("");
                    setHighlightQuotes([]);
                  }}
                />
              </div>
            </figure>
            <figure className="chat-spec-canvas is-wide">
              <figcaption>Research dock</figcaption>
              <div className="follow-q-research">
                <div className="follow-q-research-head">
                  <div className="follow-q-research-top">
                    <div className={`follow-q-research-menu${researchOpen ? " is-open" : ""}`}>
                      <button
                        className="follow-q-research-chip"
                        type="button"
                        aria-expanded={researchOpen}
                        onClick={() => setResearchOpen((value) => !value)}
                      >
                        {FOLLOW_QS[researchStep].question}
                        <ChatIcon src={chatAssets.caretFigma} size={12} />
                      </button>
                    </div>
                    <p className="follow-q-research-hint">
                      <ChatIcon src={chatAssets.flash} size={12} />
                      Get powerful insights with Research
                    </p>
                  </div>
                </div>
                {researchOpen ? (
                  <div className="follow-q-research-list">
                    {FOLLOW_QS[researchStep].options.map((option) => (
                      <button
                        key={option}
                        className={researchPick === option ? "is-selected" : ""}
                        type="button"
                        onClick={() => {
                          setResearchPick(option);
                          setResearchNote(option);
                          setResearchOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
                <Composer
                  value={researchNote}
                  onChange={setResearchNote}
                  onSubmit={() => {
                    setResearchNote("");
                    setResearchPick(null);
                  }}
                  placeholder="Pick up where you left off or start something new?"
                  toolbar={
                    <div className="follow-q-mode">
                      <button
                        className={researchMode === "chat" ? "is-on" : ""}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setResearchMode("chat");
                        }}
                      >
                        Chat
                      </button>
                      <button
                        className={researchMode === "research" ? "is-on" : ""}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setResearchMode("research");
                        }}
                      >
                        Research
                      </button>
                    </div>
                  }
                />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Card + pager — now</figcaption>
              <FollowUpQ
                question={currentFollow.question}
                step={cardStep}
                total={FOLLOW_QS.length}
                options={currentFollow.options}
                selected={cardPick}
                onSelect={setCardPick}
                onPrev={() => setCardStep((value) => Math.max(1, value - 1))}
                onNext={() => setCardStep((value) => Math.min(FOLLOW_QS.length, value + 1))}
              />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Attached to the reply</figcaption>
              <div className="follow-attach">
                <p className="follow-attach-intro">
                  Here’s a short read of the last 7 days. A couple of details to hone in on the right fit:
                </p>
                <FollowUpQ
                  question={FOLLOW_QS[0].question}
                  options={FOLLOW_QS[0].options}
                  selected={attachPick}
                  onSelect={setAttachPick}
                />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Write-in opens</figcaption>
              <div className="follow-q-stack">
                <FollowUpQ
                  question={FOLLOW_QS[0].question}
                  options={FOLLOW_QS[0].options}
                  selected={writing ? null : writePick}
                  pager={false}
                  onSelect={(value) => {
                    setWriting(false);
                    setWritePick(value);
                  }}
                  onWriteIn={() => {
                    setWritePick(null);
                    setWriting(true);
                  }}
                />
                {writing ? (
                  <label className="follow-q-write">
                    <textarea
                      value={writeText}
                      onChange={(event) => setWriteText(event.target.value)}
                      placeholder="Write it in your own words…"
                    />
                  </label>
                ) : null}
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Pick advances</figcaption>
              {advanceStep < FOLLOW_QS.length ? (
                <FollowUpQ
                  question={advanceFollow.question}
                  step={advanceStep + 1}
                  total={FOLLOW_QS.length}
                  options={advanceFollow.options}
                  selected={advancePicks[advanceStep] ?? null}
                  skip
                  onSelect={(value) => {
                    setAdvancePicks((current) => {
                      const next = [...current];
                      next[advanceStep] = value;
                      return next;
                    });
                    setAdvanceStep((value) => value + 1);
                  }}
                  onPrev={() => setAdvanceStep((value) => Math.max(0, value - 1))}
                  onSkip={() => setAdvanceStep((value) => value + 1)}
                />
              ) : (
                <AssistantBubble text={`Got it — ${advancePicks.filter(Boolean).join(", ") || "you skipped these"}. I’ll use that.`} />
              )}
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>All at once</figcaption>
              <div className="follow-q-stack">
                {FOLLOW_QS.map((item, index) => (
                  <FollowUpQ
                    key={item.question}
                    pager={false}
                    writeIn={false}
                    question={item.question}
                    options={item.options}
                    selected={stackPicks[index]}
                    onSelect={(value) =>
                      setStackPicks((current) => current.map((pick, pickIndex) => (pickIndex === index ? value : pick)))
                    }
                  />
                ))}
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Composer sheet</figcaption>
              <div className="follow-q-sheet">
                <div className="follow-q-sheet-head">
                  <p>{FOLLOW_QS[0].question}</p>
                  <span>Pick one</span>
                </div>
                <div className="follow-q-chips">
                  {FOLLOW_QS[0].options.map((option) => (
                    <button
                      key={option}
                      className={`follow-q-chip${sheetPick === option ? " is-selected" : ""}`}
                      type="button"
                      onClick={() => setSheetPick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <Composer
                  value={sheetNote}
                  onChange={setSheetNote}
                  onSubmit={() => setSheetNote("")}
                  placeholder="Add more context…"
                />
              </div>
            </figure>
          </div>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 14 · Draft</p>
              <h2>Editable pills</h2>
            </div>
            <p className="chat-explore-flag">Trying</p>
          </header>
          <p className="chat-explore-note">
            Criteria, platforms, and size should feel like pills you can change. Playground currently uses the quiet
            pill. These are ways to edit from the draft rail without sending another message.
          </p>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas">
              <figcaption>Quiet pill</figcaption>
              <div className="chat-chips">
                <Chip label="#nycfashion" />
                <Chip label="Instagram" />
                <Chip label="2-5k" />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Dismiss — tap ×</figcaption>
              <div className="chat-chips">
                {dismiss.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    variant="dismiss"
                    onRemove={() => setDismiss((current) => current.filter((value) => value !== item))}
                  />
                ))}
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Dropdown</figcaption>
              <div className="chat-chips">
                <Chip
                  label={platform}
                  variant="menu"
                  options={["Instagram", "TikTok", "YouTube", "Any platform"]}
                  onChange={setPlatform}
                />
                <Chip
                  label={size}
                  variant="menu"
                  options={["<1k", "2-5k", "5-10k", "10-50k", "Any size"]}
                  onChange={setSize}
                />
              </div>
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Edit mode</figcaption>
              <div className="chat-chip-edit">
                <div className="chat-chips">
                  {editItems.map((item) =>
                    editing ? (
                      <Chip
                        key={item}
                        label={item}
                        variant="dismiss"
                        onRemove={() => setEditItems((current) => current.filter((value) => value !== item))}
                      />
                    ) : (
                      <Chip key={item} label={item} />
                    ),
                  )}
                </div>
                {editing ? (
                  <form
                    className="chat-chip-add"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const next = draftItem.trim();
                      if (!next) return;
                      setEditItems((current) => [...current, next]);
                      setDraftItem("");
                    }}
                  >
                    <input
                      value={draftItem}
                      onChange={(event) => setDraftItem(event.target.value)}
                      placeholder="Add a criterion"
                    />
                    <button type="submit">Add</button>
                  </form>
                ) : null}
                <button type="button" className="chat-chip-mode" onClick={() => setEditing((value) => !value)}>
                  {editing ? "Done" : "Edit criteria"}
                </button>
              </div>
            </figure>
          </div>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 14 · Processing</p>
              <h2>Processing card</h2>
            </div>
            <p className="chat-explore-flag">Parked</p>
          </header>
          <p className="chat-explore-note">
            Tried this in the live search flow. Felt too heavy next to the thread and draft rail, so it came out of
            Playground. Keeping the variants here until we decide if it belongs anywhere.
          </p>
          <div className="chat-spec-grid">
            <figure className="chat-spec-canvas">
              <figcaption>Default — starting</figcaption>
              <ProcessCard
                elapsed={1}
                steps={steps}
                onToggle={(index) =>
                  setSteps((current) =>
                    current.map((step, stepIndex) =>
                      stepIndex === index ? { ...step, done: !step.done } : step,
                    ),
                  )
                }
              />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Default — in progress</figcaption>
              <ProcessCard elapsed={8} activeIndex={1} steps={mid} />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Default — complete</figcaption>
              <ProcessCard
                title="Processed your response"
                elapsed={12}
                meta="Done"
                steps={[
                  { label: "Reading your prompt", done: true },
                  { label: "Matching creator criteria", done: true },
                  { label: "Preparing results", done: true },
                ]}
              />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Wash</figcaption>
              <ProcessCard variant="wash" elapsed={8} activeIndex={1} steps={mid} />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Bordered</figcaption>
              <ProcessCard variant="bordered" elapsed={8} activeIndex={1} steps={mid} />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Compact</figcaption>
              <ProcessCard variant="compact" elapsed={8} activeIndex={1} steps={mid} />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Progress bar</figcaption>
              <ProcessCard variant="bar" elapsed={8} activeIndex={1} steps={mid} />
            </figure>
            <figure className="chat-spec-canvas">
              <figcaption>Numbered</figcaption>
              <ProcessCard variant="numbered" elapsed={8} activeIndex={1} steps={mid} />
            </figure>
          </div>
        </article>
      </div>
    </div>
  );
}
