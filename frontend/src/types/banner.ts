export type BannerTheme = "spicy" | "healthy" | "dessert";

export type BannerSlide = {
  id: string;
  title: string;
  caption: string;
  offer: string;
  imageUrl: string;
  theme: BannerTheme;
};
