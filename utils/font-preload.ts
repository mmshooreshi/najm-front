// utils/font-preload.ts
// Preload strictly the single critical body font weight for initial above-the-fold render
// Additional weights load asynchronously on-demand with font-display: swap to prevent mobile network choking
export const fontPreloadLinks = [
  {
    rel: 'preload' as const,
    href: '/fonts/woff2/IRANSansX-Regular.woff2',
    as: 'font' as const,
    type: 'font/woff2' as const,
    crossorigin: 'anonymous' as const
  }
];

