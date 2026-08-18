export type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  description: string;
  active?: boolean;
};
