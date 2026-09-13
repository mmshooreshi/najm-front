// utils/font-preload.ts
// Only preload critical weights needed for initial above-the-fold render
const criticalWeights = ['Regular', 'Bold', 'DemiBold'] as const;
const criticalD4Weights = ['Regular', 'Bold', 'Black'] as const;

export const fontPreloadLinks = [
  ...criticalWeights.map((w) => ({
    rel: 'preload' as const,
    href: `/fonts/woff2/IRANSansX-${w}.woff2`,
    as: 'font' as const,
    type: 'font/woff2' as const,
    crossorigin: 'anonymous' as const
  })),
  ...criticalD4Weights.map((w) => ({
    rel: 'preload' as const,
    href: `/fonts/d4/IRANSansX-${w}D4.woff2`,
    as: 'font' as const,
    type: 'font/woff2' as const,
    crossorigin: 'anonymous' as const
  }))
];

