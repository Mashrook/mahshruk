import HeroSection from "@/components/home/HeroSection";
import SeasonalPackages from "@/components/home/SeasonalPackages";
import FeaturedOffer from "@/components/home/FeaturedOffer";
import PopularPackages from "@/components/home/PopularPackages";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import ActivitiesSection from "@/components/home/ActivitiesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AppDownloadCTA from "@/components/home/AppDownloadCTA";
import ArticlesSection from "@/components/home/ArticlesSection";
import ContactSection from "@/components/home/ContactSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SeasonalPackages />
      <FeaturedOffer />
      <PopularPackages />
      <FeaturedHotels />
      <ActivitiesSection />
      <TestimonialsSection />
      <AppDownloadCTA />
      <ArticlesSection />
      <ContactSection />
    </div>
  );
}
