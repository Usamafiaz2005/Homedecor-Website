import PremiumHero from '@/components/home/PremiumHero';
import AnimatedBrandStory from '@/components/home/AnimatedBrandStory';
import BestSellers from '@/components/home/BestSellers';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

export default function HomePage() {
  return (
    <main>
      <PremiumHero />
      <BestSellers />
      <AnimatedBrandStory />
      <NewsletterForm />
    </main>
  );
}