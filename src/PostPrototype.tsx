import { useEffect, useState } from "react";
import { assets } from "./assets";
import { CommentSummary } from "./CommentSummary";
import { Icon } from "./Icon";
import { SentimentScore } from "./SentimentScore";
import { posts, type PostId, type SentimentMode, type SummaryMode } from "./posts";

function CreatorMeta({ date, followers }: { date: string; followers: string }) {
  return (
    <div className="creator-row">
      <span className="avatar">
        <img src={assets.lululemon} alt="lululemon" width={20} height={20} />
      </span>
      <p className="handle">lululemon</p>
      <p className="dot">•</p>
      <span className="followers">
        <Icon src={assets.followers} size={12} />
        <p className="meta">{followers}</p>
      </span>
      <p className="date-meta">• {date}</p>
    </div>
  );
}

export function PostPrototype({
  postId,
  summaryMode,
  sentimentMode,
}: {
  postId: PostId;
  summaryMode: SummaryMode;
  sentimentMode: SentimentMode;
}) {
  const [tab, setTab] = useState<"post" | "creator" | "brand">("post");
  const [captionOpen, setCaptionOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setCaptionOpen(false);
    setSummaryOpen(false);
    setWhyOpen(false);
    setNote("");
    setNotes([]);
    setOpenThread(null);
    setTab("post");
    setSlide(0);
  }, [postId]);

  const post = posts[postId];
  const slides = post.slides ?? [];

  return (
    <>
      <main className="app">
        <aside className="media-col">
          <div className="media-shell">
            <div className={`player${post.media !== "video" ? " is-carousel" : ""}`}>
              <img
                className="player-frame"
                src={post.media === "carousel" ? slides[slide] : post.mediaSrc ?? assets.video}
                alt={post.media === "video" ? "lululemon video" : "lululemon post"}
                width={299}
                height={post.media === "video" ? 532 : 374}
              />
              <div className="player-top">
                <p className="player-date">{post.dateShort}</p>
                <div className="player-actions">
                  <Icon src={assets.tiktok} size={18} alt="TikTok" />
                  <button className="glass-btn" type="button" aria-label="Copy link">
                    <Icon src={assets.link} size={12} />
                  </button>
                  <button className="glass-btn" type="button" aria-label="Expand">
                    <Icon src={assets.expand} size={12} />
                  </button>
                </div>
              </div>
              {post.media === "carousel" ? (
                <>
                  {slide < slides.length - 1 ? (
                    <button
                      className="carousel-next"
                      type="button"
                      aria-label="Next slide"
                      onClick={() => setSlide((current) => Math.min(current + 1, slides.length - 1))}
                    >
                      <Icon src={assets.carouselNext} size={36} />
                    </button>
                  ) : null}
                  {slide > 0 ? (
                    <button
                      className="carousel-prev"
                      type="button"
                      aria-label="Previous slide"
                      onClick={() => setSlide((current) => Math.max(current - 1, 0))}
                    >
                      <Icon src={assets.carouselNext} size={36} />
                    </button>
                  ) : null}
                  <div className="carousel-dots" aria-hidden="true">
                    {slides.map((_, index) => (
                      <span key={index} className={index === slide ? "is-active" : ""} />
                    ))}
                  </div>
                </>
              ) : post.media === "video" ? (
                <>
                  <div className="progress" aria-hidden="true">
                    <span />
                  </div>
                  <div className="player-controls">
                    <div className="control-group">
                      <button type="button" aria-label="Play">
                        <Icon src={assets.play} size={24} />
                      </button>
                      <button type="button" aria-label="Back 5 seconds">
                        <Icon src={assets.back} size={24} />
                      </button>
                      <button type="button" aria-label="Forward 5 seconds">
                        <Icon src={assets.fwd} size={24} />
                      </button>
                    </div>
                    <p className="time-label">{post.duration ?? "00:00 / 00:44"}</p>
                    <div className="control-group">
                      <button type="button" aria-label="Volume">
                        <Icon src={assets.volume} size={24} />
                      </button>
                      <span className="speed">
                        1x
                        <Icon src={assets.caret} size={10} />
                      </span>
                      <button type="button" aria-label="Fullscreen">
                        <Icon src={assets.fullscreen} size={24} />
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <CreatorMeta date={post.dateLong} followers={post.followers} />
          </div>
        </aside>

        <section className="insights">
          <div className="tabs" role="tablist">
            {(
              [
                ["post", "🔮", "Post"],
                ["creator", "🧑‍🎨", "Creator"],
                ["brand", "💼", "Brand Activity"],
              ] as const
            ).map(([id, emoji, label]) => (
              <button
                key={id}
                className={`tab${tab === id ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
              >
                <span className="tab-emoji">{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {tab === "post" ? (
            <div className="stack">
              <article className="card">
                {post.overview ? (
                  <div className="overview-banner">
                    <p className="community-chip">{post.community}</p>
                    <p className="overview-copy">{post.overview}</p>
                  </div>
                ) : null}
                <h2 className="section-title">Caption</h2>
                <div className="caption-body">
                  <img
                    className="product-thumb"
                    src={post.thumb ?? assets.productThumb}
                    alt=""
                    width={66}
                    height={90}
                  />
                  <div className="caption-copy">
                    <CreatorMeta date={post.dateLong} followers={post.followers} />
                    {post.captionSegments ? (
                      <>
                        <p className={`caption-text${captionOpen ? "" : " clamp"}`}>
                          {post.captionSegments.map((segment, index) =>
                            segment.mention ? (
                              <span className="mention" key={`${segment.text}-${index}`}>
                                {segment.text}
                              </span>
                            ) : (
                              <span key={`${segment.text}-${index}`}>{segment.text}</span>
                            ),
                          )}
                        </p>
                        <button className="see-more" type="button" onClick={() => setCaptionOpen((v) => !v)}>
                          {captionOpen ? "See less" : "See more"}
                        </button>
                      </>
                    ) : post.captionText ? (
                      <p className="caption-text">{post.captionText}</p>
                    ) : (
                      <>
                        <p className={`caption-text${captionOpen ? "" : " clamp"}`}>
                          {post.captionLead}
                          <span className="mention">{post.mentions[0]}</span>
                          {post.captionMid}
                          <span className="mention">{post.mentions[1]}</span>
                          {post.mentions[2] ? (
                            <>
                              {" kit "}
                              <span className="mention">{post.mentions[2]}</span>
                              {" Enliven™ Makeup Brush & Sponge Cleaner"}
                            </>
                          ) : (
                            " 7-Piece Beginner Makeup Kit."
                          )}
                        </p>
                        <button className="see-more" type="button" onClick={() => setCaptionOpen((v) => !v)}>
                          {captionOpen ? "See less" : "See more"}
                        </button>
                      </>
                    )}
                    {post.brands.length ? (
                      <>
                        <hr className="divider" />
                        <div className="brand-tags">
                          {post.brands.map((brand) => (
                            <span className="brand-tag" key={brand}>
                              <Icon src={assets.brand} size={18} />
                              {brand}
                              <Icon src={assets.verified} size={18} />
                            </span>
                          ))}
                        </div>
                      </>
                    ) : null}
                    <hr className="divider" />
                    <div className="metrics">
                      {post.metrics.map((metric) => (
                        <span className="metric" key={metric.label} title={metric.label}>
                          <Icon src={metric.icon} size={18} />
                          {metric.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="why-link" type="button" onClick={() => setWhyOpen((v) => !v)}>
                  Why am I seeing this post?
                  <Icon src={assets.chevron} size={18} />
                </button>
                {whyOpen ? (
                  <p className="why-panel">
                    This post was surfaced because it matches {post.community} conversation
                    {post.brands.length ? ` and tags ${post.brands.join(" and ")}` : ""}.
                  </p>
                ) : null}
              </article>

              <article className="card">
                <h2 className="section-title">Post Summary</h2>
                <div className="summary-block">
                  <p className={`summary-text${summaryOpen ? "" : " clamp"}`}>{post.postSummary}</p>
                  <button className="see-more" type="button" onClick={() => setSummaryOpen((v) => !v)}>
                    {summaryOpen ? "See less" : "See more"}
                  </button>
                </div>
              </article>

              <article className="card comment-card">
                <div className="comment-head">
                  <div>
                    <h2 className="section-title">Comment Summary</h2>
                    <p className="comment-meta">
                      {post.commentCount} comments, {post.pulled}
                    </p>
                  </div>
                  {sentimentMode === "score" ? (
                    <SentimentScore
                      score={post.score}
                      mode={sentimentMode}
                      sentiment={post.sentiment}
                      tone={post.scoreTone}
                    />
                  ) : null}
                  {summaryMode === "themes" && sentimentMode === "chart" ? (
                    <span className="comment-refresh-wrap">
                      <button
                        className="comment-refresh"
                        type="button"
                        aria-label="Refresh"
                        aria-describedby="comment-refresh-tip"
                      >
                        <Icon src={assets.refresh} size={16} />
                      </button>
                      <span className="comment-refresh-tip" id="comment-refresh-tip" role="tooltip">
                        Click refresh for the latest{" "}
                        <span className="comment-refresh-tip-end">comment data.</span>
                      </span>
                    </span>
                  ) : null}
                </div>
                {sentimentMode === "chart" ? (
                  <SentimentScore
                    score={post.score}
                    mode={sentimentMode}
                    sentiment={post.sentiment}
                    tone={post.scoreTone}
                  />
                ) : null}
                <CommentSummary
                  post={post}
                  mode={summaryMode}
                  openThread={openThread}
                  onOpen={setOpenThread}
                  onClose={() => setOpenThread(null)}
                />
              </article>

              <article className="card tight">
                <h2 className="section-title">Top Comments</h2>
                <div className="comments">
                  {post.comments.map((comment, index) => (
                    <div className="comment" key={`${comment.name}-${index}`}>
                      <span className="comment-avatar">
                        <img src={comment.avatar} alt="" width={24} height={24} />
                      </span>
                      <div className="comment-body">
                        <div className="comment-who">
                          {comment.name ? <p className="comment-name">{comment.name}</p> : null}
                          <p className="comment-time">{comment.time}</p>
                        </div>
                        {comment.text ? <p className="comment-text">{comment.text}</p> : null}
                        {comment.image ? (
                          <img className="comment-photo" src={comment.image} alt="Comment attachment" width={120} height={120} />
                        ) : null}
                        <p className="comment-likes">{comment.likes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {post.transcript.length ? (
                <article className="card">
                  <h2 className="section-title">Transcript</h2>
                  <div className="transcript">
                    <div className="speaker">
                      <span className="speaker-index">1</span>
                      <p className="speaker-name">Speaker Creator</p>
                    </div>
                    {post.transcript.map((line, index) => (
                      <div className="line" key={`${line.time}-${index}`}>
                        <p className="timestamp">{line.time}</p>
                        <p>{line.text}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}

              <article className="card">
                <h2 className="section-title">Activity & notes</h2>
                <div className="note-box">
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add a note to this post (this will be visible to your team)"
                  />
                  <div className="note-actions">
                    <button
                      className={`add-note${note.trim() ? " enabled" : ""}`}
                      type="button"
                      disabled={!note.trim()}
                      onClick={() => {
                        setNotes((current) => [note.trim(), ...current]);
                        setNote("");
                      }}
                    >
                      Add note
                    </button>
                  </div>
                </div>
                {notes.length === 0 ? (
                  <p className="empty-activity">No activity yet. Add a note to keep your team in the loop.</p>
                ) : (
                  notes.map((item) => (
                    <p className="summary-text" key={item}>
                      {item}
                    </p>
                  ))
                )}
              </article>
            </div>
          ) : (
            <article className="card placeholder-card">
              <h2 className="section-title">{tab === "creator" ? "Creator" : "Brand Activity"}</h2>
              <p>{tab === "creator" ? "Creator insights are not in this frame." : "Brand activity is not in this frame."}</p>
            </article>
          )}
        </section>
      </main>
    </>
  );
}
