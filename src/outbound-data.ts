import { ob } from "./outbound-assets";

export type ChartMetric = "comments" | "likes" | "replies" | "impressions" | "emv";

export const chartSeries: Record<ChartMetric, number[]> = {
  comments: [8, 6, 28, 5, 2],
  likes: [4200, 3100, 9800, 1200, 533],
  replies: [22, 18, 48, 19, 12],
  impressions: [14000, 9800, 28600, 6200, 4175],
  emv: [1400, 980, 2860, 620, 404],
};

export const chartLabels = [
  "Jul 29 - Aug 2",
  "Aug 3 - Aug 9",
  "Aug 10 - Aug 16",
  "Aug 17 - Aug 23",
  "Aug 24 - Aug 28",
];

export const metricTabs: { id: ChartMetric; label: string; emoji: string }[] = [
  { id: "comments", label: "Brand Comments", emoji: "🖊️" },
  { id: "likes", label: "Likes", emoji: "♥️" },
  { id: "replies", label: "Replies", emoji: "💬" },
  { id: "impressions", label: "Impressions", emoji: "👁️" },
  { id: "emv", label: "EMV", emoji: "💲" },
];

export type BrandComment = {
  id: string;
  date: string;
  stamp: string;
  text: string;
  photo?: string;
  likes: string;
  replies: string;
  impressions: string;
  emv: string;
  likesN: number;
  thumb: string;
};

export const brandComments: BrandComment[] = [
  {
    id: "1",
    date: "August 13, 2026",
    stamp: "2026-8-13",
    text: "Wait so i have no idea what’s going on can someone",
    likes: "10.26K",
    replies: "90",
    impressions: "30.78K",
    emv: "$3,442.68",
    likesN: 10260,
    thumb: ob.thumbs[0],
  },
  {
    id: "2",
    date: "August 10, 2026",
    stamp: "2026-8-10",
    text: "",
    photo: ob.commentPhoto,
    likes: "7.01K",
    replies: "5",
    impressions: "21.04K",
    emv: "$2,240.13",
    likesN: 7010,
    thumb: ob.thumbs[1],
  },
  {
    id: "3",
    date: "August 19, 2026",
    stamp: "2026-8-19",
    text: "UR KIDDING THIS IS THE BEST COLLAB EVER IM SCREAMI",
    likes: "807",
    replies: "0",
    impressions: "3.83K",
    emv: "$265.09",
    likesN: 807,
    thumb: ob.thumbs[2],
  },
  {
    id: "4",
    date: "August 13, 2026",
    stamp: "2026-8-13",
    text: "I’m rlly tryin to understand what’s going on here ",
    likes: "206",
    replies: "5",
    impressions: "618",
    emv: "$75.51",
    likesN: 206,
    thumb: ob.thumbs[3],
  },
  {
    id: "5",
    date: "August 10, 2026",
    stamp: "2026-8-10",
    text: "Wow insane mela",
    likes: "176",
    replies: "1",
    impressions: "528",
    emv: "$57.97",
    likesN: 176,
    thumb: ob.thumbs[4],
  },
  {
    id: "6",
    date: "August 10, 2026",
    stamp: "2026-8-10",
    text: "the hair is SOOOO TEA",
    likes: "146",
    replies: "0",
    impressions: "438",
    emv: "$46.43",
    likesN: 146,
    thumb: ob.thumbs[5],
  },
  {
    id: "7",
    date: "August 20, 2026",
    stamp: "2026-8-19",
    text: "So effortless girl",
    likes: "60",
    replies: "1",
    impressions: "180",
    emv: "$21.08",
    likesN: 60,
    thumb: ob.thumbs[6],
  },
  {
    id: "8",
    date: "August 10, 2026",
    stamp: "2026-8-9",
    text: "Oh okay I will also buy out my stores stock so no ",
    likes: "33",
    replies: "1",
    impressions: "99",
    emv: "$12.49",
    likesN: 33,
    thumb: ob.thumbs[7],
  },
];

export type Leader = {
  rank: string;
  name: string;
  muted?: boolean;
  avatar?: string;
  total: string;
  avg: string;
  postsCommented: string;
  maxLikes: string;
  posts: string[];
  score: string | null;
};

export const leaders: Leader[] = [
  {
    rank: "1",
    name: "Rey",
    avatar: ob.rey,
    total: "0",
    avg: "0",
    postsCommented: "2",
    maxLikes: "0",
    posts: [ob.leadPosts[0], ob.leadPosts[1]],
    score: "2.5",
  },
  {
    rank: "—",
    name: "Unassigned",
    muted: true,
    total: "2",
    avg: "2",
    postsCommented: "1",
    maxLikes: "1",
    posts: [ob.leadPosts[2]],
    score: null,
  },
];
