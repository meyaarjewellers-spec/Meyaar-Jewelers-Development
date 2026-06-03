import { useEffect, useState } from "react";

interface ImageZoomViewerProps {
  src: string;
  alt: string;
  images?: string[];
}

export function ImageZoomViewer({ src, alt, images }: ImageZoomViewerProps) {
  const gallery = (images && images.length > 0 ? images : [src]).filter(Boolean);
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setActive(0);
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const current = gallery[active] || src;

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse">
      {/* Main image */}
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-[hsl(35_30%_92%)]">
        <div
          className="relative aspect-square w-full cursor-zoom-in overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <img
            src={current}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300"
            style={{
              transform: isZoomed ? "scale(2)" : "scale(1)",
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            }}
          />
          {!isZoomed && (
            <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur">
              Hover to zoom
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-3 md:flex-col">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                active === i ? "border-primary" : "border-transparent hover:border-border"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
