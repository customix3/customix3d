export type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  active?: boolean;
  /** Available units; 0 = out of stock */
  stock?: number;
  /** Customer can type a name / text — opens personalize page with live preview */
  personalizable?: boolean;
};
