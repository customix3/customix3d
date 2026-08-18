import { useEffect, useState } from 'react';
import { Cloud, Trash2 } from 'lucide-react';
import {
  subscribeReviews,
  patchReview,
  deleteReview,
  type Review,
} from '@/services/firestoreAdmin';

export default function AdminReviews() {
  const [list, setList] = useState<Review[]>([]);

  useEffect(() => subscribeReviews(setList), []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Reviews</h1>
      <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
        <Cloud className="h-3.5 w-3.5" /> {list.length} · Firebase
      </p>

      {list.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          No reviews yet. When customers leave reviews, moderate them here.
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className="card p-4 flex flex-wrap gap-4 justify-between">
              <div>
                <p className="font-medium">
                  {r.productName} · {r.rating}/5
                </p>
                <p className="text-sm text-slate-600 mt-1">{r.comment}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {r.customerName} · {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    r.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                  }`}
                  onClick={() => void patchReview(r.id, !r.approved)}
                >
                  {r.approved ? 'Approved' : 'Approve'}
                </button>
                <button
                  type="button"
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={() => {
                    if (confirm('Delete review?')) void deleteReview(r.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
