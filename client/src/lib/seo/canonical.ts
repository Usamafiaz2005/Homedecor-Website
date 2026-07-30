export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://Homedecor.com';
  return `${baseUrl}${path}`;
}