import GuideBanner from '@/components/GuideBanner'
import BottomNav from '@/components/BottomNav'
import HeroSection from '@/components/sections/HeroSection'
import AccessSection from '@/components/sections/AccessSection'
import CheckInSection from '@/components/sections/CheckInSection'
import AmenitiesSection from '@/components/sections/AmenitiesSection'
import HouseRulesSection from '@/components/sections/HouseRulesSection'
import ActivitiesSection from '@/components/sections/ActivitiesSection'
import RestaurantsSection from '@/components/sections/RestaurantsSection'
import WalksSection from '@/components/sections/WalksSection'
import EmergenciesSection from '@/components/sections/EmergenciesSection'
import GallerySection from '@/components/sections/GallerySection'

export default function GuidePage() {
  return (
    <>
      <GuideBanner />
      <main className="pb-24 min-h-screen">
        <HeroSection />
        <AccessSection />
        <CheckInSection />
        <AmenitiesSection />
        <HouseRulesSection />
        <ActivitiesSection />
        <RestaurantsSection />
        <WalksSection />
        <EmergenciesSection />
        <GallerySection />
      </main>
      <BottomNav />
    </>
  )
}
