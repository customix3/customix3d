export type TextBox = {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  rotate?: number;
  showBorder?: boolean;
  borderWidth?: number;
  borderColor?: string;
  font?: string;
  color?: string;
  letterSpacing?: number;
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
  baseImage?: string;
  textBox?: TextBox;
};

export const DEFAULT_TEXT_BOX: TextBox = {
  x: 50,
  y: 55,
  width: 70,
  fontSize: 8,
  rotate: 0,
  showBorder: true,
  borderWidth: 1,
  borderColor: 'rgba(240,90,26,0.55)',
  font: 'syne',
  color: '#12100e',
  letterSpacing: 1,
};

export const NAME_IT_FONTS: { id: string; label: string; css: string }[] = [
  { id: 'syne', label: 'Syne Bold', css: '"Syne", system-ui, sans-serif' },
  { id: 'dm', label: 'DM Sans', css: '"DM Sans", system-ui, sans-serif' },
  { id: 'bebas', label: 'Bebas Neue', css: '"Bebas Neue", system-ui, sans-serif' },
  { id: 'pacifico', label: 'Pacifico Script', css: '"Pacifico", cursive' },
  { id: 'permanent', label: 'Permanent Marker', css: '"Permanent Marker", cursive' },
  { id: 'orbitron', label: 'Orbitron Tech', css: '"Orbitron", system-ui, sans-serif' },
  { id: 'cinzel', label: 'Cinzel Elegant', css: '"Cinzel", serif' },
  { id: 'rubik', label: 'Rubik Dirt', css: '"Rubik Dirt", system-ui, sans-serif' },
  { id: 'righteous', label: 'Righteous', css: '"Righteous", system-ui, sans-serif' },
  { id: 'bangers', label: 'Bangers Pop', css: '"Bangers", system-ui, cursive' },
];

export function fontCss(id?: string): string {
  return NAME_IT_FONTS.find((f) => f.id === id)?.css || NAME_IT_FONTS[0].css;
}
