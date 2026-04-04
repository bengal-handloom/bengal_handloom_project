import type { WholesaleFabric } from "@/types/wholesale";

export const VERIFIED_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCOgIIrE3lmXjRGCU7-XeOXswwS1pEXvkUZ9_CSvEpkaqmcbHaA7q0yoCoHIzDQeGFyi8o9bKpUxbhkun9yliCRs6IuACl77-boeg9rl-eEdEgo5Hh1ziXiOcpy2MZkH1jhxIwkWWEwu-S-SkTOdnlb6fjeu6VYpw0WprqxEdNXtrZqN2CYMlhPL-TU4v56jImqjKQqjENqxdInjhYGKFSTrbjaBZPO1tlMLKNquzPzheK8SE_xUvXo7s4qSLOxrQKauY6c1BXcY2RB";

export const WHOLESALE_FABRICS: WholesaleFabric[] = [
  {
    id: "ws-1",
    name: "Midnight Silk Jacquard",
    pricePerMeter: "$45.00",
    origin: "West Bengal",
    gsm: "120",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcBCfBmwAj7NhpoT4Yn0VddCbNRvvM5vK8GoUmahD33-JYJGq1Tg8pbrJ0kfvAfvS3tUuRYREXs5yWGeM83Gk9V-lbPpWtgmf_6rDKbJOM5xJVeZeAUMUOgsrOLhd3kjx3ZN4urrXiXCkfnqwM7yw2BqkElr5c7Sn57uWpFRGyTR6qVf6BXpRWp_o4oLdFm0o3deuhH0BHeUS-WlkZVLJyYwHgntVYJ4i--jT5PhRmu-w9ZvEKnzuq22cQo2kfSkg2L8VrWZ12ocJk",
    badge: "PREMIUM",
    handFeel: { softness: 80, structure: 40 },
    capacityTotal: 1000,
    capacityLeft: 300,
    capacityStatus: "normal",
  },
  {
    id: "ws-2",
    name: "Bengal Raw Silk",
    pricePerMeter: "$38.50",
    origin: "Murshidabad",
    gsm: "180",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArKpz52p42vHnHL76SNHU0zC613SZjv8cxlnrgRZJBvYPSv1bUOHpfvBkGdpHosJAxjJkDv0M76EvuqPNqpJ5wytP5UEmM8mLEZtvkOKL5N3Jq7iCSEcAh0swWiPXsxo7aBWSa0C0FEyS1x4Ojrr8__QJR7ubVuOiv0PbqyR5gXKoSU0tFo_6cMsxzlSFi-ciHbwslkgtmm1HPjvlLX2-yRNOQGwcf-4QT_utfyEuO3jsonaGmV010mS2ZmSETTuGFsAY95eXhDgvW",
    handFeel: { softness: 40, structure: 90 },
    capacityTotal: 1400,
    capacityLeft: 1200,
    capacityStatus: "high",
  },
  {
    id: "ws-3",
    name: "Varanasi Gold Zari",
    pricePerMeter: "$62.00",
    origin: "Varanasi",
    gsm: "145",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJt963LxXWndG1-5o9VrMH9cT6Ny86K69U1Ns1_8D1prpzpbcjffyAqpiL93qj0KwdKVguLC0Csc4Zd5VbXDpXJ6wWf_QRpvWNNaEWpZR84vU6tDX_0MBirL7UoxBXwqIgVcWaEeF_0QU1gbbJwXh96ESa3jUHQuNw3wgUEbBBsL5LhmWXUpw_LXAvWK_oqDMlcsCKErEw6B1yXRrgjxSN_sEJ0ctEziaAuEq4TFHArAfNR3qLKacXv-fhpnEQ_LI56RCGyYC_YYZY",
    badge: "NEW ARRIVAL",
    handFeel: { softness: 60, structure: 75 },
    capacityTotal: 300,
    capacityLeft: 45,
    capacityStatus: "low",
  },
];