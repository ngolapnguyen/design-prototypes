import { useState, type ReactNode } from "react";
import { chatAssets } from "./chat-assets";
import { ChatIcon, Chip, Composer } from "./chat-ui";
import "./chat.css";

const ACTIONS = [
  { id: "topic", label: "Topic", icon: chatAssets.topic, placeholder: "Describe the topic you want to track…" },
  { id: "sourcing", label: "Creator Sourcing", icon: chatAssets.sourcing, placeholder: "Describe the creators you want…" },
  { id: "report", label: "Create a report", icon: chatAssets.report, placeholder: "Describe the report you want…" },
] as const;

const DEFAULT_PLACEHOLDER = "Ask a question, create a topic, build a report, or source creators...";

function NavIcon({ src, size, native }: { src: string; size: number; native?: { w: number; h: number } }) {
  if (native) {
    return (
      <span className="chat-insights-ico" style={{ width: size, height: size }}>
        <img src={src} alt="" width={native.w} height={native.h} />
      </span>
    );
  }
  return <ChatIcon src={src} size={size} />;
}

function NavRow({
  icon,
  label,
  active = false,
  extra,
  native,
}: {
  icon?: string;
  label: string;
  active?: boolean;
  extra?: ReactNode;
  native?: { w: number; h: number };
}) {
  return (
    <div className={`chat-insights-row${active ? " is-active" : ""}`}>
      <span className="chat-insights-row-main">
        {icon ? <NavIcon src={icon} size={16} native={native} /> : null}
        <span>{label}</span>
      </span>
      {extra}
    </div>
  );
}

export function InsightsNav() {
  return (
    <aside className="chat-insights-nav">
      <div className="chat-insights-nav-top">
        <div className="chat-insights-org">
          <span className="chat-insights-brand">
            <img src={chatAssets.brand} alt="" width={24} height={24} />
          </span>
          <span className="chat-insights-org-name">
            Anthropologie
            <ChatIcon src={chatAssets.caretDown} size={12} />
          </span>
          <span className="chat-insights-collapse">
            <ChatIcon src={chatAssets.sidebar} size={24} />
          </span>
        </div>

        <div className="chat-insights-create-wrap">
          <button className="chat-insights-create" type="button">
            Create
          </button>
        </div>

        <div className="chat-insights-group">
          <NavRow icon={chatAssets.notification} label="Notifications" />
          <NavRow icon={chatAssets.messages} label="Chat" active />
        </div>

        <img className="chat-insights-rule" src={chatAssets.navRule} alt="" />

        <div className="chat-insights-group">
          <NavRow icon={chatAssets.home} label="Home" />
          <NavRow icon={chatAssets.engagement} label="Engagement" />
          <NavRow icon={chatAssets.topics} label="Topics" />
          <NavRow icon={chatAssets.brandAnalytics} label="Brand Analytics" extra={<ChatIcon src={chatAssets.caretUp} size={16} />} />
          <div className="chat-insights-sub">
            <NavRow label="Owned" />
            <NavRow label="UGC" />
            <NavRow label="Sentiment" />
            <NavRow label="Topics" />
          </div>
          <NavRow icon={chatAssets.competitor} label="Competitor Analytics" />
          <NavRow icon={chatAssets.outbound} label="Outbound" />
          <NavRow icon={chatAssets.community} label="Community Hub" />
          <NavRow icon={chatAssets.sourcing} label="Creator Sourcing" />
        </div>

        <img className="chat-insights-rule" src={chatAssets.navRule} alt="" />

        <div className="chat-insights-group">
          <NavRow icon={chatAssets.trends} label="Trends" />
          <NavRow icon={chatAssets.juicebox} label="Creative Juicebox" native={{ w: 9.778, h: 14.667 }} />
        </div>

        <img className="chat-insights-rule" src={chatAssets.navRule} alt="" />

        <div className="chat-insights-group">
          <NavRow icon={chatAssets.bookmarks} label="Bookmarks" extra={<ChatIcon src={chatAssets.caretDown16} size={16} />} />
        </div>
      </div>

      <div className="chat-insights-profile">
        <div className="chat-insights-user">
          <img src={chatAssets.avatarRhea} alt="" width={24} height={24} />
          <div>
            <p>Rhea Mehta</p>
            <p>rhea@plot.so</p>
          </div>
        </div>
        <img className="chat-insights-profile-rule" src={chatAssets.profileRule} alt="" />
        <div className="chat-insights-settings">
          <span className="chat-insights-row-main">
            <ChatIcon src={chatAssets.settings} size={16} />
            <span>Settings</span>
          </span>
          <ChatIcon src={chatAssets.more} size={16} />
        </div>
      </div>
    </aside>
  );
}

export function ChatInsights() {
  const [draft, setDraft] = useState("");
  const [picked, setPicked] = useState<(typeof ACTIONS)[number]["id"] | null>(null);
  const placeholder = ACTIONS.find((action) => action.id === picked)?.placeholder ?? DEFAULT_PLACEHOLDER;

  return (
    <div className="chat-lab">
      <div className="chat-insights">
        <InsightsNav />
        <div className="chat-insights-main">
          <div className="chat-col is-compose">
            <div className="chat-hero">
              <div className="chat-insights-mark" aria-hidden="true">
                <span className="chat-insights-mark-disc">
                  <span className="chat-insights-mark-tilt">
                    <img src={chatAssets.juiceboxMark} alt="" width={24.5001} height={24} />
                  </span>
                </span>
                <span className="chat-insights-mark-edit">
                  <img src={chatAssets.editSm} alt="" width={12} height={12} />
                </span>
              </div>
              <h1>What insights are we after today?</h1>
              <div className="chat-insights-actions">
                {ACTIONS.map((action) => (
                  <Chip
                    key={action.id}
                    variant="action"
                    icon={action.icon}
                    label={action.label}
                    selected={picked === action.id}
                    onSelect={() => setPicked(picked === action.id ? null : action.id)}
                  />
                ))}
              </div>
              <Composer
                autoFocus
                value={draft}
                onChange={setDraft}
                onSubmit={() => setDraft("")}
                placeholder={placeholder}
                sendSize={24}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
