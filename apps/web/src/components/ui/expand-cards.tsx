"use client";

import { useState } from "react";

interface ExpandCardsProps {
  images?: string[];
  className?: string;
}

const defaultImages = [
  "/images/expand-card-1.png", // Social platforms integration
  "/images/expand-card-2.png", // Content calendar
  "/images/expand-card-3.png", // Analytics dashboard
  "/images/expand-card-4.png", // Post composer
  "/images/expand-card-5.png", // Engagement metrics
  "/images/expand-card-6.png", // Multi-account management
  "/images/expand-card-7.png", // Auto scheduling
  "/images/expand-card-8.png", // Team workspace
  "/images/expand-card-9.png", // Growth tracking
];

const ExpandCards = ({ images = defaultImages, className = "" }: ExpandCardsProps) => {
  const [expandedImage, setExpandedImage] = useState(4);

  const getImageWidth = (index: number) =>
    index === expandedImage ? "24rem" : "5rem";

  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center justify-center p-2 transition-all duration-300 ease-in-out w-full">
        <div className="w-full h-full overflow-hidden rounded-3xl">
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-6xl px-5">
              <div className="flex w-full items-center justify-center gap-1">
                {images.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl"
                    style={{
                      width: getImageWidth(idx + 1),
                      height: "24rem",
                    }}
                    onMouseEnter={() => setExpandedImage(idx + 1)}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={src}
                      alt={`Feature ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExpandCards };
export default ExpandCards;
