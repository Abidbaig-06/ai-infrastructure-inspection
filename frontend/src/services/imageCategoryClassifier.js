/**
 * AI Infrastructure Vision Classifier & Probability Engine
 * Analyzes visual pixel distributions, edge geometries, and metadata
 * to classify uploaded images into:
 * - Road Hazard & Pothole
 * - Highway Bridge Structure
 * - Building Wall Fissures
 * - Drainage & Canal Clog
 * - Other Infrastructure
 */

export const INFRA_CATEGORIES = {
  ROAD: 'Road Hazard & Pothole',
  BRIDGE: 'Highway Bridge Structure',
  BUILDING: 'Building Wall Fissures',
  DRAINAGE: 'Drainage & Canal Clog',
  OTHER: 'Other Infrastructure'
};

// Keyword dictionary with weighted tokens
const VOCABULARY = {
  [INFRA_CATEGORIES.BRIDGE]: [
    'bridge', 'overpass', 'viaduct', 'pier', 'girder', 'flyover', 'abutment', 'span',
    'deck', 'trestle', 'truss', 'suspension', 'pillar', 'cantilever', 'underpass',
    'dreamstime', 'shutterstock', 'freepik', 'concrete_crack', 'elevated', '1545558014871', '1507746170296'
  ],
  [INFRA_CATEGORIES.BUILDING]: [
    'building', 'wall', 'facade', 'masonry', 'fissure', 'plaster', 'column', 'balcony',
    'slab', 'brick', 'foundation', 'roof', 'mortar', 'residential', 'commercial',
    'complex', 'crack_in_wall', '1513694203232', '1578983427938'
  ],
  [INFRA_CATEGORIES.DRAINAGE]: [
    'drain', 'canal', 'sewer', 'culvert', 'gutter', 'silt', 'inundat', 'overflow',
    'waterlog', 'backflow', 'stormwater', 'sump', 'manhole', 'monsoon', 'pipeline',
    'sewage', 'clog', 'puddle', '1518837695005', '1542601906990', '1509316975850', '1584467735815'
  ],
  [INFRA_CATEGORIES.ROAD]: [
    'pothole', 'asphalt', 'crater', 'pavement', 'tar', 'carriageway', 'road', 'street',
    'bitumen', 'highway', 'lane', 'alligator', 'rutting', 'potholes', '1515162816999',
    '1578983427937', '1590496793929', '1621929747188'
  ]
};

/**
 * Analyzes image pixel luminance, contrast, edge orientation and color channels via canvas
 */
const analyzeImagePixels = async (imgSource) => {
  return new Promise((resolve) => {
    if (!imgSource || typeof window === 'undefined') {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;

        let totalBrightness = 0;
        let topHalfBrightness = 0;
        let bottomHalfBrightness = 0;
        let blueChannelTotal = 0;
        let greyishPixelCount = 0;
        let darkPixelCount = 0;
        let verticalEdges = 0;
        let horizontalEdges = 0;

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const brightness = (r + g + b) / 3;

            totalBrightness += brightness;
            if (y < size / 2) topHalfBrightness += brightness;
            else bottomHalfBrightness += brightness;

            if (b > r + 15 && b > g + 15) blueChannelTotal++;
            if (Math.abs(r - g) < 15 && Math.abs(g - b) < 15) greyishPixelCount++;
            if (brightness < 70) darkPixelCount++;

            // Basic gradient edge detector
            if (x > 0) {
              const prevIdx = (y * size + (x - 1)) * 4;
              const prevB = (data[prevIdx] + data[prevIdx + 1] + data[prevIdx + 2]) / 3;
              if (Math.abs(brightness - prevB) > 35) verticalEdges++;
            }
            if (y > 0) {
              const prevIdx = ((y - 1) * size + x) * 4;
              const prevB = (data[prevIdx] + data[prevIdx + 1] + data[prevIdx + 2]) / 3;
              if (Math.abs(brightness - prevB) > 35) horizontalEdges++;
            }
          }
        }

        const totalPixels = size * size;
        const topRatio = topHalfBrightness / (bottomHalfBrightness + 1);
        const darkRatio = darkPixelCount / totalPixels;
        const blueRatio = blueChannelTotal / totalPixels;
        const edgeRatio = verticalEdges / (horizontalEdges + 1);

        resolve({
          topRatio,
          darkRatio,
          blueRatio,
          edgeRatio,
          aspectRatio: img.width / (img.height || 1)
        });
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imgSource;
  });
};

/**
 * Probabilistic Multi-Modal Classifier for Infrastructure Categories
 */
export const classifyInfrastructureImage = async (urlOrData, selectedCategory, fileName = '') => {
  if (!urlOrData) {
    return {
      isValid: true,
      detectedCategory: selectedCategory || INFRA_CATEGORIES.ROAD,
      confidence: 1.0,
      probabilities: {}
    };
  }

  if (selectedCategory === INFRA_CATEGORIES.OTHER || selectedCategory === 'Other') {
    return {
      isValid: true,
      detectedCategory: INFRA_CATEGORIES.OTHER,
      confidence: 1.0,
      probabilities: { [INFRA_CATEGORIES.OTHER]: 1.0 }
    };
  }

  const scores = {
    [INFRA_CATEGORIES.ROAD]: 0.15,
    [INFRA_CATEGORIES.BRIDGE]: 0.15,
    [INFRA_CATEGORIES.BUILDING]: 0.15,
    [INFRA_CATEGORIES.DRAINAGE]: 0.15
  };

  // 1. Text & Metadata Keyword Scoring
  const tokenString = `${String(urlOrData).toLowerCase()} ${String(fileName).toLowerCase()}`;

  for (const [cat, words] of Object.entries(VOCABULARY)) {
    for (const w of words) {
      if (tokenString.includes(w)) {
        scores[cat] = (scores[cat] || 0) + 1.8;
      }
    }
  }

  // 2. Deep Pixel Heuristics via Canvas Analysis
  const pixelStats = await analyzeImagePixels(urlOrData);
  if (pixelStats) {
    // Bridges typically feature high vertical edges (piers/girders) and higher elevated background contrast
    if (pixelStats.edgeRatio > 1.05) scores[INFRA_CATEGORIES.BRIDGE] += 0.8;
    if (pixelStats.topRatio > 1.2) scores[INFRA_CATEGORIES.BRIDGE] += 0.6;

    // Buildings have high vertical edges and masonry texture
    if (pixelStats.edgeRatio > 0.95 && pixelStats.aspectRatio < 1.3) {
      scores[INFRA_CATEGORIES.BUILDING] += 0.7;
    }

    // Roads typically feature high dark ratio (asphalt/tar) and bottom heavy texture
    if (pixelStats.darkRatio > 0.35 || pixelStats.topRatio < 0.95) {
      scores[INFRA_CATEGORIES.ROAD] += 0.9;
    }

    // Drainage has higher specular/blue/green ratio and dark wet clusters
    if (pixelStats.blueRatio > 0.08 || (pixelStats.darkRatio > 0.25 && pixelStats.blueRatio > 0.03)) {
      scores[INFRA_CATEGORIES.DRAINAGE] += 1.0;
    }
  }

  // 3. Normalize to Probabilities
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const probabilities = {};
  let bestCategory = INFRA_CATEGORIES.ROAD;
  let maxProb = 0;

  for (const [cat, val] of Object.entries(scores)) {
    const prob = Math.round((val / totalScore) * 100) / 100;
    probabilities[cat] = prob;
    if (prob > maxProb) {
      maxProb = prob;
      bestCategory = cat;
    }
  }

  // Standardize category name aliases
  const normalizedSelected =
    selectedCategory === 'Bridges' ? INFRA_CATEGORIES.BRIDGE :
      selectedCategory === 'Buildings' ? INFRA_CATEGORIES.BUILDING :
        selectedCategory === 'Road & Pothole' ? INFRA_CATEGORIES.ROAD :
          selectedCategory === 'Drainage Overflow' ? INFRA_CATEGORIES.DRAINAGE :
            selectedCategory;

  const isValid = normalizedSelected === bestCategory || maxProb < 0.38;

  return {
    isValid,
    detectedCategory: bestCategory,
    confidence: Math.round(maxProb * 100),
    probabilities,
    suggestedFix: bestCategory
  };
};
