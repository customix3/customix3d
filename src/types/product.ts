export type TextBox = {
  /** Horizontal center of text area, 0–100 (%) */
  x: number;
  /** Vertical center of text area, 0–100 (%) */
  y: number;
  /** Max width of text area as % of image width */
  width: number;
  /** Font size relative to image (approx scale) */
  fontSize: number;
};

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
  stock?: number;
  personalizable?: boolean;
  /** Plain base image for live name preview only (separate from demo gallery) */
  baseImage?: string;
  /** Where the name sits on the base image (percent units) */
  textBox?: TextBox;
};

export const DEFAULT_TEXT_BOX: TextBox = {
  x: 50,
  y: 55,
  width: 70,
  fontSize: 8,
};
