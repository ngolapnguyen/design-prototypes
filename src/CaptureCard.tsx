const file = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;
const IMAGES = [file("clip-2.png"), file("pick-image.png"), file("clip-3.png")];
const POSTS = Array.from({ length: 8 }, (_, index) => ({ id: `capture-${index}`, src: IMAGES[index % IMAGES.length] }));
const CAPTION = "A beauty creator names Victoria Beckham by Augustinus Bader The Foundation Drops as one of her top";

export function CaptureCard() {
  return (
    <article className="cc-card">
      <div className="cc-copy">
        <div className="cc-top">
          <span className="cc-chip">Unique Posts</span>
          <span className="cc-dot" aria-hidden="true">
            ·
          </span>
          <span className="cc-ago">4h ago</span>
          <div className="cc-actions">
            <button type="button" className="cc-btn">
              <img src={file("icon-sparkles.svg")} alt="" />
              Ask AI
            </button>
            <button type="button" className="cc-btn">
              <img src={file("icon-track.svg")} alt="" />
              Generate custom report
            </button>
          </div>
        </div>
        <h3>NYX Brow Glue: ‘Crazy Lift’ and Long-Lasting Hold</h3>
        <p className="cc-summary">
          Creators are showcasing the NYX The Brow Glue product, emphasizing its strong hold and ability to defy
          droopiness for lifted, laminated, and fluffy brows. The product is praised for its long-lasting performance,
          keeping brows styled in place all day, and its ease of application with the built-in brush.
        </p>
      </div>
      <div className="cc-strip" tabIndex={0} role="region" aria-label="Reference posts">
        {POSTS.map((post) => (
          <button key={post.id} type="button" className="cc-post">
            <img src={post.src} alt="" />
            <span className="cc-handle">@uhodom_edinym</span>
            <span className="cc-caption">{CAPTION}</span>
          </button>
        ))}
      </div>
    </article>
  );
}
