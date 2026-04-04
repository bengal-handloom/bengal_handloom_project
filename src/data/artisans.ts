export type Artisan = {
    key: string; // e.g. "asansol_khadi_workers"
    seriesLabel: string; // e.g. "HERITAGE SERIES"
    name: string; // e.g. "The Roy Family"
    location: string; // e.g. "Varanasi, India"
    badge?: string; // e.g. "MASTER WEAVER"
    quote?: string;
  
    heroImageUrl: string; // big background
    portraitImageUrl: string; // left portrait
  
    intro: string; // short paragraph under title
  
    metrics: { label: string; value: string }[]; // small stat pills
  
    timeline: {
      year: string;
      title: string;
      body: string;
    }[];
  
    craft: {
      heading: string;
      bullets: string[];
    };
  
    gallery?: string[]; // optional images
  };
  
  export const ARTISANS: Artisan[] = [
    {
      key: "asansol_khadi_workers",
      seriesLabel: "HERITAGE SERIES",
      name: "Asansol Khadi Workers",
      location: "Asansol, West Bengal",
      badge: "HANDSPUN COLLECTIVE",
      quote: "Every thread carries the memory of my father's hands.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1520975869010-94fefb66a5b0?w=2000&q=80",
      portraitImageUrl:
        "https://images.unsplash.com/photo-1520975919018-7d0c85d8cdbf?w=1200&q=80",
      intro:
        "For over a century, these hands have shaped khadi into cloth that breathes with patience—handspun, handwoven, and quietly radical.",
      metrics: [
        { label: "Technique", value: "Hand-spun Khadi" },
        { label: "Legacy", value: "100+ Years" },
      ],
      timeline: [
        {
          year: "1924",
          title: "The Foundation",
          body: "A small spinning circle becomes a cooperative—passing craft through families and apprentices.",
        },
        {
          year: "1960",
          title: "The Golden Expansion",
          body: "Local demand grows; looms multiply. Natural fibers and disciplined finishing define the signature handfeel.",
        },
        {
          year: "1995",
          title: "Global Recognition",
          body: "Small batches reach ateliers abroad—each meter inspected and signed off by senior weavers.",
        },
        {
          year: "2024",
          title: "The Modern Vow",
          body: "Carbon-aware production and fair-wage commitments sustain the craft without compromising integrity.",
        },
      ],
      craft: {
        heading: "How this cloth is made",
        bullets: [
          "Handspun yarns for breathability and texture",
          "Low-tension weaving to preserve natural slub",
          "Plant-based finishing for softness without shine",
        ],
      },
      gallery: [
        "https://images.unsplash.com/photo-1520975693411-b44f5d6c62c1?w=1600&q=80",
        "https://images.unsplash.com/photo-1520975708795-0ce7b3a8d656?w=1600&q=80",
      ],
    },
  ];
  
  export const ARTISAN_KEYS = ARTISANS.map((a) => a.key);
  export const getArtisanByKey = (key: string) => ARTISANS.find((a) => a.key === key);