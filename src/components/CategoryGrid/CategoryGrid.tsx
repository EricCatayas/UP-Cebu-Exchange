import React from "react";
import "./CategoryGrid.css";

export default function CategoryGrid({ categories }) {
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <div
          key={category.id || index}
          className={`category-card category-${index + 1}`}
          style={{
            backgroundImage: category.imageUrl
              ? `url(${category.imageUrl})`
              : undefined,
          }}
        >
          <div className="category-overlay">
            <h3 className="category-name">{category.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
