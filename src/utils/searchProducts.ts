import type { Product } from '@/types/product';

export type ScoredProduct = Product & { score: number };

/** Rank products for a query. Higher score = better match. */
export function searchProducts(products: Product[], query: string): ScoredProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  const active = products.filter((p) => p.active !== false);

  const scored: ScoredProduct[] = [];

  for (const p of active) {
    const name = (p.name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    let score = 0;

    // Exact / strong name hits
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 70;
    else if (name.includes(q)) score += 50;

    // Token matches
    for (const t of tokens) {
      if (name.includes(t)) score += 20;
      if (cat.includes(t)) score += 12;
      if (desc.includes(t)) score += 6;
    }

    // Category exact-ish
    if (cat === q || cat.replace(/-/g, ' ') === q) score += 25;

    if (score > 0) scored.push({ ...p, score });
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored;
}

/** Weak match = only low scores; treat as “no good product match” */
export function isWeakMatch(results: ScoredProduct[]): boolean {
  if (results.length === 0) return true;
  return results[0].score < 20;
}
