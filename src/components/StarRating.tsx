import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export function StarRating({
  rating,
  reviewCount,
  size = 'sm',
}: StarRatingProps) {
  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const fullStars = Math.round(rating);

  return (
    <div
      className="inline-flex items-center gap-1.5"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= fullStars;
          return (
            <Star
              key={starIndex}
              className={`${iconClass} ${
                isFilled
                  ? 'fill-emerald-400 text-emerald-400'
                  : 'fill-transparent text-slate-600'
              }`}
            />
          );
        })}
      </div>
      <span className="font-mono text-xs font-medium text-slate-100 tabular-nums">
        {rating.toFixed(1)}
      </span>
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-slate-400 tabular-nums">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
