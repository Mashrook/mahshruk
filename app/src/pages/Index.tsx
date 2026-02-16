import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { FeaturedHotels } from "@/components/home/FeaturedHotels";
import { WeeklyOffers } from "@/components/home/WeeklyOffers";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { LatestArticles } from "@/components/home/LatestArticles";
import { ContactSection } from "@/components/home/ContactSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedDestinations />
      <FeaturedHotels />
      <WeeklyOffers />
      <WhyChooseUs />
      <Testimonials />
      <LatestArticles />
      <ContactSection />
    </Layout>
  );
};

export default Index;
