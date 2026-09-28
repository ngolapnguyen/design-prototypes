const file = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const magazinePages = {
  cover: file("/assets/magazine/cover.png"),
  p01: file("/assets/magazine/page-01.png"),
  p02: file("/assets/magazine/page-02.png"),
  p03: file("/assets/magazine/page-03.png"),
  p04: file("/assets/magazine/page-04.png"),
  p05: file("/assets/magazine/page-05.png"),
  p06: file("/assets/magazine/page-06.png"),
  p07: file("/assets/magazine/page-07.png"),
  p08: file("/assets/magazine/page-08.png"),
  p09: file("/assets/magazine/page-09.png"),
  p10: file("/assets/magazine/page-10.png"),
  p11: file("/assets/magazine/page-11.png"),
  p12: file("/assets/magazine/page-12.png"),
  p14: file("/assets/magazine/page-14.png"),
  p15: file("/assets/magazine/page-15.png"),
};

export type MagazineLeaf = {
  id: string;
  front: string;
  back: string | null;
  frontAlt: string;
  backAlt: string;
};

export const magazineLeaves: MagazineLeaf[] = [
  { id: "cover", front: magazinePages.cover, back: magazinePages.p01, frontAlt: "Spotted in Plot cover", backAlt: "Page 1" },
  { id: "l1", front: magazinePages.p02, back: magazinePages.p03, frontAlt: "Page 2", backAlt: "Page 3" },
  { id: "l2", front: magazinePages.p04, back: magazinePages.p05, frontAlt: "Page 4", backAlt: "Page 5" },
  { id: "l3", front: magazinePages.p06, back: magazinePages.p07, frontAlt: "Page 6", backAlt: "Page 7" },
  { id: "l4", front: magazinePages.p08, back: magazinePages.p09, frontAlt: "Page 8", backAlt: "Page 9" },
  { id: "l5", front: magazinePages.p10, back: magazinePages.p11, frontAlt: "Page 10", backAlt: "Page 11" },
  { id: "l6", front: magazinePages.p12, back: magazinePages.p14, frontAlt: "Page 12", backAlt: "Page 14" },
  { id: "l7", front: magazinePages.p15, back: null, frontAlt: "Back cover", backAlt: "" },
];
