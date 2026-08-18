export type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  /** Primary image (first of images) */
  image: string;
  /** Up to 10 gallery images */
  images?: string[];
  category: string;
  description: string;
  active?: boolean;
};
