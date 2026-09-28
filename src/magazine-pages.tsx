import type { ReactNode } from "react";
import { mag } from "./magazine-html-assets";
import "./magazine-pages.css";

function Footer() {
  return (
    <footer className="mag-footer">
      <img src={mag.logo} alt="" width={14} height={15} />
      <p>Data powered by Plot video intelligence</p>
    </footer>
  );
}

function Sheet({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="mag-sheet" aria-label={label}>
      {children}
      <Footer />
    </article>
  );
}

export function CoverPage() {
  return (
    <Sheet label="Cover: Spotted in Plot, Back to School, Issue No. 1">
      <p className="mag-kicker">Spotted in Plot</p>
      <p className="mag-issue">Issue No. 1</p>
      <h1 className="mag-display mag-cover-title">Back to School</h1>
      <div className="mag-hero">
        <img className="mag-hero-photo" src={mag.coverHero} alt="Friends sitting together on a lawn, printed in a pink halftone" />
        <div className="mag-callout" style={{ left: 24, top: 132 }}>
          <p className="mag-tag">
            <strong>Rare Beauty</strong>
            <span>Soft Pinch Blush</span>
          </p>
          <img src={mag.blush} alt="Rare Beauty Soft Pinch Liquid Blush bottle" width={36} height={128} />
        </div>
        <div className="mag-callout" style={{ left: 148, top: 28 }}>
          <p className="mag-tag">
            <strong>Starface</strong>
            <span>Pimple Patches</span>
          </p>
          <img src={mag.starface} alt="Starface pimple patch packaging" width={64} height={108} />
        </div>
        <div className="mag-callout" style={{ right: 28, top: 36, alignItems: "center" }}>
          <p className="mag-tag">
            <strong>Edikted</strong>
            <span>Corset Top</span>
          </p>
          <img src={mag.edikted} alt="Red Edikted corset top" width={120} height={100} />
        </div>
        <div className="mag-callout" style={{ left: 196, bottom: 16, alignItems: "center" }}>
          <p className="mag-tag">
            <strong>Apple</strong>
            <span>iPhone 17 Pro</span>
          </p>
          <img src={mag.iphone} alt="White iPhone 17 Pro" width={120} height={120} />
        </div>
        <div className="mag-callout" style={{ right: 20, bottom: 20, alignItems: "center" }}>
          <p className="mag-tag">
            <strong>Adidas</strong>
            <span>Samba</span>
          </p>
          <img src={mag.adidas} alt="Adidas Samba sneakers" width={120} height={72} />
        </div>
      </div>
    </Sheet>
  );
}

export function Page1() {
  return (
    <Sheet label="Page 1: What is Plot?">
      <div className="mag-stack">
        <h1 style={{ fontSize: 54 }}>What is Plot?</h1>
        <figure style={{ margin: 0, maxWidth: 326 }}>
          <img
            className="mag-photo"
            src={mag.coverHero}
            alt="The Plot team sitting together on a couch in a bright office"
            style={{ height: 204 }}
          />
          <figcaption className="mag-caption">
            A tool built by social media marketers, made for social media marketers.
          </figcaption>
        </figure>
        <p className="mag-body" style={{ maxWidth: 407, marginLeft: "auto" }}>
          Plot is a video-first social listening and analytics platform that helps brands understand how
          they’re talked about, shown, and perceived across social media. It analyzes the full context of
          video — visuals, audio, and on-screen text — to catch brand mentions and product usage even when
          creators don’t tag the brand (up to 80% of mentions go untagged), giving brands visibility into
          earned media, sentiment, trends, and creator activity in near real time.
        </p>
      </div>
    </Sheet>
  );
}

export function Page2() {
  return (
    <Sheet label="Page 2: A Note From the Creator">
      <div className="mag-split">
        <h1 style={{ fontSize: 48, maxWidth: 300 }}>A Note From the Creator</h1>
        <img className="mag-photo" src={mag.creator} alt="Portrait of the creator" style={{ height: 244 }} />
      </div>
      <div className="mag-stack" style={{ marginTop: 20, maxWidth: 313 }}>
        <p className="mag-body">
          Built from 66K+ posts with product-level detail pulled straight from video, from specific SKUs
          like Rare Beauty’s Soft Pinch Blush to the Stanley vs. Owala rivalry.
        </p>
        <p className="mag-body">
          It maps well to use cases like trend spotting, since it catches shifts like the wide-leg jean
          takeover or Buldak ramen’s social-driven rise early; and brand and competitive benchmarking,
          showing which brands actually show up in culture.
        </p>
      </div>
      <section className="mag-stack" style={{ marginTop: 36 }} aria-labelledby="platform-dist">
        <h2 className="mag-h2" id="platform-dist">
          Platform Distribution: Gen Z Women’s Back-to-School Posts
        </h2>
        <div className="mag-chart">
          <div className="mag-bar-row">
            <p className="mag-bar-label">76.2% TikTok</p>
            <div className="mag-bar is-tiktok" />
          </div>
          <div className="mag-bar-row">
            <p className="mag-bar-label">19.6% Instagram</p>
            <div className="mag-bar is-ig" />
          </div>
          <div className="mag-bar-row">
            <p className="mag-bar-label">4.3% YouTube</p>
            <div className="mag-bar is-yt" />
          </div>
        </div>
        <p className="mag-body" style={{ maxWidth: 280 }}>
          TikTok dominates at 76.2% of all 50,000 Gen Z women’s back-to-school posts, followed by Instagram
          (19.6%) and YouTube (4.3%).
        </p>
      </section>
    </Sheet>
  );
}

export function Page3() {
  return (
    <Sheet label="Page 3: Trends in Fashion">
      <div className="mag-stack">
        <h1 style={{ fontSize: 48 }}>Trends in Fashion</h1>
        <p className="mag-body" style={{ maxWidth: 360 }}>
          <span className="mag-display" style={{ fontSize: 28, marginRight: 6 }}>
            1
          </span>
          She doesn’t have a back-to-school outfit. She has a closet of alter egos, and the data backs it
          up.
        </p>
        <p className="mag-body" style={{ maxWidth: 360 }}>
          Skinny jeans are dead, again, this time for good and the wide-leg replacement has receipts: 9,382
          apparel mentions pulled from 42,646 posts, plus a close read of 200 of them to figure out not just
          what she’s buying, but why. The uniform isn’t one outfit. It’s five of them, on rotation,
          depending on whether she’s headed to lecture, rush, or the group chat’s 9pm plan.
        </p>
        <div className="mag-grid-3">
          {[
            [mag.ediktedTile, "Edikted"],
            [mag.alo, "Alo Yoga"],
            [mag.oldNavy, "Old Navy"],
            [mag.lulu, "Lululemon"],
            [mag.edikted, "Hollister"],
            [mag.adidas, "Brandy Melville"],
          ].map(([src, name]) => (
            <div key={name} className="mag-tile" style={{ height: 168 }}>
              <img src={src} alt="" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

export function Page4() {
  const trends = [
    {
      title: "The Casual Comfort Uniform",
      img: mag.oldNavy,
      body: "The skinny jean is officially retired. Across 9,382 apparel mentions, wide-leg and barrel silhouettes are the new default, worn with a plain top and sneakers. In 2026 the actual faux pas is looking like you tried.",
    },
    {
      title: "Context-Driven Dressing",
      img: mag.ediktedTile,
      body: "There’s no back-to-school look anymore, there’s a rotation. The lecture fit, the rush fit, the 9pm fit. Edikted alone pulled 710 mentions, which is a lot of going-out tops for a Tuesday.",
    },
    {
      title: "Sorority Rush as a Fashion Micro-Season",
      img: mag.starface,
      body: "Rush week is Gen Z’s actual runway. Multiple outfits a day, coordinated down to the accessory, for one week a year. It’s the most concentrated purchasing event in the entire dataset.",
    },
    {
      title: "Athleisure for Everything",
      img: mag.lulu,
      body: "The leggings never came off. Lululemon, Alo, and Aerie combine for 1,660 mentions — more than any single brand except SHEIN.",
    },
    {
      title: "Pink as a Cross-Aesthetic Power Color",
      img: mag.adidas,
      body: "Pink holds across backpacks, rush outfits, dorm walls and everyday basics. Coquette never left, it just enrolled in college.",
    },
  ];

  return (
    <Sheet label="Page 4: Five fashion trends">
      <div className="mag-stack" style={{ gap: 18 }}>
        {trends.map((trend) => (
          <section key={trend.title} className="mag-trend">
            <img src={trend.img} alt="" />
            <div>
              <h2 className="mag-h2">{trend.title}</h2>
              <p className="mag-body" style={{ marginTop: 8 }}>
                {trend.body}
              </p>
            </div>
          </section>
        ))}
        <aside className="mag-quote">
          <div>
            <img src={mag.researcher} alt="Gen Z researcher" />
            <p className="mag-caption">Gen Z Researcher</p>
          </div>
          <blockquote className="mag-body" style={{ margin: 0 }}>
            <p>
              The uniform isn’t one outfit. It’s five of them, on rotation, depending on whether she’s
              headed to lecture, rush, or the group chat’s 9pm plan.
            </p>
            <footer style={{ marginTop: 10 }}>Casey Lewis</footer>
          </blockquote>
        </aside>
      </div>
    </Sheet>
  );
}

export function Page5() {
  return (
    <Sheet label="Page 5: Rare Beauty’s Commanding Position">
      <div className="mag-stack">
        <h1 className="mag-display" style={{ fontSize: 42, maxWidth: 360 }}>
          Rare Beauty’s Commanding Position.
        </h1>
        <h2 className="mag-h2">Soft Pinch Liquid Blush</h2>
        <p className="mag-body" style={{ maxWidth: 360 }}>
          There is no makeup conversation happening right now that isn’t, at some level, about Rare Beauty
          with a blush that’s 5x more famous than all other mentions. Maybelline is the closest competitor,
          not even in the same weight class. Charlotte Tilbury, NYX, and Fenty round out the top five like
          clockwork on repeat.
        </p>
        <img
          src={mag.blush}
          alt="Rare Beauty Soft Pinch Liquid Blush"
          style={{ width: 80, height: 280, objectFit: "contain", margin: "24px auto 0" }}
        />
      </div>
    </Sheet>
  );
}

export function Page6() {
  return (
    <Sheet label="Page 6: More in makeup">
      <div style={{ display: "grid", gridTemplateColumns: "194px 1fr", gap: 20 }}>
        <h1 className="mag-display" style={{ fontSize: 42 }}>
          More in makeup
        </h1>
        <p className="mag-body">
          Gen Z’s back-to-school face takes five to seven products and is engineered to look like none of
          them. Skin tint, concealer, cream bronzer, liquid blush, mascara, setting spray, in that order,
          every time. The format shift is the actual story: powder is out, everything is liquid or cream,
          and the whole routine is built to sit in the skin instead of on top of it.
        </p>
      </div>
      <section className="mag-stack" style={{ marginTop: 28 }} aria-labelledby="where-buy">
        <h2 className="mag-h2" id="where-buy">
          When does Gen-Z buy their makeup?
        </h2>
        <div className="mag-chart">
          <div className="mag-bar-row">
            <p className="mag-bar-label">47% Target</p>
            <div className="mag-bar is-tiktok" />
          </div>
          <div className="mag-bar-row">
            <p className="mag-bar-label">35% Amazon</p>
            <div className="mag-bar is-ig" style={{ width: "74%" }} />
          </div>
          <div className="mag-bar-row">
            <p className="mag-bar-label">18% Sephora</p>
            <div className="mag-bar is-yt" style={{ width: "38%" }} />
          </div>
        </div>
        <p className="mag-body">
          Target is named nearly 3x as often as Sephora and shows up in more Gen Z men’s makeup posts than
          women’s. Just outside the top three: Ulta, and the Dollar Tree and Five Below tier, which is
          real, growing, and skews male.
        </p>
        <p className="mag-body">
          Fun fact: blush is the undisputed hero category of Gen Z back-to-school beauty. Saie is the
          fastest rising brand in the dataset, with 163% week-over-week growth.
        </p>
        <p className="mag-body">
          The pattern is clear: Gen Z women build their routines around a liquid/cream-forward, glow-first
          approach. Powder products are notably rare.
        </p>
      </section>
    </Sheet>
  );
}

export function Page7() {
  return (
    <Sheet label="Page 7: What’s in the Emergency Kit?">
      <div className="mag-stack">
        <h1 style={{ fontSize: 42 }}>
          What’s in the <span className="mag-display">Emergency Kit?</span>
        </h1>
        <p className="mag-body">
          Somewhere along the way “in case of emergency” stopped meaning a broken bone and started meaning
          smudged concealer three minutes before class. More than 60,000 back-to-school posts are dedicated
          to packing the pouch, then unpacking it on camera. Here’s everything that made the cut.
        </p>
        <p className="mag-body">
          <strong>Emergency kits</strong> — +90% vs preceding year, according to Google Trends.
        </p>
        <h2 className="mag-h2">Also in the pouch</h2>
        <ul className="mag-list">
          <li>Dove Deodorant</li>
          <li>Touchland Sanitizer</li>
          <li>Tide-to-go Stick</li>
          <li>Sol de Janeiro Body Spray</li>
          <li>Crystals for exam luck via #crystaltok, and a fidget bag packed for focus rather than fun.</li>
        </ul>
        <p className="mag-body">
          @theglowwwupdiary: “$20 DIY back to school emergency kit at Walmart”
        </p>
        <p className="mag-body">
          @CharmedatHome: “Packing a school emergency kit for my daughter”
        </p>
      </div>
    </Sheet>
  );
}

export function Page8() {
  return (
    <Sheet label="Page 8: The war of the water bottles">
      <div className="mag-stack">
        <h1 className="mag-display" style={{ fontSize: 42 }}>
          The war of the water bottles.
        </h1>
        <p className="mag-body">
          Nobody says “my Yeti” the way they say “my Stanley” — most water bottle mentions are generic,
          brand-only, no model attached. But two brands broke through, and they’re locked in the closest
          race in this entire report.
        </p>
        <ul className="mag-list">
          <li>Owala FreeSip</li>
          <li>Stanley Quencher</li>
        </ul>
        <p className="mag-body">
          Creators keep asking the same question: are you team Stanley or team Owala?
        </p>
      </div>
    </Sheet>
  );
}

export function Page9() {
  return (
    <Sheet label="Page 9: All 4 food groups that you see at lunchtime">
      <div className="mag-stack">
        <h1 className="mag-display" style={{ fontSize: 40 }}>
          All 4 food groups that you see at lunchtime.
        </h1>
        <p className="mag-body">
          But, what’s actually for lunch? We drew from 64,461+ posts across all four segments, with 4,622
          distinct food, snack, and beverage product entries detected.
        </p>
        <section>
          <h2 className="mag-h2">Beverages</h2>
          <ul className="mag-list">
            <li>Starbucks Frappuccino</li>
            <li>Coca-Cola</li>
            <li>Gatorade</li>
          </ul>
        </section>
        <section>
          <h2 className="mag-h2">Energy & Sports Drinks</h2>
          <ul className="mag-list">
            <li>Red Bull</li>
            <li>Alani Nu</li>
          </ul>
        </section>
        <section>
          <h2 className="mag-h2">Meals & Fast Food</h2>
          <ul className="mag-list">
            <li>Chick-fil-A</li>
            <li>McDonald’s</li>
            <li>Cheez-It</li>
          </ul>
        </section>
      </div>
    </Sheet>
  );
}

export function Page10() {
  return (
    <Sheet label="Page 10: What’s actually in the lunchbox">
      <div className="mag-stack">
        <h1 style={{ fontSize: 36 }}>What’s actually in the lunchbox?</h1>
        <p className="mag-body">
          We drew from 64,461+ posts across all four segments, with 4,622 distinct food, snack, and
          beverage product entries detected. The lunchbox is less a meal than a rotation of branded
          snacks, campus staples, and drinks that double as accessories.
        </p>
      </div>
    </Sheet>
  );
}

export function Page11() {
  return (
    <Sheet label="Page 11: Who are 2026’s top back-to-school creators?">
      <div className="mag-stack">
        <h1 className="mag-display" style={{ fontSize: 36 }}>
          Who are 2026’s top back-to-school creators?
        </h1>
        <p className="mag-body">
          Plot offers an AI-powered Creator Sourcing feature that lets marketing teams find relevant
          influencers and advocates using natural language prompts rather than basic keyword filters.
        </p>
        <section>
          <h2 className="mag-h2">lounaa777_</h2>
          <p className="mag-body">
            A France-based streetwear and fashion creator in the 18–24 age group on TikTok, sharing daily
            fit checks, styling ideas, and lifestyle clips.
          </p>
        </section>
        <section>
          <h2 className="mag-h2">michelle.autumnn</h2>
          <p className="mag-body">
            A US-based TikTok fashion creator (~353k followers) who frequently shares back-to-school
            styling hauls and campus outfit inspiration for brands like SKIMS, Hollister, and Forever 21.
          </p>
        </section>
        <section>
          <h2 className="mag-h2">momopill</h2>
          <p className="mag-body">
            A US-based TikTok creator who regularly shares personal storytimes and commentary on high
            school experiences.
          </p>
        </section>
      </div>
    </Sheet>
  );
}

export function Page12() {
  return (
    <Sheet label="Page 12: More back-to-school creators">
      <div className="mag-stack">
        <section>
          <h2 className="mag-h2">notisaiahwitika</h2>
          <p className="mag-body">
            A New Zealand-based comedy and lifestyle creator in the 18–24 age group who produces relatable
            short-form skits about school, family dynamics, and daily routines.
          </p>
        </section>
        <section>
          <h2 className="mag-h2">freda.xxr</h2>
          <p className="mag-body">
            A Germany-based TikTok fashion creator with ~27k followers who regularly shares back-to-school
            outfits and streetwear fit checks.
          </p>
        </section>
        <section>
          <h2 className="mag-h2">danakowalski</h2>
          <p className="mag-body">
            A US-based TikTok creator with ~863k followers who creates relatable Gen Z comedy and shares
            content about school starting.
          </p>
        </section>
      </div>
    </Sheet>
  );
}

export function Page14() {
  return (
    <Sheet label="Page 14: Thank you">
      <div className="mag-centerpiece">
        <p className="mag-muted" style={{ fontFamily: "var(--font-magazine)", fontSize: 28 }}>
          Crossword
        </p>
        <h1 style={{ fontSize: 48, marginTop: 80 }}>Thank you</h1>
      </div>
    </Sheet>
  );
}

export function Page15() {
  return (
    <Sheet label="Back cover">
      <div className="mag-centerpiece">
        <h1 style={{ fontSize: 36, letterSpacing: "0.08em" }}>BACK COVER</h1>
        <p className="mag-body" style={{ marginTop: 16, fontSize: 18, fontFamily: "var(--font-magazine)" }}>
          End call to action
        </p>
      </div>
    </Sheet>
  );
}

export const magazineLeaves = [
  { id: "cover", front: <CoverPage />, back: <Page1 /> },
  { id: "l1", front: <Page2 />, back: <Page3 /> },
  { id: "l2", front: <Page4 />, back: <Page5 /> },
  { id: "l3", front: <Page6 />, back: <Page7 /> },
  { id: "l4", front: <Page8 />, back: <Page9 /> },
  { id: "l5", front: <Page10 />, back: <Page11 /> },
  { id: "l6", front: <Page12 />, back: <Page14 /> },
  { id: "l7", front: <Page15 />, back: null },
];
