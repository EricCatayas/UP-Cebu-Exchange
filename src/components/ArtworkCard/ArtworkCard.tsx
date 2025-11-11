import React from "react";
import "./ArtworkCard.css";

export default function ArtworkCard({
  artwork,
  displayInfo = true,
}: {
  artwork: any;
  displayInfo?: boolean;
}) {
  if (!artwork) return null;

  const primaryImage =
    artwork.images?.find((img) => img.isPrimary) || artwork.images?.[0];
  const lowestPlan = artwork.rentalPlans
    ? [...artwork.rentalPlans].sort((a, b) => a.rentalFee - b.rentalFee)[0]
    : null;
  const dimension = `${artwork.heightCm}cm × ${artwork.widthCm}cm`;

  return (
    <div className={`artwork-card status-${artwork.status}`}>
      {artwork.status === "rented" && <div className="ribbon">Rented</div>}
      <div className="image-wrapper">
        <img src={primaryImage?.imageUrl} alt={artwork.title} loading="lazy" />
      </div>
      {displayInfo && (
        <div className="info-row">
          <div className="left">
            <div className="title">{artwork.title}</div>
            <div className="artist">{artwork.artist?.name}</div>
            {lowestPlan && (
              <div className="price">
                as low as: ₱ {lowestPlan.rentalFee.toLocaleString()}
              </div>
            )}
          </div>
          <div className="right">
            <div className="dimension">{dimension}</div>
            <div className="flex gap-2">
              <button className="wishlist-btn" title="Add to wishlist">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
              <button className="cart-btn" title="Add to cart">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.41A2 2 0 0 0 10 20h10v-2H10l1.1-2h7.45a2 2 0 0 0 1.79-1.11L22 9H6.21l-.94-2H7V4Zm3 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
