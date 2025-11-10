const sample_artworks = [{
    id: 1,
    title: "Sunset Over Cebu",
    artist: { id: 1, name: "Juan dela Cruz" },
    description: "A beautiful painting capturing the essence of a Cebu sunset.",
    medium: "oil on canvas",
    heightCm: 60,
    widthCm: 80,
    images: [
        {
            id: 1,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        },
        {
            id: 16,
            isPrimary: false,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }        
    ],
    tags: ["sunset", "cebu", "painting"],
    style: "impressionism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1500.00 },
      { durationMonths: 6, rentalFee: 2800.00 },
      { durationMonths: 12, rentalFee: 5000.00 }
    ],
    status: "available",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z"
  },
  {
    id: 2,
    title: "Manila Bay Dreams",
    artist: { id: 2, name: "Maria Santos" },
    description: "An abstract representation of the bustling life around Manila Bay.",
    medium: "acrylic on canvas",
    heightCm: 90,
    widthCm: 120,
    images: [
        {
            id: 2,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        },
        {
            id: 17,
            isPrimary: false,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        },
        {
            id: 18,
            isPrimary: false,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["manila", "bay", "abstract", "citylife"],
    style: "abstract",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 2000.00 },
      { durationMonths: 6, rentalFee: 3700.00 },
      { durationMonths: 12, rentalFee: 6800.00 }
    ],
    status: "available",
    createdAt: "2024-02-01T14:30:00Z",
    updatedAt: "2024-02-05T16:45:00Z"
  },
  {
    id: 3,
    title: "Banaue Rice Terraces",
    artist: { id: 3, name: "Roberto Villanueva" },
    description: "A detailed landscape painting of the iconic Banaue Rice Terraces.",
    medium: "watercolor",
    heightCm: 45,
    widthCm: 65,
    images: [
        {
            id: 3,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["banaue", "rice terraces", "landscape", "heritage"],
    style: "realism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1200.00 },
      { durationMonths: 6, rentalFee: 2200.00 },
      { durationMonths: 12, rentalFee: 4000.00 }
    ],
    status: "available",
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-02-12T11:20:00Z"
  },
  {
    id: 4,
    title: "Urban Rhythm",
    artist: { id: 4, name: "Carlos Mendoza" },
    description: "A contemporary piece capturing the energy of modern Filipino street life.",
    medium: "mixed media",
    heightCm: 100,
    widthCm: 80,
    images: [
        {
            id: 4,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["urban", "contemporary", "street", "modern"],
    style: "contemporary",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 2500.00 },
      { durationMonths: 6, rentalFee: 4600.00 },
      { durationMonths: 12, rentalFee: 8500.00 }
    ],
    status: "available",
    createdAt: "2024-02-18T13:45:00Z",
    updatedAt: "2024-02-20T15:10:00Z"
  },
  {
    id: 5,
    title: "Fisherman's Dawn",
    artist: { id: 5, name: "Ana Reyes" },
    description: "A serene portrayal of fishermen preparing their nets at dawn.",
    medium: "oil on canvas",
    heightCm: 70,
    widthCm: 100,
    images: [
        {
            id: 5,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["fisherman", "dawn", "sea", "traditional"],
    style: "realism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1800.00 },
      { durationMonths: 6, rentalFee: 3300.00 },
      { durationMonths: 12, rentalFee: 6000.00 }
    ],
    status: "available",
    createdAt: "2024-02-25T08:20:00Z",
    updatedAt: "2024-02-28T10:35:00Z"
  },
  {
    id: 6,
    title: "Tropical Monsoon",
    artist: { id: 6, name: "Luis Garcia" },
    description: "An expressive painting depicting the power and beauty of tropical storms.",
    medium: "acrylic on canvas",
    heightCm: 120,
    widthCm: 90,
    images: [
        {
            id: 6,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["monsoon", "tropical", "storm", "nature"],
    style: "expressionism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 2200.00 },
      { durationMonths: 6, rentalFee: 4000.00 },
      { durationMonths: 12, rentalFee: 7300.00 }
    ],
    status: "available",
    createdAt: "2024-03-05T16:00:00Z",
    updatedAt: "2024-03-08T12:15:00Z"
  },
  {
    id: 7,
    title: "Mindanao Highlands",
    artist: { id: 7, name: "Isabella Torres" },
    description: "A vibrant landscape showcasing the rolling hills of Mindanao.",
    medium: "pastel on paper",
    heightCm: 40,
    widthCm: 60,
    images: [
        {
            id: 7,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["mindanao", "highlands", "landscape", "pastoral"],
    style: "impressionism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1000.00 },
      { durationMonths: 6, rentalFee: 1800.00 },
      { durationMonths: 12, rentalFee: 3200.00 }
    ],
    status: "available",
    createdAt: "2024-03-12T11:30:00Z",
    updatedAt: "2024-03-15T14:50:00Z"
  },
  {
    id: 8,
    title: "Jeepney Dreams",
    artist: { id: 8, name: "Miguel Cruz" },
    description: "A colorful tribute to the iconic Filipino jeepney and its cultural significance.",
    medium: "spray paint on canvas",
    heightCm: 80,
    widthCm: 120,
    images: [
        {
            id: 8,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["jeepney", "culture", "transportation", "colorful"],
    style: "pop art",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1900.00 },
      { durationMonths: 6, rentalFee: 3500.00 },
      { durationMonths: 12, rentalFee: 6400.00 }
    ],
    status: "rented",
    createdAt: "2024-03-20T10:45:00Z",
    updatedAt: "2024-03-25T13:20:00Z"
  },
  {
    id: 9,
    title: "Tarsier's Gaze",
    artist: { id: 9, name: "Patricia Lim" },
    description: "An intimate portrait study of the Philippine tarsier in its natural habitat.",
    medium: "charcoal on paper",
    heightCm: 30,
    widthCm: 40,
    images: [
        {
            id: 9,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["tarsier", "wildlife", "portrait", "conservation"],
    style: "realism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 800.00 },
      { durationMonths: 6, rentalFee: 1400.00 },
      { durationMonths: 12, rentalFee: 2500.00 }
    ],
    status: "available",
    createdAt: "2024-03-28T15:10:00Z",
    updatedAt: "2024-04-02T09:25:00Z"
  },
  {
    id: 10,
    title: "Cordillera Spirits",
    artist: { id: 10, name: "Emmanuel Ramos" },
    description: "A mystical representation of ancestral spirits in the Cordillera mountains.",
    medium: "oil on wood",
    heightCm: 150,
    widthCm: 100,
    images: [
        {
            id: 10,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["cordillera", "spirits", "ancestral", "mystical"],
    style: "surrealism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 3000.00 },
      { durationMonths: 6, rentalFee: 5500.00 },
      { durationMonths: 12, rentalFee: 10000.00 }
    ],
    status: "available",
    createdAt: "2024-04-05T12:40:00Z",
    updatedAt: "2024-04-08T16:55:00Z"
  },
  {
    id: 11,
    title: "Boracay Breeze",
    artist: { id: 11, name: "Sofia Hernandez" },
    description: "A peaceful seascape capturing the tranquil beauty of Boracay's white sand beaches.",
    medium: "watercolor",
    heightCm: 50,
    widthCm: 70,
    images: [
        {
            id: 11,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["boracay", "beach", "seascape", "peaceful"],
    style: "impressionism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1400.00 },
      { durationMonths: 6, rentalFee: 2500.00 },
      { durationMonths: 12, rentalFee: 4500.00 }
    ],
    status: "available",
    createdAt: "2024-04-12T07:15:00Z",
    updatedAt: "2024-04-15T11:30:00Z"
  },
  {
    id: 12,
    title: "Vigan Heritage",
    artist: { id: 12, name: "Ricardo Delgado" },
    description: "A nostalgic portrayal of colonial architecture in historic Vigan City.",
    medium: "oil on canvas",
    heightCm: 75,
    widthCm: 100,
    images: [
        {
            id: 12,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["vigan", "heritage", "colonial", "architecture"],
    style: "realism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1700.00 },
      { durationMonths: 6, rentalFee: 3100.00 },
      { durationMonths: 12, rentalFee: 5600.00 }
    ],
    status: "available",
    createdAt: "2024-04-20T09:30:00Z",
    updatedAt: "2024-04-23T14:20:00Z"
  },
  {
    id: 13,
    title: "Kalinga Textile Weave",
    artist: { id: 13, name: "Carmen Aguilar" },
    description: "An intricate study of traditional Kalinga textile patterns and their cultural meanings.",
    medium: "fabric collage on canvas",
    heightCm: 60,
    widthCm: 80,
    images: [
        {
            id: 13,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["kalinga", "textile", "traditional", "patterns"],
    style: "folk art",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1600.00 },
      { durationMonths: 6, rentalFee: 2900.00 },
      { durationMonths: 12, rentalFee: 5200.00 }
    ],
    status: "maintenance",
    createdAt: "2024-04-28T11:45:00Z",
    updatedAt: "2024-05-02T16:10:00Z"
  },
  {
    id: 14,
    title: "Metro Manila Rush",
    artist: { id: 14, name: "Antonio Silva" },
    description: "A dynamic abstract piece representing the fast-paced energy of Manila's metropolitan life.",
    medium: "acrylic and ink on canvas",
    heightCm: 110,
    widthCm: 140,
    images: [
        {
            id: 14,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["metro manila", "rush", "urban", "dynamic"],
    style: "abstract expressionism",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 2800.00 },
      { durationMonths: 6, rentalFee: 5100.00 },
      { durationMonths: 12, rentalFee: 9300.00 }
    ],
    status: "available",
    createdAt: "2024-05-05T08:20:00Z",
    updatedAt: "2024-05-08T12:35:00Z"
  },
  {
    id: 15,
    title: "Sagada Caves Mystery",
    artist: { id: 15, name: "Beatriz Morales" },
    description: "A haunting exploration of the mysterious limestone caves and hanging coffins of Sagada.",
    medium: "tempera on paper",
    heightCm: 55,
    widthCm: 75,
    images: [
        {
            id: 15,
            isPrimary: true,
            imageUrl: "https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-portrait.png"
        }
    ],
    tags: ["sagada", "caves", "mystery", "limestone"],
    style: "gothic",
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1300.00 },
      { durationMonths: 6, rentalFee: 2400.00 },
      { durationMonths: 12, rentalFee: 4300.00 }
    ],
    status: "available",
    createdAt: "2024-05-12T13:55:00Z",
    updatedAt: "2024-05-15T10:40:00Z"
  }];