import "./chat.css";
import "./rules.css";

type Status = "built" | "todo";

type Rule = { text: string; status?: Status; note?: string };

type Topic = {
  id: string;
  meta: string;
  title: string;
  flag: string;
  note: string;
  today: Rule[];
  proposed: Rule[];
};

const STATUS_LABEL: Record<Status, string> = { built: "Built in prototype", todo: "Not built yet" };

const DATA_BASIS = [
  { window: "7 days", raw: 17, merged: 3, top: 16 },
  { window: "14 days", raw: 48, merged: 11, top: 39 },
  { window: "21 days", raw: 77, merged: 20, top: 66 },
  { window: "30 days", raw: 116, merged: 32, top: 103 },
];

const TOPICS: Topic[] = [
  {
    id: "surfacing",
    meta: "01 · Surfacing",
    title: "How themes are surfaced",
    flag: "Proposal",
    note: "Which themes make it into the feed, how many we show, and which controls people get.",
    today: [
      { text: "Every generated theme is shown. Nothing is de-duplicated, so the same story appears several times." },
      { text: "The feed offered “Show all 52 themes”, about what a typical brand gets raw over 14 days." },
      {
        text: "Filters and sort were copied from the post-level controls: 9 filter groups (incl. Signal, Minimum play count, Relationship strength, Topic relevancy) and sorts like Saves and Date reviewed.",
      },
      { text: "In the prototype the filters don’t actually filter themes." },
    ],
    proposed: [
      {
        text: "Merge near-duplicates: same title, or at least 50% of posts shared. Keep the larger theme and show “Combined from N themes”.",
        status: "todo",
        note: "The prototype mocks the label on older themes only.",
      },
      { text: "Only show themes with at least 5 posts.", status: "todo" },
      {
        text: "Default timeframe is Last 14 days: about 11 themes for a typical brand, about 39 for the top 10%.",
        status: "built",
      },
      {
        text: "No hard cap. Show the first 4, then one “Show all themes” button reveals the rest of the timeframe.",
        status: "built",
      },
      { text: "Longer timeframes reveal older themes inline under “Week of …” dividers.", status: "built" },
      {
        text: "Theme filters trimmed to Platform, Followers, Sentiment, Topic relevancy, Organic/Paid, Language and Country.",
        status: "built",
        note: "Menu only for now; it doesn’t filter the mock themes yet.",
      },
      {
        text: "Removed Signal, Minimum play count and Relationship strength. Relationship strength is ~95% Neutral across 13.8M creator profiles, so it barely filters. It works better as a card label, like “Driven by 3 of your top creators”.",
        status: "built",
      },
      {
        text: "Sorts: Recency, Views, Likes, Comments, Engagement rate, Total engagement, Shares, Follower count. Removed Saves (Plot doesn’t store saves) and Date reviewed.",
        status: "built",
      },
      { text: "Hide themes similar to ones the user rated “Not for us” or thumbs-down.", status: "todo" },
    ],
  },
  {
    id: "staleness",
    meta: "02 · Staleness",
    title: "How themes go stale",
    flag: "Proposal",
    note: "Themes can’t update once they’re made, so their age is the best measure of how stale they are.",
    today: [
      { text: "Themes are snapshots. They never gain posts after they’re created." },
      { text: "Nothing expires or archives, so old themes pile up." },
    ],
    proposed: [
      { text: "A theme leaves the default feed 14 days after it was created.", status: "built" },
      {
        text: "It stays reachable through a longer timeframe. Older themes appear inline by week, and each card shows “From Sep 12”.",
        status: "built",
      },
      {
        text: "No auto-update of existing themes. A new wave of posts becomes a new theme, which then merges with the old one.",
      },
      { text: "“New” tag on themes created since the user’s last visit.", status: "todo" },
      {
        text: "Negative feedback removes a theme from that user’s feed.",
        status: "todo",
        note: "The prototype hides it for the session only.",
      },
    ],
  },
  {
    id: "hero",
    meta: "03 · Hero cards",
    title: "How hero cards are picked",
    flag: "Proposal — to validate",
    note: "The hero is the one large card at the top of the feed.",
    today: [
      { text: "Product rule not documented — to confirm with engineering." },
      {
        text: "In the prototype the hero is simply the first theme after sorting. With Recency that’s the newest theme, so changing the sort changes the hero.",
      },
      {
        text: "The earlier layout repeated “hero + 2 cards”, so expanding the feed produced a second (and third) hero.",
      },
    ],
    proposed: [
      { text: "Exactly one hero per feed.", status: "built" },
      { text: "Candidates: themes created in the last 7 days with at least 10 posts.", status: "todo" },
      {
        text: "Pick the highest engagement rate (pooled, see below). Break ties by total views.",
        status: "todo",
      },
      {
        text: "Skip themes the user already saw as the hero in the last 3 days, or rated negatively.",
        status: "todo",
      },
      { text: "If nothing qualifies, no hero. The feed is all regular cards.", status: "todo" },
    ],
  },
];

const METRICS = [
  {
    term: "Post engagement rate",
    definition: "(likes + comments + shares) ÷ views. Matches Plot’s engagementRateByViewCount.",
  },
  {
    term: "Theme total engagement",
    definition: "Likes + comments + shares summed across the theme’s posts, counting each post once.",
  },
  {
    term: "Theme engagement rate",
    definition:
      "Theme total engagement ÷ theme total views. Pooled, not an average of post rates. Posts with no view count (~16% of theme posts) are left out of both.",
  },
  {
    term: "Shares",
    definition:
      "Only ~64% of theme posts have a share count (likes 96%, views 84%), so summing penalises themes with missing data. Use shares per 1K views over posts that have share data, or drop the sort.",
  },
  {
    term: "Sums vs rates",
    definition:
      "Views, total engagement and shares mostly rank themes by size. Engagement rate is the size-independent sort.",
  },
];

const QUESTIONS = [
  "Merge threshold (50% shared posts): validate with engineering. Chains of overlapping themes may merge further.",
  "14 or 30-day default for big brands? The top 10% get ~39 vs ~103 themes.",
  "Keep the Shares sort?",
  "Minimum posts for a hero (10?) and an engagement threshold.",
  "Relationship strength as a card label rather than a filter.",
];

function RuleList({ rules }: { rules: Rule[] }) {
  return (
    <ul className="rules-list">
      {rules.map((rule) => (
        <li key={rule.text}>
          <p>{rule.text}</p>
          {rule.status || rule.note ? (
            <div className="rules-meta">
              {rule.status ? <span className={`rules-tag is-${rule.status}`}>{STATUS_LABEL[rule.status]}</span> : null}
              {rule.note ? <span className="rules-note">{rule.note}</span> : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function Rules() {
  return (
    <div className="chat-lab is-catalog rules-page">
      <div className="chat-catalog">
        <header className="chat-catalog-intro">
          <p>Newsfeed</p>
          <h1>Theme rules</h1>
          <p>What the feed does today, and what we propose, for surfacing, staleness and hero cards.</p>
        </header>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Sep 29 · Production replica</p>
              <h2>Data basis</h2>
            </div>
          </header>
          <p className="chat-explore-note">
            Themes per brand. Merged means themes with the same title or at least 50% shared posts are folded into the
            larger one, and only themes with 5+ posts count.
          </p>
          <div className="rules-block">
            <table className="rules-table">
              <thead>
                <tr>
                  <th>Window</th>
                  <th>Typical brand, raw</th>
                  <th>Typical brand, merged</th>
                  <th>Top 10%, merged</th>
                </tr>
              </thead>
              <tbody>
                {DATA_BASIS.map((row) => (
                  <tr key={row.window}>
                    <td>{row.window}</td>
                    <td>{row.raw}</td>
                    <td>{row.merged}</td>
                    <td>{row.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="rules-facts">
            <li>
              <strong>1–1.5</strong>
              <span>new themes per day per brand, after merging</span>
            </li>
            <li>
              <strong>~30%</strong>
              <span>of themes repeat another theme’s exact title</span>
            </li>
            <li>
              <strong>86%</strong>
              <span>of 30-day themes share at least half their posts with another theme</span>
            </li>
            <li>
              <strong>29%</strong>
              <span>share all their posts with another theme</span>
            </li>
          </ul>
        </article>

        {TOPICS.map((topic) => (
          <article key={topic.id} className="chat-explore">
            <header className="chat-explore-head">
              <div>
                <p className="chat-explore-meta">{topic.meta}</p>
                <h2>{topic.title}</h2>
              </div>
              <p className="chat-explore-flag">{topic.flag}</p>
            </header>
            <p className="chat-explore-note">{topic.note}</p>
            <div className="rules-compare">
              <section className="rules-block">
                <h3>Today</h3>
                <RuleList rules={topic.today} />
              </section>
              <section className="rules-block">
                <h3>Proposed</h3>
                <RuleList rules={topic.proposed} />
              </section>
            </div>
          </article>
        ))}

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">Reference</p>
              <h2>Metric definitions</h2>
            </div>
          </header>
          <dl className="rules-block rules-defs">
            {METRICS.map((metric) => (
              <div key={metric.term}>
                <dt>{metric.term}</dt>
                <dd>{metric.definition}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="chat-explore">
          <header className="chat-explore-head">
            <div>
              <p className="chat-explore-meta">To decide</p>
              <h2>Open questions</h2>
            </div>
          </header>
          <div className="rules-block">
            <ul className="rules-list">
              {QUESTIONS.map((question) => (
                <li key={question}>
                  <p>{question}</p>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
