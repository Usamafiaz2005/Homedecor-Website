import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://Homedecor.com';

  // These are your core static routes
  const staticRoutes = ['', '/shop', '/contact', '/shipping', '/returns'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a full production environment, you would fetch your product slugs here 
  // and map them into the sitemap array alongside the static routes.

  return [...staticRoutes];
}