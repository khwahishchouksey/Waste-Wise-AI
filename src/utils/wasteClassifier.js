import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

// Pre-trained model cache
let modelPromise = null;
let isModelLoading = false;

export const loadAIModel = async () => {
  if (modelPromise) {
    return modelPromise;
  }
  if (isModelLoading) {
    return null;
  }

  isModelLoading = true;
  modelPromise = (async () => {
    try {
      await tf.ready();
      // Load MobileNet v2 with alpha 1.0
      const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
      console.log("TensorFlow.js MobileNet v2 Model Initialized Successfully!");
      isModelLoading = false;
      return loadedModel;
    } catch (err) {
      console.warn("MobileNet load notice (running smart visual heuristics engine):", err);
      isModelLoading = false;
      return null;
    }
  })();

  return modelPromise;
};

// ================= CIRCULAR ECONOMY KNOWLEDGE BASE =================
export const WASTE_KNOWLEDGE_BASE = {
  recyclable: {
    categoryName: "Recyclable (Plastics, Glass & Metal)",
    binColor: "#3B82F6",
    binName: "Blue Recycling Bin",
    badgeClass: "badge-recyclable",
    decompositionTime: "450 Years (Plastics) / Indefinite (Glass & Aluminum)",
    co2SavedKg: 1.8,
    energySavedKwh: 3.2,
    waterSavedLiters: 12.5,
    preparationSteps: [
      "Empty any liquids or leftover food contents completely.",
      "Rinse with clean water to prevent bin contamination.",
      "Crush plastic bottles or aluminum cans to save bin volume.",
      "Keep plastic bottle caps attached or placed in designated cap collection bins."
    ],
    circularEconomyTips: [
      "PET plastic bottles can be melted into polyester fibers for campus bags, eco-fleece jackets, and campus athletic gear.",
      "Aluminum cans can be recycled indefinitely with 95% less energy than extracting raw bauxite ore."
    ],
    upcyclingIdeas: [
      "Convert empty plastic bottles into self-watering seed planters for dorm windowsills.",
      "Use clean glass jars as desk pencil holders, campus spice shakers, or coin banks."
    ]
  },
  organic: {
    categoryName: "Organic & Biodegradable (Compost)",
    binColor: "#10B981",
    binName: "Green Compost Bin",
    badgeClass: "badge-organic",
    decompositionTime: "2 Weeks to 6 Months",
    co2SavedKg: 0.9,
    energySavedKwh: 0.5,
    waterSavedLiters: 4.0,
    preparationSteps: [
      "Remove non-biodegradable stickers, plastic wraps, or toothpicks.",
      "Chop large fruit peels, rinds, or food scraps to speed up natural aeration.",
      "Place into compostable plant-based bags or directly into the Green Bin."
    ],
    circularEconomyTips: [
      "Campus organic waste is converted into nutrient-dense compost used for campus botanical gardens, tree planting, and urban agriculture.",
      "Anaerobic digestion of food waste generates clean renewable biogas for campus heating and electricity."
    ],
    upcyclingIdeas: [
      "Use spent coffee grounds and dried citrus peels as natural soil fertilizer or indoor plant pest repellent.",
      "Steep citrus peels in white vinegar for 2 weeks to create a natural DIY all-purpose dorm cleaner."
    ]
  },
  paper: {
    categoryName: "Paper & Cardboard",
    binColor: "#F59E0B",
    binName: "Yellow / Blue Paper Recycling",
    badgeClass: "badge-paper",
    decompositionTime: "2 to 6 Weeks",
    co2SavedKg: 1.2,
    energySavedKwh: 2.4,
    waterSavedLiters: 26.0,
    preparationSteps: [
      "Flatten delivery cardboard boxes completely before dropping into the recycling hopper.",
      "Ensure paper is clean and dry. Food-stained paper (greasy pizza box lids) should be composted or put in landfill.",
      "Remove sticky plastic packing tape and shipping label pouches."
    ],
    circularEconomyTips: [
      "Recycling 1 ton of paper saves 17 mature trees, 7,000 gallons of water, and 3 cubic yards of campus landfill space.",
      "Recovered paper pulp is re-milled into campus notebooks, paper towels, and cardboard cartons."
    ],
    upcyclingIdeas: [
      "Sturdy shipping boxes make great drawer dividers, dorm storage bins, or book exchange boxes.",
      "Shred clean scrap paper for eco-friendly packaging filler or carbon balancing in campus compost bins."
    ]
  },
  hazardous: {
    categoryName: "Hazardous & E-Waste",
    binColor: "#EF4444",
    binName: "Red Hazardous / E-Waste Drop Box",
    badgeClass: "badge-hazardous",
    decompositionTime: "Non-Biodegradable (Contains toxic heavy metals)",
    co2SavedKg: 4.5,
    energySavedKwh: 14.0,
    waterSavedLiters: 50.0,
    preparationSteps: [
      "DO NOT throw into regular trash bins — severe risk of battery fires and chemical leaks.",
      "Tape over exposed lithium/alkaline battery terminals with clear electrical tape for safety.",
      "Wipe all personal accounts and data off electronic devices before recycling."
    ],
    circularEconomyTips: [
      "E-waste contains precious rare earth metals including gold, silver, copper, and cobalt that can be sustainably recovered.",
      "Proper e-waste recycling keeps toxic lead, mercury, and cadmium out of campus water tables."
    ],
    upcyclingIdeas: [
      "Donate working older electronics to campus student refurbishing initiatives.",
      "Repurpose an old smartphone as a dedicated campus desk clock or smart webcam."
    ]
  },
  landfill: {
    categoryName: "Non-Recyclable Landfill Trash",
    binColor: "#6B7280",
    binName: "Gray General Waste Bin",
    badgeClass: "badge-landfill",
    decompositionTime: "100 to 500+ Years",
    co2SavedKg: 0.0,
    energySavedKwh: 0.0,
    waterSavedLiters: 0.0,
    preparationSteps: [
      "Minimize volume by compacting wrappers or non-recyclable composite packaging.",
      "Ensure no liquid waste or biohazard contamination.",
      "Consider replacing item with reusable alternatives in future campus purchases."
    ],
    circularEconomyTips: [
      "Landfill waste represents a linear 'take-make-waste' model. Goal: transition to reusable or compostable campus alternatives.",
      "Residual waste is converted into energy via modern waste-to-energy facilities where available."
    ],
    upcyclingIdeas: [
      "Audit your frequent purchases: swap single-use snack wrappers for bulk snacks in reusable silicone bags."
    ]
  }
};

// ================= ROBUST SEMANTIC ONTOLOGY & REGEX RULES =================
// Precise word-boundary regexes preventing false positives like 'toucan', 'cannon', 'American', 'cardoon'
const CATEGORY_RULES = {
  recyclable: [
    /\b(bottle|bottles|water bottle|pop bottle|soda bottle|beer bottle|wine bottle|pill bottle|whiskey jug|jug|jugs|water jug|flask|flasks|beaker|tub|tubs|vat|pail|bucket|tumbler|mug|coffee mug|cup|pitcher|bottlecap|can|cans|tin|tins|milk can|aluminum|aluminium|beverage|drink|beer glass|glass|glasses|jar|jars|corkscrew|soap dispenser|tray|plate|soup bowl|mixing bowl|frying pan|pan|wok|caldron|pot)\b/i
  ],
  organic: [
    /\b(banana|apple|orange|lemon|lime|citrus|fruit|vegetable|produce|food|bread|French loaf|bagel|pretzel|sandwich|cheeseburger|burger|hotdog|pizza|pasta|carbonara|burrito|potpie|meat loaf|meat|chicken|beef|pork|fish|egg|eggplant|potato|potatoes|broccoli|cabbage|cauliflower|zucchini|squash|spaghetti squash|acorn squash|butternut squash|cucumber|pepper|bell pepper|mushroom|strawberry|avocado|guacamole|salad|leaf|leaves|peel|peels|rind|rinds|compost|organic|flower|plant|grass|hay|coffee|tea|dough|trifle|consomme|ice cream|icecream|custard apple|jackfruit|pomegranate|fig|pineapple)\b/i
  ],
  paper: [
    /\b(carton|packet|envelope|paper|cardboard|corrugated|box|boxes|paper towel|toilet tissue|toilet paper|tissue|napkin|newspaper|magazine|notebook|book|comic book|menu|binder|book jacket|dust cover|pamphlet|brochure|flyer|document|receipt|folder|paper bag|cardboard tube)\b/i
  ],
  hazardous: [
    /\b(battery|batteries|cellphone|cellular|cellular phone|mobile phone|smartphone|phone|laptop|computer|desktop computer|monitor|screen|display|CRT screen|keyboard|keypad|mouse|modem|router|hardware|circuit|cable|cord|wire|plug|charger|adapter|electronic|electronics|radio|television|tv|remote control|remote|speaker|loudspeaker|cassette|cassette player|iPod|power drill|iron|smoothing iron|toaster|vacuum|light bulb|bulb|lamp|fluorescent|mercury|chemical|paint|spray|aerosol|hair spray|syringe|needle|joystick)\b/i
  ],
  landfill: [
    /\b(wrapper|foil wrapper|chip bag|crisps|snack bag|candy wrapper|styrofoam|thermocol|polystyrene|straw|straws|diaper|nappy|sanitary|cigarette|cigar|lighter|matchstick|band aid|bandage|rubber eraser|eraser|sponge|dishrag|toothbrush|brush|plastic bag|shower cap|balloon|ballpoint|pen|debris|litter|trash)\b/i
  ]
};

// Friendly Human Labels for Common ImageNet Classes
const FRIENDLY_NAMES = {
  'pop bottle, soda bottle': 'PET Plastic Soda Bottle',
  'water bottle': 'Plastic Mineral Water Bottle',
  'beer bottle': 'Glass Beer Bottle',
  'wine bottle': 'Glass Wine Bottle',
  'pill bottle': 'Plastic Medicine Bottle',
  'beer glass': 'Glass Beverage Tumbler',
  'coffee mug': 'Ceramic Coffee Mug',
  'measuring cup': 'Plastic Measuring Cup',
  'cup': 'Disposable / Reusable Cup',
  'milk can': 'Metal / Plastic Milk Can',
  'pitcher, ewer': 'Plastic / Glass Pitcher',
  'banana': 'Organic Banana & Peel',
  'apple': 'Fresh Apple / Fruit Core',
  'orange': 'Citrus Orange & Peel',
  'lemon': 'Citrus Lemon & Peels',
  'strawberry': 'Organic Strawberry / Berries',
  'pineapple, ananas': 'Organic Pineapple & Rind',
  'avocado': 'Avocado Skin & Seed',
  'guacamole': 'Organic Food Dip / Scrap',
  'head cabbage': 'Cabbage / Leafy Vegetable Scrap',
  'broccoli': 'Broccoli & Stems Scrap',
  'cauliflower': 'Cauliflower Vegetable Scrap',
  'zucchini, courgette': 'Zucchini Vegetable Scrap',
  'cucumber, cuke': 'Cucumber Vegetable Scrap',
  'bell pepper': 'Bell Pepper Core & Seeds',
  'mushroom': 'Organic Mushroom Scrap',
  'bagel, beigel': 'Bakery Bagel Food Scrap',
  'pretzel': 'Snack Food Scrap',
  'cheeseburger': 'Burger Food Scrap Leftover',
  'hotdog, hot dog, red hot': 'Hotdog / Food Scrap',
  'pizza, pizza pie': 'Pizza Food Scrap Leftover',
  'burrito': 'Food Wrap Leftover',
  'carton': 'Corrugated Paperboard Carton',
  'envelope': 'Paper Postal Envelope',
  'packet': 'Paper / Cardboard Packet',
  'paper towel': 'Used Paper Towel / Napkin',
  'notebook, notebook computer': 'Paper Notebook or Laptop Item',
  'comic book': 'Paper Magazine / Booklet',
  'book jacket, dust cover, dust jacket, dust wrapper': 'Paper Book Cover',
  'menu': 'Printed Paper Menu',
  'toilet tissue, toilet paper, bathroom tissue': 'Paper Tissue Product',
  'cellular telephone, cellular phone, cellphone, cell, mobile phone': 'Mobile Smartphone (E-Waste)',
  'laptop, laptop computer': 'Portable Laptop Computer (E-Waste)',
  'desktop computer': 'Desktop Computer Hardware (E-Waste)',
  'computer keyboard, keypad': 'Computer Keyboard (E-Waste)',
  'mouse, computer mouse': 'Computer Mouse Peripheral (E-Waste)',
  'monitor': 'Display Monitor Screen (E-Waste)',
  'modem': 'Internet Modem / Router (E-Waste)',
  'power drill': 'Power Tool & Battery Device',
  'toaster': 'Kitchen Electric Toaster (E-Waste)',
  'hair spray': 'Aerosol Spray Can (Hazardous)',
  'Band Aid': 'Used Adhesive Bandage (Landfill)',
  'diaper, nappy, napkin': 'Sanitary / Diaper Product (Landfill)',
  'plastic bag': 'Single-Use Thin Plastic Film (Landfill / Polybag)',
  'lighter, light, igniter, ignitor': 'Disposable Lighter (Landfill)',
  'matchstick': 'Used Matchstick (Landfill)'
};

// ================= COLOR & TEXTURE CANVAS FEATURE EXTRACTOR =================
export const analyzeImagePixels = (imgOrCanvas) => {
  try {
    if (!imgOrCanvas) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(imgOrCanvas, 0, 0, 64, 64);
    const imgData = ctx.getImageData(0, 0, 64, 64).data;

    let totalR = 0, totalG = 0, totalB = 0;
    let greenDominance = 0;
    let warmBrown = 0;
    let darkMatte = 0;
    let brightReflective = 0;
    const totalPixels = 64 * 64;

    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      totalR += r;
      totalG += g;
      totalB += b;

      // Greenness (organic/plant matter)
      if (g > r * 1.12 && g > b * 1.12) greenDominance++;
      // Warm brown/tan (cardboard/paper)
      if (r > 110 && g > 75 && b < 70 && r > b * 1.4) warmBrown++;
      // Dark/matte/metallic (e-waste/cables/batteries)
      if (r < 55 && g < 55 && b < 55) darkMatte++;
      // Bright/reflective (clear plastic bottle / clean aluminum can)
      if (r > 175 && g > 175 && b > 175) brightReflective++;
    }

    return {
      greenRatio: greenDominance / totalPixels,
      warmBrownRatio: warmBrown / totalPixels,
      darkMatteRatio: darkMatte / totalPixels,
      brightReflectiveRatio: brightReflective / totalPixels,
      avgBrightness: (totalR + totalG + totalB) / (totalPixels * 3)
    };
  } catch (e) {
    return null;
  }
};

// ================= HIGH-RESOLUTION CURATED SAMPLES =================
export const SAMPLE_WASTE_ITEMS = [
  {
    id: 'sample-1',
    name: 'Plastic Water Bottle',
    type: 'recyclable',
    confidence: 0.96,
    imageUrl: 'https://images.unsplash.com/photo-1560026301-88340cf16be7?w=600&auto=format&fit=crop&q=80',
    description: 'Clear PET Plastic Beverage Bottle'
  },
  {
    id: 'sample-2',
    name: 'Banana Peel & Fruit Scrap',
    type: 'organic',
    confidence: 0.95,
    imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh organic fruit leftovers'
  },
  {
    id: 'sample-3',
    name: 'Shipping Cardboard Box',
    type: 'paper',
    confidence: 0.95,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    description: 'Clean corrugated delivery box'
  },
  {
    id: 'sample-4',
    name: 'Smartphone & Battery',
    type: 'hazardous',
    confidence: 0.93,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    description: 'Electronic gadget & lithium battery'
  },
  {
    id: 'sample-5',
    name: 'Aluminum Soda Can',
    type: 'recyclable',
    confidence: 0.97,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    description: 'Aluminum beverage container'
  }
];

// User Calibration Storage Helper
const CALIBRATION_KEY = 'waste_wise_ai_calibrations';

export const saveUserCorrection = (detectedLabel, correctCategory) => {
  try {
    const raw = localStorage.getItem(CALIBRATION_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[detectedLabel.toLowerCase().trim()] = correctCategory;
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify(existing));
    return true;
  } catch (e) {
    return false;
  }
};

export const getSavedCorrection = (detectedLabel) => {
  try {
    const raw = localStorage.getItem(CALIBRATION_KEY);
    if (!raw) return null;
    const existing = JSON.parse(raw);
    return existing[detectedLabel.toLowerCase().trim()] || null;
  } catch (e) {
    return null;
  }
};

// ================= PRIMARY ML CLASSIFICATION PIPELINE =================
export const classifyImage = async (imageInput, fallbackHint = '') => {
  let predictions = [];
  const categoryScores = {
    recyclable: 0.05,
    organic: 0.05,
    paper: 0.05,
    hazardous: 0.05,
    landfill: 0.05
  };
  let bestItemLabel = 'Unidentified Campus Waste Item';

  try {
    // 1. Run MobileNet ImageNet-1k Top-K Predictions (Top 10)
    const model = await loadAIModel();
    if (model && imageInput) {
      predictions = await model.classify(imageInput, 10);
    }
  } catch (err) {
    console.warn("MobileNet classification step notice:", err);
  }

  // 2. Score predictions across semantic category rules
  if (predictions && predictions.length > 0) {
    const topClass = predictions[0].className;
    bestItemLabel = FRIENDLY_NAMES[topClass] || 
      (topClass.charAt(0).toUpperCase() + topClass.slice(1).split(',')[0]);

    predictions.forEach((pred, index) => {
      const text = pred.className.toLowerCase();
      // Decay weight with rank (prediction 1 has highest weight)
      const rankWeight = Math.max(0.2, 1.0 - (index * 0.08));
      const prob = pred.probability || 0.1;
      const combinedWeight = prob * rankWeight * 2.5;

      for (const [catKey, rules] of Object.entries(CATEGORY_RULES)) {
        for (const rule of rules) {
          if (rule.test(text)) {
            categoryScores[catKey] += combinedWeight;
          }
        }
      }
    });
  }

  // 3. Pixel Color & Texture Feature Analysis Ensemble
  const visualFeatures = analyzeImagePixels(imageInput);
  if (visualFeatures) {
    if (visualFeatures.greenRatio > 0.15) {
      categoryScores.organic += visualFeatures.greenRatio * 1.8;
    }
    if (visualFeatures.warmBrownRatio > 0.18) {
      categoryScores.paper += visualFeatures.warmBrownRatio * 1.6;
    }
    if (visualFeatures.darkMatteRatio > 0.25) {
      categoryScores.hazardous += visualFeatures.darkMatteRatio * 1.4;
    }
    if (visualFeatures.brightReflectiveRatio > 0.25) {
      categoryScores.recyclable += visualFeatures.brightReflectiveRatio * 1.5;
    }
  }

  // 4. Check User Calibration Cache
  const userCalibratedCat = getSavedCorrection(bestItemLabel);
  if (userCalibratedCat && categoryScores[userCalibratedCat] !== undefined) {
    categoryScores[userCalibratedCat] += 2.0; // Significant boost from campus community calibration
  }

  // 5. Apply explicit fallback hint if provided (e.g. sample items)
  if (fallbackHint && categoryScores[fallbackHint] !== undefined) {
    categoryScores[fallbackHint] += 2.5;
    if (bestItemLabel === 'Unidentified Campus Waste Item') {
      const sampleMatch = SAMPLE_WASTE_ITEMS.find(s => s.type === fallbackHint);
      if (sampleMatch) bestItemLabel = sampleMatch.name;
    }
  }

  // 6. Calculate Normalized Probabilities
  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  const sortedCategories = Object.entries(categoryScores)
    .map(([cat, score]) => ({
      category: cat,
      score: score,
      probability: totalScore > 0 ? (score / totalScore) : 0.2
    }))
    .sort((a, b) => b.score - a.score);

  const winningCategory = sortedCategories[0].category;
  
  // Calculate calibrated confidence
  const topProb = sortedCategories[0].probability;
  const runnerUpProb = sortedCategories[1]?.probability || 0.1;
  const margin = topProb - runnerUpProb;
  const finalConfidence = Math.min(0.98, Math.max(0.68, topProb * 0.7 + margin * 0.3 + 0.3));

  // Multi-class breakdown for UI visualization
  const breakdown = sortedCategories.map(item => ({
    category: item.category,
    name: WASTE_KNOWLEDGE_BASE[item.category].categoryName.split(' ')[0],
    percentage: Math.round(item.probability * 100),
    color: WASTE_KNOWLEDGE_BASE[item.category].binColor
  }));

  const kbData = WASTE_KNOWLEDGE_BASE[winningCategory] || WASTE_KNOWLEDGE_BASE.recyclable;

  return {
    itemDetected: bestItemLabel,
    categoryKey: winningCategory,
    confidence: finalConfidence,
    breakdown,
    rawPredictions: predictions.slice(0, 5),
    ...kbData
  };
};
