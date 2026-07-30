export function generateBreadcrumbSchema(
  productTitle: string, 
  categoryName: string, 
  categorySlug: string, 
  productUrl: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://Homedecor.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        // Assuming your category filtering works via a query param or slug
        item: `${baseUrl}/shop?category=${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productTitle,
        item: productUrl.startsWith('http') ? productUrl : `${baseUrl}${productUrl}`,
      }
    ],
  };
}