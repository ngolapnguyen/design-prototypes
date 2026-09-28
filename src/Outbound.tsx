import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { ob } from "./outbound-assets";
import {
  brandComments,
  chartLabels,
  chartSeries,
  leaders,
  metricTabs,
  type ChartMetric,
} from "./outbound-data";

type NavId =
  | "notifications"
  | "chat"
  | "workflows"
  | "home"
  | "engagement"
  | "brand"
  | "competitor"
  | "outbound"
  | "community"
  | "sourcing"
  | "report"
  | "trends"
  | "juicebox"
  | "calendar"
  | "research"
  | "bookmarks"
  | "settings";

function InfoTip({ text }: { text: string }) {
  return (
    <span className="ob-tip">
      <Icon src={ob.info} size={13} />
      <span className="ob-tip-bubble">{text}</span>
    </span>
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      className={`ob-toggle${on ? " is-on" : ""}`}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
    >
      <span />
    </button>
  );
}

function Menu({
  label,
  options,
  value,
  onChange,
  icon,
  nestIcon,
}: {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: string;
  nestIcon?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ob-menu">
      <button className="ob-chip" type="button" onClick={() => setOpen((v) => !v)}>
        {icon ? (
          nestIcon ? (
            <span className="ob-chip-ico">
              <Icon src={icon} size={16} />
            </span>
          ) : (
            <Icon src={icon} size={16} />
          )
        ) : null}
        <span>{label ?? value}</span>
        <Icon src={ob.caret} size={16} />
      </button>
      {open ? (
        <div className="ob-menu-list" role="listbox">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={option === value ? "is-active" : ""}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AreaChart({ values, hover, onHover }: { values: number[]; hover: number | null; onHover: (i: number | null) => void }) {
  const max = Math.max(...values, 1);
  const w = 1164;
  const h = 310;
  const pad = 8;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg className="ob-chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1="0" x2={w} y1={pad + (1 - t) * (h - pad * 2)} y2={pad + (1 - t) * (h - pad * 2)} stroke="#e8e8e8" strokeDasharray="4 6" />
      ))}
      <path d={area} fill="url(#obFill)" />
      <path d={line} fill="none" stroke="#a898d7" strokeWidth="3" />
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)}>
          <circle cx={p[0]} cy={p[1]} r={hover === i ? 7 : 4} fill="#a898d7" />
          {hover === i ? (
            <g>
              <rect x={p[0] - 36} y={p[1] - 36} width="72" height="24" rx="8" fill="#230603" />
              <text x={p[0]} y={p[1] - 20} textAnchor="middle" fill="#faf3ec" fontSize="12" fontFamily="TT Commons Pro, sans-serif">
                {values[i].toLocaleString()}
              </text>
            </g>
          ) : null}
        </g>
      ))}
      <defs>
        <linearGradient id="obFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a898d7" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#a898d7" stopOpacity="0.02" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Outbound() {
  const [nav, setNav] = useState<NavId>("outbound");
  const [collapsed, setCollapsed] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [juiceOpen, setJuiceOpen] = useState(true);
  const [allComments, setAllComments] = useState(true);
  const [chartAll, setChartAll] = useState(true);
  const [metric, setMetric] = useState<ChartMetric>("comments");
  const [hover, setHover] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [leadQuery, setLeadQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Total Engagement");
  const [source, setSource] = useState("Source");
  const [topics, setTopics] = useState("Topics");
  const [commentors, setCommentors] = useState("Commentors");
  const [platforms, setPlatforms] = useState("Tiktok & Instagram");
  const [range, setRange] = useState("30 days");
  const [toast, setToast] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [tip, setTip] = useState<string | null>(null);
  const [seeAll, setSeeAll] = useState(false);

  const ping = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const values = chartSeries[metric];
  const comments = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = brandComments.filter((c) => !q || c.text.toLowerCase().includes(q) || c.date.toLowerCase().includes(q));
    if (!allComments) rows = rows.filter((c) => c.likesN >= 100);
    if (sort === "Newest") rows = [...rows].reverse();
    return seeAll ? rows : rows.slice(0, 8);
  }, [query, allComments, sort, seeAll]);

  const leadRows = leaders.filter((row) => row.name.toLowerCase().includes(leadQuery.toLowerCase()));
  const total = allComments ? 49 : 32;

  const navItem = (id: NavId, icon: string, label: string, extra?: ReactNode) => (
    <button
      key={id}
      className={`ob-nav${nav === id ? " is-active" : ""}`}
      type="button"
      onClick={() => setNav(id)}
    >
      <Icon src={icon} size={16} />
      {collapsed ? null : <span>{label}</span>}
      {collapsed ? null : extra}
    </button>
  );

  return (
    <div className={`ob${collapsed ? " is-collapsed" : ""}`}>
      <aside className="ob-side">
        <div className="ob-side-top">
          <div className="ob-org">
            <span className="ob-logo">
              <img src={ob.logo} alt="Plot" width={24} height={24} />
            </span>
            {collapsed ? null : (
              <>
                <p>Plot</p>
                <Icon src={ob.orgCaret} size={14} />
              </>
            )}
          </div>
          <button className="ob-icon-btn" type="button" aria-label="Collapse sidebar" onClick={() => setCollapsed((v) => !v)}>
            <Icon src={ob.collapse} size={24} />
          </button>
        </div>
        {navItem("notifications", ob.notifications, "Notifications")}
        {navItem("chat", ob.chat, "Chat")}
        {navItem(
          "workflows",
          ob.workflows,
          "Workflows",
          <span className="ob-badge ob-badge-new">New</span>,
        )}
        <hr className="ob-rule" />
        {navItem("home", ob.home, "Home")}
        {navItem("engagement", ob.engagement, "Engagement")}
        <button className="ob-nav ob-nav-split" type="button" onClick={() => setBrandOpen((v) => !v)}>
          <span className="ob-nav-main">
            <Icon src={ob.brandAnalytics} size={16} />
            {collapsed ? null : <span>Brand Analytics</span>}
          </span>
          {collapsed ? null : <Icon src={ob.chevron} size={16} />}
        </button>
        {brandOpen && !collapsed ? <p className="ob-sub">Overview</p> : null}
        {navItem("competitor", ob.competitor, "Competitor Analytics")}
        {navItem("outbound", ob.outbound, "Outbound")}
        {navItem("community", ob.community, "Community Hub")}
        {navItem(
          "sourcing",
          ob.sourcing,
          "Creator Sourcing",
          <span className="ob-badge ob-badge-beta">Beta</span>,
        )}
        {navItem("report", ob.customReport, "Custom Report")}
        <hr className="ob-rule" />
        {navItem("trends", ob.trends, "Trends")}
        <button className="ob-nav ob-nav-split" type="button" onClick={() => setJuiceOpen((v) => !v)}>
          <span className="ob-nav-main">
            <Icon src={ob.juicebox} size={16} />
            {collapsed ? null : <span>Creative Juicebox</span>}
          </span>
          {collapsed ? null : (
            <span className={juiceOpen ? "ob-flip" : ""}>
              <Icon src={ob.juiceboxCaret} size={16} />
            </span>
          )}
        </button>
        {juiceOpen && !collapsed ? (
          <button className={`ob-nav ob-indent${nav === "calendar" ? " is-active" : ""}`} type="button" onClick={() => setNav("calendar")}>
            Content Calendar
          </button>
        ) : null}
        {navItem(
          "research",
          ob.research,
          "Deep Research",
          <span className="ob-badge ob-badge-beta">Beta</span>,
        )}
        <hr className="ob-rule" />
        {navItem("bookmarks", ob.bookmarks, "Bookmarks", <Icon src={ob.chevron} size={16} />)}
        <div className="ob-user">
          <div className="ob-user-row">
            <img src={ob.avatar} alt="" width={16} height={16} />
            {collapsed ? null : (
              <div>
                <p className="ob-user-name">Shaahana Naufal</p>
                <p className="ob-user-mail">shaahana@plot.so</p>
                <span className="ob-plan">Enterprise Plan</span>
              </div>
            )}
          </div>
          <div className="ob-user-foot">
            <button className="ob-nav" type="button" onClick={() => setNav("settings")}>
              <Icon src={ob.settings} size={16} />
              {collapsed ? null : <span>Settings</span>}
            </button>
            <button className="ob-icon-btn" type="button" aria-label="More" onClick={() => ping("Account menu")}>
              <Icon src={ob.more} size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="ob-main">
        <header className="ob-top">
          <div className="ob-crumb">
            <button type="button" className="ob-icon-btn" aria-label="Back" onClick={() => ping("Back to Plot")}>
              <Icon src={ob.back} size={20} />
            </button>
            <button type="button" onClick={() => ping("Plot home")}>
              Plot
            </button>
            <span>/</span>
            <strong>Outbound</strong>
          </div>
          <div className="ob-top-actions">
            <button className="ob-invite" type="button" onClick={() => ping("Invite sent to clipboard")}>
              <Icon src={ob.invite} size={16} />
              Invite
            </button>
            <button className="ob-icon-btn" type="button" aria-label="More" onClick={() => ping("Page menu")}>
              <Icon src={ob.overflow} size={24} />
            </button>
            <button className="ob-spark" type="button" aria-label="Ask Plot" onClick={() => ping("Plot assistant")}>
              <Icon src={ob.sparkle} size={16} />
            </button>
          </div>
        </header>

        <div className="ob-page">
          <div className="ob-page-head">
            <div className="ob-title-row">
              <h1>Outbound</h1>
              <button className="ob-refresh" type="button" aria-label="Refresh" onClick={() => ping("Refreshed just now")}>
                <Icon src={ob.refresh} size={22} />
              </button>
            </div>
            <div className="ob-filters">
              <Menu icon={ob.filter} nestIcon options={["All sources", "Uploaded links", "Plot tracked"]} value={source} onChange={setSource} />
              <Menu icon={ob.filter} options={["All topics", "Hair", "Collab", "Product"]} value={topics} onChange={setTopics} />
              <Menu icon={ob.commentors} nestIcon options={["All commentors", "Brand only", "Unassigned"]} value={commentors} onChange={setCommentors} />
              <Menu icon={ob.platforms} nestIcon options={["Tiktok & Instagram", "TikTok", "Instagram"]} value={platforms} onChange={setPlatforms} />
              <Menu icon={ob.calendar} nestIcon options={["7 days", "30 days", "90 days"]} value={range} onChange={setRange} label={range} />
              <button className="ob-gear" type="button" aria-label="Settings" onClick={() => ping("Outbound settings")}>
                <Icon src={ob.gear} size={22} />
              </button>
            </div>
          </div>

          <section className="ob-hero">
            <div className="ob-hero-head">
              <div>
                <h2>A little quieter this week 🤫</h2>
                <p>Jul 29, 2026 - Today</p>
              </div>
              <div className="ob-hero-cta">
                <img className="ob-doodle ob-doodle-l" src={ob.doodleBurst} alt="" width={46} height={46} />
                <button type="button" onClick={() => ping("Opening Community Growth Report")}>
                  Community Growth Report→
                </button>
                <img className="ob-doodle ob-doodle-r" src={ob.doodleBolt} alt="" width={46} height={46} />
              </div>
            </div>
            <div className="ob-hero-grid">
              <article className="ob-glass">
                <div className="ob-glass-top">
                  <div className="ob-total">
                    <span className="ob-num">{total}</span>
                    <span className="ob-label">Total comments</span>
                    <span className="ob-down">
                      ↓ {allComments ? "66.89%" : "41.20%"} <em>vs last 4 weeks</em>
                    </span>
                  </div>
                  <div className="ob-switch">
                    <span className={!allComments ? "is-strong" : ""}>Verified</span>
                    <InfoTip text="Comments we’ve found with engagement data available. These are typically within the top 100 by engagement." />
                    <Toggle on={allComments} onChange={setAllComments} />
                    <span className={allComments ? "is-strong" : ""}>All</span>
                    <InfoTip text="Includes both verified and unverified comments you’ve uploaded or marked as “Responded” in Plot. Only verified comments will have engagement data." />
                  </div>
                </div>
                <hr />
                <div className="ob-kpis">
                  {[
                    ["Likes", allComments ? "18.83K" : "12.40K", "♥️", "74.19%"],
                    ["Replies", allComments ? "119" : "84", "💬", "32.77%"],
                    ["Impressions", allComments ? "62.78K" : "41.10K", "👁️", "76.82%"],
                    ["EMV", allComments ? "$6.26K" : "$4.12K", "💲", "73.76%"],
                  ].map(([name, value, emoji, drop]) => (
                    <div key={name}>
                      <div className="ob-kpi-label">
                        {name}
                        <button type="button" className="ob-info-btn" onClick={() => setTip(tip === name ? null : name)}>
                          <Icon src={ob.infoSm} size={16} />
                        </button>
                      </div>
                      {tip === name ? <p className="ob-inline-tip">{name} on verified brand comments in this window.</p> : null}
                      <div className="ob-kpi-val">
                        <span>{value}</span>
                        <span className="ob-emoji">{emoji}</span>
                      </div>
                      <p className="ob-down">
                        ↓ {drop} <em>vs last 4 weeks</em>
                      </p>
                    </div>
                  ))}
                </div>
              </article>
              <article className="ob-glass ob-side-card">
                <p className="ob-kicker">Top comments</p>
                <div className="ob-skel">
                  <span className="ob-skel-thumb" />
                  <div>
                    <span className="ob-skel-line w-lg" />
                    <span className="ob-skel-block" />
                    <div className="ob-skel-metrics">
                      <span>
                        <Icon src={ob.heart} size={14} />
                        <i />
                      </span>
                      <span>
                        <Icon src={ob.reply} size={14} />
                        <i />
                      </span>
                      <span>
                        <Icon src={ob.impressions} size={14} />
                        <i />
                      </span>
                      <span>
                        <Icon src={ob.emv} size={14} />
                        <i />
                      </span>
                    </div>
                  </div>
                </div>
                <hr />
                <p className="ob-kicker">Top community manager</p>
                <div className="ob-skel">
                  <span className="ob-skel-avatar" />
                  <div>
                    <span className="ob-skel-line" />
                    <div className="ob-skel-metrics">
                      <span>
                        <Icon src={ob.reply} size={14} />
                        <i />
                      </span>
                      <span>
                        <Icon src={ob.heart} size={14} />
                        <i />
                      </span>
                      <span>
                        <Icon src={ob.impressions} size={14} />
                        <i />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="ob-card">
            <div className="ob-card-head">
              <div>
                <h3>Total Brand Comments</h3>
                <p className="ob-stat">{chartAll ? 49 : 32}</p>
                <p className="ob-muted">Comments your brand posted on creator content.</p>
              </div>
              <div className="ob-card-tools">
                <div className="ob-switch">
                  <span className={!chartAll ? "is-strong" : ""}>Verified</span>
                  <InfoTip text="Comments we’ve found with engagement data available." />
                  <Toggle on={chartAll} onChange={setChartAll} />
                  <span className={chartAll ? "is-strong" : ""}>All</span>
                  <InfoTip text="Includes verified and unverified comments." />
                </div>
                <div className="ob-pills" role="tablist">
                  {metricTabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={metric === tab.id ? "is-active" : ""}
                      type="button"
                      role="tab"
                      aria-selected={metric === tab.id}
                      onClick={() => setMetric(tab.id)}
                    >
                      <span>{tab.emoji}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="ob-chart">
              <div className="ob-y">
                {[28, 21, 14, 7, 0].map((n) => (
                  <span key={n}>{metric === "comments" ? n : Math.round((n / 28) * Math.max(...values))}</span>
                ))}
              </div>
              <div className="ob-chart-plot">
                <AreaChart values={values} hover={hover} onHover={setHover} />
                <div className="ob-x">
                  {chartLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <p className="ob-updated right">Last updated a few seconds ago</p>

          <section className="ob-card ob-comments">
            <div className="ob-comments-head">
              <div className="ob-brand-title">
                <img src={ob.brandMark} alt="" width={32} height={32} />
                <div>
                  <h3>Brand’s comments</h3>
                  <p className="ob-muted">See your brand’s most engaging comments.</p>
                </div>
              </div>
              <div className="ob-comments-tools">
                <Menu icon={ob.sort} options={["Total Engagement", "Newest"]} value={sort} onChange={setSort} />
                <button className="ob-export" type="button" onClick={() => ping("Exported CSV")}>
                  <Icon src={ob.export} size={16} />
                  Export
                </button>
                <div className="ob-view">
                  <button type="button" className={view === "grid" ? "is-on" : ""} aria-label="Grid" onClick={() => setView("grid")}>
                    <Icon src={ob.grid} size={16} />
                  </button>
                  <button type="button" className={view === "list" ? "is-on" : ""} aria-label="List" onClick={() => setView("list")}>
                    <Icon src={ob.list} size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="ob-search">
              <Icon src={ob.search} size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search comments or paste post URL" />
              <span>{comments.length} comments</span>
            </div>
            <div className={`ob-grid${view === "list" ? " is-list" : ""}`}>
              {comments.map((card) => (
                <article className="ob-c-card" key={card.id}>
                  <div className="ob-thumb">
                    <img src={card.thumb} alt="" />
                    <button className="ob-ext" type="button" aria-label="Open post" onClick={() => ping("Opened post link")}>
                      <Icon src={ob.link} size={16} />
                    </button>
                    <p>{card.stamp}</p>
                  </div>
                  <div className="ob-c-body">
                    <div className="ob-c-meta">
                      <span>{card.date}</span>
                      <span className="ob-c-actions">
                        <span className="ob-mini-av" />
                        <button
                          type="button"
                          className={`ob-add${added.includes(card.id) ? " is-on" : ""}`}
                          onClick={() => {
                            setAdded((cur) => (cur.includes(card.id) ? cur.filter((id) => id !== card.id) : [...cur, card.id]));
                            ping(added.includes(card.id) ? "Removed from workflow" : "Added to workflow");
                          }}
                        >
                          <Icon src={ob.addPlus} size={12} />
                          {added.includes(card.id) ? "Added" : "Add"}
                        </button>
                      </span>
                    </div>
                    {card.photo ? <img className="ob-c-photo" src={card.photo} alt="" /> : <p className="ob-c-text">{card.text}</p>}
                    <div className="ob-c-metrics">
                      <span className="m-heart">
                        <Icon src={ob.metricHeart} size={14} />
                        {card.likes}
                      </span>
                      <span className="m-reply">
                        <Icon src={ob.metricReply} size={14} />
                        {card.replies}
                      </span>
                      <span className="m-eye">
                        <Icon src={ob.metricEye} size={14} />
                        {card.impressions}
                      </span>
                      <span className="m-emv">EMV {card.emv}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="ob-comments-foot">
              <p>
                <Icon src={ob.status} size={16} />
                Searching for comments in 33 uploaded links.{" "}
                <button type="button" onClick={() => ping("Status: 33 links processed")}>
                  View Status
                </button>
              </p>
              <button type="button" className="ob-see-all" onClick={() => setSeeAll((v) => !v)}>
                {seeAll ? "See less" : "See all"}
              </button>
            </div>
          </section>
          <div className="ob-note-row">
            <p>Note: Only comments ranking in the top 100 (as defined by channel platform) are processed.</p>
            <p>Last updated yesterday at 12pm</p>
          </div>

          <section className="ob-card">
            <div className="ob-lead-head">
              <div className="ob-lead-title">
                <span>👑</span>
                <div>
                  <h3>Community Leaderboard</h3>
                  <p className="ob-muted">Your community team’s leaderboard—measuring visibility, voice, and vibe.</p>
                </div>
              </div>
              <Menu icon={ob.topics} options={["All topics", "Hair", "Collab"]} value={topics} onChange={setTopics} label="Topics" />
            </div>
            <div className="ob-search">
              <Icon src={ob.search} size={16} />
              <input value={leadQuery} onChange={(e) => setLeadQuery(e.target.value)} placeholder="Search for community managers" />
            </div>
            <div className="ob-table-wrap">
              <table className="ob-table">
                <thead>
                  <tr>
                    {["Rank", "Name", "Total Engagement", "Average Engagement", "# posts commented on", "Max likes", "Posts", "Score"].map(
                      (col) => (
                        <th key={col}>
                          {col}
                          {col !== "Rank" && col !== "Name" && col !== "Posts" ? <Icon src={ob.sortCol} size={16} /> : null}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {leadRows.map((row) => (
                    <tr key={row.name}>
                      <td className={row.muted ? "is-mute" : ""}>{row.rank}</td>
                      <td className={row.muted ? "is-mute" : ""}>
                        {row.avatar ? (
                          <span className="ob-name">
                            <img src={row.avatar} alt="" width={24} height={24} />
                            {row.name}
                          </span>
                        ) : (
                          row.name
                        )}
                      </td>
                      <td>{row.total}</td>
                      <td>{row.avg}</td>
                      <td>{row.postsCommented}</td>
                      <td>{row.maxLikes}</td>
                      <td>
                        <span className="ob-mini-posts">
                          {row.posts.map((src) => (
                            <img key={src} src={src} alt="" />
                          ))}
                        </span>
                      </td>
                      <td>
                        {row.score ? <span className="ob-score">{row.score}</span> : <span className="is-mute">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <p className="ob-updated right">Last updated a day ago</p>
        </div>
      </div>

      <button className="ob-fab" type="button" onClick={() => ping("Add comment")}>
        <Icon src={ob.addPlus} size={24} />
        Add comment
      </button>
      {toast ? <p className="ob-toast">{toast}</p> : null}
    </div>
  );
}
