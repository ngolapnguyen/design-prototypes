import { useMemo, type ReactNode } from "react";
import "./theme-textures.css";

const file = (path: string) => `${import.meta.env.BASE_URL}assets/newsfeed/${path}`;
const PREVIEW_POSTS = [file("pick-image.png"), file("clip-2.png"), file("clip-3.png")];

export type TextureId =
  | "stipple"
  | "watercolor"
  | "watercolor-stipple"
  | "stripes"
  | "camo"
  | "glow"
  | "wash"
  | "halftone"
  | "grain"
  | "scribble"
  | "confetti"
  | "bleed";

export const TEXTURES: { id: TextureId; name: string; note: string }[] = [
  { id: "stipple", name: "Stipple burst", note: "Sprayed maroon specks that break out from behind the posts, like the Figma card." },
  { id: "watercolor", name: "Pink watercolor", note: "Mottled, uneven pink with grain, from Figma 2884:41615." },
  { id: "stripes", name: "Stipple stripes", note: "Diagonal maroon speckle bands on lilac, from the “Never miss a mention” slide (2884:40500)." },
  { id: "camo", name: "Blob camo", note: "Maroon blobs on lilac, the other panel on that slide." },
  { id: "glow", name: "Pink glow", note: "A soft pink beam cutting across behind the posts, from Figma 2902:45918." },
  { id: "halftone", name: "Halftone fade", note: "Print dots that shrink toward the copy side, so the posts carry the weight." },
  { id: "bleed", name: "Sky bleed", note: "White melting into sage and blue, with soft wisps where the colors meet." },
  { id: "grain", name: "Paper grain", note: "Fine noise tinted pink. Quiet enough to sit behind every theme." },
];

const W = 640;
const H = 450;

function random(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Cluster = { x: number; y: number; r: number; count: number };

function specks(seed: number, clusters: Cluster[], color: string, opacity = 1) {
  const next = random(seed);
  const dots: ReactNode[] = [];
  clusters.forEach((cluster, c) => {
    for (let i = 0; i < cluster.count; i += 1) {
      const angle = next() * Math.PI * 2;
      const distance = cluster.r * Math.sqrt(-2 * Math.log(1 - next() * 0.98)) * 0.55;
      const x = cluster.x + Math.cos(angle) * distance * 1.35;
      const y = cluster.y + Math.sin(angle) * distance;
      const size = 0.7 + next() * next() * 2.6;
      dots.push(<circle key={`${c}-${i}`} cx={x} cy={y} r={size} fill={color} opacity={opacity * (0.55 + next() * 0.45)} />);
    }
  });
  return dots;
}

const STIPPLE: Cluster[] = [
  { x: 180, y: 20, r: 90, count: 950 },
  { x: 560, y: 30, r: 100, count: 1000 },
  { x: 25, y: 250, r: 80, count: 700 },
  { x: 600, y: 420, r: 110, count: 1100 },
  { x: 330, y: 440, r: 80, count: 650 },
];

const WASH: Cluster[] = [
  { x: 120, y: 0, r: 70, count: 360 },
  { x: 460, y: 10, r: 90, count: 420 },
];

function Stipple({ seed }: { seed: number }) {
  return <>{specks(seed, STIPPLE, "#8a1c44")}</>;
}

function Watercolor({ seed }: { seed: number }) {
  return (
    <>
      <filter id={`water-${seed}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed={seed} result="blots" />
        <feColorMatrix
          in="blots"
          values="0 0 0 0 0.93  0 0 0 0 0.62  0 0 0 0 0.75  0 0 0 1.6 -0.55"
          result="pink"
        />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed + 1} result="fine" />
        <feColorMatrix in="fine" values="0 0 0 0 0.75  0 0 0 0 0.35  0 0 0 0 0.5  0 0 0 0.35 -0.1" result="grain" />
        <feMerge>
          <feMergeNode in="pink" />
          <feMergeNode in="grain" />
        </feMerge>
      </filter>
      <rect width={W} height={H} fill="#f8dbe5" />
      <rect width={W} height={H} filter={`url(#water-${seed})`} />
    </>
  );
}

const TOP_EDGE: Cluster[] = [
  { x: 90, y: 0, r: 90, count: 800 },
  { x: 330, y: -10, r: 80, count: 650 },
  { x: 580, y: 10, r: 100, count: 900 },
];

function WatercolorStipple({ seed }: { seed: number }) {
  return (
    <>
      <Watercolor seed={seed} />
      {specks(seed + 9, TOP_EDGE, "#7a0f38")}
    </>
  );
}

function wavyBands(w: number, h: number, ink: string, seed: number, scale = 1) {
  const next = random(seed);
  const dots: ReactNode[] = [];
  const slope = 0.3;
  const thick = 74 * scale;
  const gap = 136 * scale;
  const spacing = 3.9 * scale;
  for (let y0 = -slope * w - thick; y0 < h + thick; y0 += gap) {
    const phase = next() * Math.PI * 2;
    const wave = (14 + next() * 12) * scale;
    const freq = (0.006 + next() * 0.004) / scale;
    const swell = next() * Math.PI * 2;
    const count = Math.round(((w + 40) * thick) / (spacing * spacing));
    for (let i = 0; i < count; i += 1) {
      const x = -20 + next() * (w + 40);
      const center = y0 + slope * x + Math.sin(x * freq + phase) * wave;
      const half = (thick / 2) * (0.75 + 0.35 * Math.sin(x * freq * 1.7 + swell));
      const across = (next() * 2 - 1) * half * (next() < 0.12 ? 1.25 : 1);
      dots.push(
        <circle
          key={`${Math.round(y0)}-${i}`}
          cx={x}
          cy={center + across}
          r={(0.95 + next() * 0.7) * scale}
          fill={ink}
          opacity={0.75 + next() * 0.25}
        />,
      );
    }
  }
  return dots;
}

function Stripes({ seed }: { seed: number }) {
  return (
    <>
      <rect width={W} height={H} fill="#efc9f1" />
      {wavyBands(W, H, "#7a0f38", seed, 1.2)}
    </>
  );
}

function Camo({ seed }: { seed: number }) {
  return (
    <>
      <filter id={`camo-${seed}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="3" seed={seed} result="noise" />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0.48  0 0 0 0 0.06  0 0 0 0 0.22  0 0 0 -24 11.6"
          result="blobs"
        />
        <feTurbulence type="turbulence" baseFrequency="0.25" numOctaves="1" seed={seed + 3} result="rough" />
        <feDisplacementMap in="blobs" in2="rough" scale="7" />
      </filter>
      <rect width={W} height={H} fill="#dca6dc" />
      <rect width={W} height={H} filter={`url(#camo-${seed})`} />
    </>
  );
}

function Glow({ seed }: { seed: number }) {
  return (
    <>
      <defs>
        <linearGradient id={`glow-${seed}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#f6c4d6" stopOpacity="0" />
          <stop offset="0.35" stopColor="#f3bcd0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#efb1c8" stopOpacity="0.6" />
        </linearGradient>
        <filter id={`glow-blur-${seed}`}>
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="#f9f9f9" />
      <polygon
        points={`40,-40 ${W + 60},-40 ${W + 60},${H * 0.72} 160,${H * 0.38}`}
        fill={`url(#glow-${seed})`}
        filter={`url(#glow-blur-${seed})`}
      />
    </>
  );
}

function Wash({ seed }: { seed: number }) {
  return (
    <>
      <defs>
        <linearGradient id={`wash-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7ee" />
          <stop offset="0.55" stopColor="#f4c9d8" />
          <stop offset="1" stopColor="#eab0c5" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#wash-${seed})`} />
      {specks(seed, WASH, "#c2527b", 0.7)}
    </>
  );
}

function Halftone({ seed }: { seed: number }) {
  const dots: ReactNode[] = [];
  const step = 14;
  for (let y = 0; y <= H; y += step) {
    for (let x = 0; x <= W; x += step) {
      const offset = (y / step) % 2 ? step / 2 : 0;
      const t = (x + offset) / W;
      const r = Math.max(0, t * t * 5.2 - 0.4);
      if (r > 0.2) dots.push(<circle key={`${x}-${y}`} cx={x + offset} cy={y} r={r} fill="#600426" opacity={0.75} />);
    }
  }
  return <g data-seed={seed}>{dots}</g>;
}

function Grain({ seed }: { seed: number }) {
  return (
    <>
      <filter id={`grain-${seed}`} colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.1  0 0 0 0 0.25  0 0 0 0.55 -0.12" />
      </filter>
      <rect width={W} height={H} fill="#fbeef2" />
      <rect width={W} height={H} filter={`url(#grain-${seed})`} />
    </>
  );
}

function Scribble() {
  return (
    <g fill="none" stroke="#8a1c44" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M-10 70 C 80 10, 180 40, 250 8 S 420 -10, 520 30 S 640 20, 660 60"
        strokeWidth="3"
        opacity="0.8"
      />
      <path d="M-20 420 C 60 380, 150 450, 240 410 S 400 380, 470 430 S 600 460, 660 400" strokeWidth="3" opacity="0.8" />
      <path
        d="M600 120 c 40 20 30 80 -10 90 c -40 10 -60 -40 -20 -70 c 30 -20 70 10 60 50"
        strokeWidth="2.5"
        opacity="0.6"
      />
      <path d="M30 200 c -20 30 0 70 30 60 c 30 -10 20 -60 -10 -50" strokeWidth="2.5" opacity="0.6" />
    </g>
  );
}

function Confetti({ seed }: { seed: number }) {
  const next = random(seed);
  const colors = ["#c2527b", "#726e87", "#e8a3bb", "#600426"];
  const bits: ReactNode[] = [];
  for (let i = 0; i < 90; i += 1) {
    const edge = next();
    const x = edge < 0.5 ? next() * W : next() < 0.5 ? next() * 70 : W - next() * 70;
    const y = edge < 0.5 ? (next() < 0.5 ? next() * 60 : H - next() * 60) : next() * H;
    const length = 6 + next() * 10;
    bits.push(
      <rect
        key={i}
        x={x}
        y={y}
        width={length}
        height={3}
        rx={1.5}
        fill={colors[Math.floor(next() * colors.length)]}
        transform={`rotate(${Math.floor(next() * 180)} ${x} ${y})`}
      />,
    );
  }
  return <>{bits}</>;
}

export function TexturedThemePreview({ id, seed }: { id: TextureId; seed?: number }) {
  return (
    <div className="tt-card">
      <div className="tt-copy">
        <p className="tt-kicker">Updated 4h ago</p>
        <h3>NYX Brow Glue: ‘Crazy Lift’ and Long-Lasting Hold</h3>
        <p className="tt-summary">
          Creators are showcasing NYX The Brow Glue, praising its strong hold for lifted, laminated, fluffy brows.
        </p>
        <div className="tt-stats">
          <span>
            Posts<strong>144</strong>
          </span>
          <span>
            Views<strong>2.39M</strong>
          </span>
        </div>
      </div>
      <div className="tt-media">
        <ThemeTexture id={id} seed={seed} />
        <div className="tt-posts">
          {PREVIEW_POSTS.map((src, index) => (
            <span key={src} className="tt-post" style={{ transform: `rotate(${[0.7, -2.4, 0.4][index]}deg)` }}>
              <img src={src} alt="" />
              <span className="tt-post-handle">@uhodom_edinym</span>
              <span className="tt-post-caption">
                A beauty creator names Victoria Beckham by Augustinus Bader The Foundation Drops as one of her top
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ThemeTexture({ id, seed = 7 }: { id: TextureId; seed?: number }) {
  return (
    <svg className="theme-texture" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {id === "stipple" ? <Stipple seed={seed} /> : null}
      {id === "watercolor" ? <Watercolor seed={seed} /> : null}
      {id === "watercolor-stipple" ? <WatercolorStipple seed={seed} /> : null}
      {id === "stripes" ? <Stripes seed={seed} /> : null}
      {id === "camo" ? <Camo seed={seed} /> : null}
      {id === "glow" ? <Glow seed={seed} /> : null}
      {id === "wash" ? <Wash seed={seed} /> : null}
      {id === "halftone" ? <Halftone seed={seed} /> : null}
      {id === "grain" ? <Grain seed={seed} /> : null}
      {id === "scribble" ? <Scribble /> : null}
      {id === "confetti" ? <Confetti seed={seed} /> : null}
      {id === "bleed" ? <Bleed w={W} h={H} top={0.35} mid="#dfe8dc" bottom="#a4c8ef" seed={seed} /> : null}
    </svg>
  );
}

const BW = 480;
const BH = 380;
const BAND_TOP = 140;

export function CamoBand({ ink, soft, seed = 3 }: { ink: string; soft: string; seed?: number }) {
  const [r, g, b] = rgb(ink);
  const id = `band-${seed}-${ink.slice(1)}`;
  const next = random(seed);
  const spills = Array.from({ length: 9 }, (_, index) => ({
    cx: 20 + index * 55 + next() * 30,
    cy: BAND_TOP - 4 - next() * 30,
    r: 9 + next() * 16,
  })).filter(() => next() > 0.25);

  return (
    <svg className="theme-texture" viewBox={`0 0 ${BW} ${BH}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <filter id={`${id}-rag`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="22" />
      </filter>
      <filter id={`${id}-camo`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={seed + 1} result="n" />
        <feColorMatrix in="n" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 -24 11.4`} result="blobs" />
        <feTurbulence type="turbulence" baseFrequency="0.25" numOctaves="1" seed={seed + 4} result="rough" />
        <feDisplacementMap in="blobs" in2="rough" scale="8" />
      </filter>
      <mask id={`${id}-mask`}>
        <rect x="-20" y={BAND_TOP} width={BW + 40} height={BH} fill="#fff" filter={`url(#${id}-rag)`} />
      </mask>
      <g filter={`url(#${id}-rag)`}>
        {spills.map((spill, index) => (
          <circle key={index} {...spill} fill={soft} />
        ))}
      </g>
      <g mask={`url(#${id}-mask)`}>
        <rect width={BW} height={BH} fill={soft} />
        <rect width={BW} height={BH} filter={`url(#${id}-camo)`} />
      </g>
    </svg>
  );
}

function Bleed({ w, h, top, mid, bottom, seed }: { w: number; h: number; top: number; mid: string; bottom: string; seed: number }) {
  const id = `bleed-${seed}-${bottom.slice(1)}`;
  return (
    <>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={mid} stopOpacity="0" />
        <stop offset={top} stopColor={mid} stopOpacity="0" />
        <stop offset={top + 0.08} stopColor={mid} stopOpacity="1" />
        <stop offset={top + 0.2} stopColor={mid} stopOpacity="1" />
        <stop offset={top + 0.42} stopColor={bottom} stopOpacity="0.9" />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset={top + 0.12} stopColor="#fff" stopOpacity="0" />
        <stop offset={top + 0.35} stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id={`${id}-mask`}>
        <rect width={w} height={h} fill={`url(#${id}-fade)`} />
      </mask>
      <filter id={`${id}-wisp`} x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.03 0.006" numOctaves="3" seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={h * 0.32} xChannelSelector="G" yChannelSelector="R" />
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id={`${id}-streak`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.045 0.005" numOctaves="2" seed={seed + 2} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.55" result="a" />
        <feComposite in="SourceGraphic" in2="a" operator="in" />
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
      <g filter={`url(#${id}-wisp)`}>
        <rect x={-w * 0.1} y={0} width={w * 1.2} height={h * 1.3} fill={`url(#${id}-fill)`} />
      </g>
      <g mask={`url(#${id}-mask)`} opacity="0.4">
        <rect width={w} height={h} fill={bottom} filter={`url(#${id}-streak)`} />
      </g>
      <g mask={`url(#${id}-mask)`} opacity="0.35">
        <rect width={w} height={h} fill={mid} filter={`url(#${id}-streak)`} transform={`translate(${w * 0.37} 0)`} />
      </g>
    </>
  );
}

export function BleedBand({ mid, bottom, seed = 3 }: { mid: string; bottom: string; seed?: number }) {
  return (
    <svg className="theme-texture" viewBox={`0 0 ${BW} ${BH}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <Bleed w={BW} h={BH} top={0.3} mid={mid} bottom={bottom} seed={seed} />
    </svg>
  );
}

export function StripePanel({ ink, soft, seed = 3 }: { ink: string; soft: string; seed?: number }) {
  return (
    <svg className="theme-texture" viewBox={`0 0 ${BW} ${BH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width={BW} height={BH} fill={soft} />
      {wavyBands(BW, BH, ink, seed)}
    </svg>
  );
}

export type FrameTextureId = "stipple" | "watercolor" | "stripes" | "camo" | "grain";

export type ThemePalette = { base: string; ink: string; soft: string };

export const FRAME_TEXTURES: { id: FrameTextureId; name: string }[] = [
  { id: "stipple", name: "Stipple" },
  { id: "watercolor", name: "Watercolor" },
  { id: "stripes", name: "Stripes" },
  { id: "camo", name: "Camo" },
  { id: "grain", name: "Grain" },
];

const POST_FILE = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const FRAME_THEMES: {
  id: string;
  name: string;
  why: string;
  palette: ThemePalette;
  post: string;
  handle: string;
}[] = [
  {
    id: "nyx",
    name: "NYX Brow Glue: ‘Crazy Lift’",
    why: "Hot pink and yellow, straight off the Brow Glue tube.",
    palette: { base: "#fff3a6", ink: "#e0137f", soft: "#ffd1e6" },
    post: file("pick-image.png"),
    handle: "@uhodom_edinym",
  },
  {
    id: "lululemon",
    name: "Lululemon’s summer Pilates series",
    why: "Burnt orange and cream, from the Summer Series video.",
    palette: { base: "#f6e9dc", ink: "#c24a24", soft: "#f2c3a6" },
    post: POST_FILE("assets/post1/video.png"),
    handle: "@lululemon",
  },
  {
    id: "golf",
    name: "Lewis Hamilton’s golf wager",
    why: "Fairway green on a pale grass wash.",
    palette: { base: "#e6f0dc", ink: "#2f6b3a", soft: "#bcd8b0" },
    post: POST_FILE("assets/post2/video.png"),
    handle: "@lululemon",
  },
];

const FW = 200;
const FH = 360;

function rgb(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((part) => (part / 255).toFixed(3));
}

function FrameTexture({ id, palette, seed }: { id: FrameTextureId; palette: ThemePalette; seed: number }) {
  const [r, g, b] = rgb(palette.ink);
  const [sr, sg, sb] = rgb(palette.soft);
  const filterId = `frame-${id}-${seed}-${palette.ink.slice(1)}`;

  let body: ReactNode = null;
  if (id === "stipple") {
    body = specks(
      seed,
      [
        { x: 10, y: 20, r: 55, count: 420 },
        { x: 195, y: 150, r: 50, count: 380 },
        { x: 30, y: 345, r: 60, count: 460 },
      ],
      palette.ink,
    );
  } else if (id === "stripes") {
    body = wavyBands(FW, FH, palette.ink, seed, 0.6);
  } else {
    const noise =
      id === "watercolor" ? (
        <>
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="4" seed={seed} result="n" />
          <feColorMatrix in="n" values={`0 0 0 0 ${sr}  0 0 0 0 ${sg}  0 0 0 0 ${sb}  0 0 0 1.8 -0.6`} />
        </>
      ) : id === "camo" ? (
        <>
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed={seed} result="n" />
          <feColorMatrix in="n" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 -24 11.6`} result="blobs" />
          <feTurbulence type="turbulence" baseFrequency="0.3" numOctaves="1" seed={seed + 3} result="rough" />
          <feDisplacementMap in="blobs" in2="rough" scale="5" />
        </>
      ) : (
        <>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 0.5 -0.12`} />
        </>
      );
    body = (
      <>
        <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {noise}
        </filter>
        <rect width={FW} height={FH} filter={`url(#${filterId})`} />
      </>
    );
  }

  return (
    <svg className="theme-texture" viewBox={`0 0 ${FW} ${FH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width={FW} height={FH} fill={id === "camo" ? palette.soft : palette.base} />
      {body}
    </svg>
  );
}

export function TexturedFrame({
  texture,
  palette,
  seed = 5,
  src,
  handle,
}: {
  texture: FrameTextureId;
  palette: ThemePalette;
  seed?: number;
  src: string;
  handle: string;
}) {
  return (
    <span className="tt-frame">
      <FrameTexture id={texture} palette={palette} seed={seed} />
      <img src={src} alt="" />
      <span className="tt-frame-label">{handle}</span>
    </span>
  );
}

function valueNoise(seed: number, cell: number) {
  const next = random(seed);
  const size = 64;
  const grid = Array.from({ length: size * size }, () => next());
  const at = (x: number, y: number) => grid[(((y % size) + size) % size) * size + (((x % size) + size) % size)];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const sample = (x: number, y: number) => {
    const gx = x / cell;
    const gy = y / cell;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const tx = smooth(gx - x0);
    const ty = smooth(gy - y0);
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
    return top + (bottom - top) * ty;
  };
  return (x: number, y: number) => sample(x, y) * 0.65 + sample(x * 2.3 + 17, y * 2.3 + 5) * 0.35;
}

function useCanvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, key: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    draw(ctx);
    return canvas.toDataURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

const PX_W = 200;
const PX_H = 128;
const PLUS = new Set(["2,1", "1,2", "2,2", "3,2", "2,3"]);

export function PixelCloud({ ink, seed = 3 }: { ink: string; seed?: number }) {
  const src = useCanvasTexture(
    PX_W,
    PX_H,
    (ctx) => {
      const cloud = valueNoise(seed, 22);
      const patch = valueNoise(seed + 9, 18);
      const scatter = random(seed + 4);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, PX_W, PX_H);
      ctx.fillStyle = ink;
      for (let y = 0; y < PX_H; y += 1) {
        for (let x = 0; x < PX_W; x += 1) {
          const edge = Math.abs(y / PX_H - 0.5) * 2;
          const field = 0.95 - edge * 1.05 + (cloud(x, y) - 0.5) * 1.1;
          const onGrid = (x + y) % 2 === 0;
          if (field > 0) {
            const plus = patch(x, y) > 0.66 && PLUS.has(`${x % 6},${y % 6}`);
            if (onGrid && !plus) ctx.fillRect(x, y, 1, 1);
          } else if (onGrid && x % 2 === 0) {
            const chance = Math.max(0, 1 + field * 7) * 0.7 + (cloud(x + 90, y) > 0.7 ? 0.35 : 0);
            if (scatter() < chance) ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    },
    `pixel-${ink}-${seed}`,
  );
  return <img className="theme-texture is-pixelated" src={src} alt="" aria-hidden="true" />;
}
