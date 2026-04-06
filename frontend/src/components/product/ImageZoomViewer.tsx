import { useState } from "react";

interface ImageZoomViewerProps {
  src: string;
  alt: string;
}

export function ImageZoomViewer({ src, alt }: ImageZoomViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };



  return (
    <div className="relative w-full max-w-md bg-gray-100 rounded-lg overflow-hidden">
      {/* Main Image Container */}
      <div
        className="relative w-full aspect-square cursor-zoom-in overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsZoomed(true);
          setZoomLevel(2);
        }}
        onMouseLeave={() => {
          setIsZoomed(false);
          setZoomLevel(1);
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200"
          style={{
            transform: isZoomed ? `scale(${zoomLevel})` : "scale(1)",
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
          }}
        />

        {/* Zoom Hint */}
        {!isZoomed && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
            Hover to zoom
          </div>
        )}
      </div>


    </div>
  );
}
