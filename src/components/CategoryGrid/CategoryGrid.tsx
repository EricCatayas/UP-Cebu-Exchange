'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import './CategoryGrid.css';

export default function CategoryGrid({ categories }) {
  const router = useRouter();

  const handleCategoryClick = (id) => {
    router.push(`/artworks?styles=${id}`);
  };
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={`category-card category-${index + 1}`}
          style={{
            backgroundImage: category.imageUrl ? `url(${category.imageUrl})` : undefined,
          }}
          onClick={() => handleCategoryClick(category.id)}
        >
          <div className="category-overlay">
            <h3 className="category-name">{category.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
