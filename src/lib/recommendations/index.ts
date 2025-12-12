import { ArtworkDTO } from '@/models/Artwork';
import { TagDTO } from '@/models/Tag';

interface GlobalStats {
  height: { min: number; max: number };
  width: { min: number; max: number };
  // Add other numeric fields if needed
}

export const globalStats: GlobalStats = {
  height: { min: 20, max: 300 },
  width: { min: 20, max: 300 }
};

export function similarityScore(artworkA: ArtworkDTO, artworkB: ArtworkDTO): number {
  let scoreSum = 0;
  let weightSum = 0;

  const normalizeNumeric = (x: number, y: number, min: number, max: number): number => {
    const range = max - min;
    if (range === 0) return 1;
    return 1 - Math.min(Math.abs(x - y) / range, 1);
  };

  const match = (a: any, b: any): number => (a === b ? 1 : 0);

  const jaccard = (arr1: string[], arr2: string[]): number => {
    const set1 = new Set(arr1 || []);
    const set2 = new Set(arr2 || []);
    const intersection = [...set1].filter(t => set2.has(t)).length;
    const union = new Set([...set1, ...arr2]).size;
    return union === 0 ? 0 : intersection / union;
  };

  const addScore = (similarity: number, weight: number): void => {
    scoreSum += similarity * weight;
    weightSum += weight;
  };

  // ----- NUMERIC FIELDS -----
  if (artworkA.heightCm != null && artworkB.heightCm != null) {
    addScore(
      normalizeNumeric(artworkA.heightCm, artworkB.heightCm, globalStats.height.min, globalStats.height.max),
      2
    );
  }

  if (artworkA.widthCm != null && artworkB.widthCm != null) {
    addScore(
      normalizeNumeric(artworkA.widthCm, artworkB.widthCm, globalStats.width.min, globalStats.width.max),
      2
    );
  }

  // ----- CATEGORICAL FIELDS -----
  addScore(match(artworkA.medium, artworkB.medium), 3);
  addScore(match(artworkA.styleId, artworkB.styleId), 4);
  addScore(match(artworkA.status, artworkB.status), 1);
  addScore(match(artworkA.artistId, artworkB.artistId), 1);

  // ----- TAGS -----
  const tagsA: string[] = artworkA.tags?.map(tag => tag.name) ?? [];
  const tagsB: string[] = artworkB.tags?.map(tag => tag.name) ?? [];
  addScore(jaccard(tagsA, tagsB), 5);

  return scoreSum / weightSum; // final similarity: 0 (not similar) to 1 (identical)
}

/*
Option 1: Content-Based Filtering
Components in Content-Based Recommendation System
    Content Analyzer
        Goal: Represent each artwork in a structured, machine-understandable format.

        What it does:

        Takes unstructured item data (e.g., painting descriptions, artist bios, styles) and extracts structured features.
            
    Profile Learner
        Goal: Build a profile that captures what each user likes.

        What it does:

        Uses user behavior (likes, views, rentals) as training examples.

    Filtering Component
        Goal: Match users with artworks that best fit their profile.

        What it does:

        Computes similarity (e.g., cosine similarity).

        Returns a ranked list of artworks.
    
    Remarks: Too difficult to implement.

Option 2: Similarity Measure
    Goal: Quantify how similar an artwork is to another artwork.

    What it does:

    Computes similarity (e.g., cosine similarity, gower's distance) between artwork features.

    Returns a similarity score.
    
    Remarks: Easier to implement, but less personalized. 
        Simply create a function that computes similarity scores between artworks based on their features (e.g., style, medium, artist).
        User wishlist or last viewed artworks can be used as reference points to recommend similar artworks.
    */
