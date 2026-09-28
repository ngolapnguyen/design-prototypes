const file = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const mag = {
  logo: file("/assets/magazine/html/logo.svg"),
  coverHero: file("/assets/magazine/html/cover-hero.png"),
  iphone: file("/assets/magazine/html/cover-iphone.png"),
  adidas: file("/assets/magazine/html/cover-adidas.png"),
  starface: file("/assets/magazine/html/cover-starface.png"),
  edikted: file("/assets/magazine/html/cover-edikted.png"),
  blush: file("/assets/magazine/html/cover-blush.png"),
  creator: file("/assets/magazine/html/creator.jpg"),
  alo: file("/assets/magazine/html/brand-alo.png"),
  ediktedTile: file("/assets/magazine/html/brand-edikted.png"),
  oldNavy: file("/assets/magazine/html/brand-oldnavy.png"),
  lulu: file("/assets/magazine/html/brand-lulu.png"),
  researcher: file("/assets/magazine/html/researcher.png"),
};
