
function computeArtworkSimilarity(artA, artB, globalStats) {
    let scoreSum = 0;
    let weightSum = 0;

    const normalizeNumeric = (x, y, min, max) => {
        const range = max - min;
        if (range === 0) return 1; 
        return 1 - Math.min(Math.abs(x - y) / range, 1);
    };

    const match = (a, b) => (a === b ? 1 : 0);

    const jaccard = (arr1, arr2) => {
        const set1 = new Set(arr1 || []);
        const set2 = new Set(arr2 || []);
        const intersection = [...set1].filter(t => set2.has(t)).length;
        const union = new Set([...set1, ...set2]).size;
        return union === 0 ? 0 : intersection / union;
    };

    const addScore = (similarity, weight) => {
        scoreSum += similarity * weight;
        weightSum += weight;
    };

    // Numeric fields
    addScore(normalizeNumeric(artA.heightCm, artB.heightCm, globalStats.heightCm.min, globalStats.heightCm.max), 2);
    addScore(normalizeNumeric(artA.widthCm, artB.widthCm, globalStats.widthCm.min, globalStats.widthCm.max), 2);

    // Categorical fields
    addScore(match(artA.medium, artB.medium), 3);
    addScore(match(artA.style, artB.style), 4);
    addScore(match(artA.status, artB.status), 1);
    addScore(match(artA.artist?.id, artB.artist?.id), 1);

    // Tags
    addScore(jaccard(artA.tags, artB.tags), 5);

    // Title (optional, low weight)
    addScore(match(artA.title, artB.title), 0.5);

    return scoreSum / weightSum; // 0 to 1
}

function generateUserPreferenceProfile(userHistory) {
  const profile = {
    mediumCount: {},
    styleCount: {},
    tagCount: {},
    avgHeight: 0,
    avgWidth: 0,
    total: 0
  };

  userHistory.forEach(art => {
    profile.total++;
    profile.mediumCount[art.medium] = (profile.mediumCount[art.medium] || 0) + 1;
    profile.styleCount[art.style] = (profile.styleCount[art.style] || 0) + 1;
    art.tags?.forEach(tag => {
      profile.tagCount[tag] = (profile.tagCount[tag] || 0) + 1;
    });
    profile.avgHeight += art.heightCm;
    profile.avgWidth += art.widthCm;
  });

  if (profile.total > 0) {
    profile.avgHeight /= profile.total;
    profile.avgWidth /= profile.total;
  }

  return profile;
}

function scoreArtworkForUser(artwork, userProfile) {
  let score = 0;

  if (userProfile.mediumCount[artwork.medium]) {
    score += userProfile.mediumCount[artwork.medium] * 2;
  }

  if (userProfile.styleCount[artwork.style]) {
    score += userProfile.styleCount[artwork.style] * 2;
  }

  artwork.tags?.forEach(tag => {
    if (userProfile.tagCount[tag]) {
      score += userProfile.tagCount[tag];
    }
  });

  const heightDiff = Math.abs(artwork.heightCm - userProfile.avgHeight);
  const widthDiff = Math.abs(artwork.widthCm - userProfile.avgWidth);
  const sizeScore = 1 / (1 + heightDiff + widthDiff);

  score += sizeScore * 3;

  return score;
}

function recommendArtworksForUser(user, allArtworks, globalStats) {
  const history = user.history || [];
  const userProfile = generateUserPreferenceProfile(history);

  const results = allArtworks.map(artwork => {
    const similarityToHistory = history.length === 0
      ? 0
      : Math.min(...history.map(h => 1 - computeArtworkSimilarity(h, artwork, globalStats)));

    const preferenceScore = scoreArtworkForUser(artwork, userProfile);

    const finalScore =
      (1 - similarityToHistory) * 0.6 +  // 60% weight: similarity to previously rented artworks
      preferenceScore * 0.4;             // 40% weight: user preference match

    return { artwork, finalScore };
  });

  return results.sort((a, b) => b.finalScore - a.finalScore);
}

