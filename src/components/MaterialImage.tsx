import { useState } from 'react';
import { Layers } from 'lucide-react';

interface MaterialImageProps {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
}

export function MaterialImage({
  src,
  alt,
  fallbackLabel,
  className = 'h-full w-full object-cover',
}: MaterialImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#131F36] to-[#0B1221] p-6 text-center">
        <Layers className="h-8 w-8 text-emerald-400/70" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-300">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
