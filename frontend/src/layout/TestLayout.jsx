import HeroSection from '@/components/HeroSection';
import StatsOverview from '@/components/StatsOverview';
import ChampionShowcase from '@/components/ChampionShowcase';
import PlaystyleAnalysis from '@/components/PlaystyleAnalysis';
import AchievementsSection from '@/components/AchievementsSection';
import TimelineSection from '@/components/TimelineSection';
import ClosingSection from '@/components/ClosingSection';
import ScrollingBackground from '@/components/ScrollingBackground';
import CardRevealSection from '@/components/CardRevealSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ScrollingBackground />
      <div className="relative z-10">
        <HeroSection />
        <StatsOverview />
        <ChampionShowcase />
        <CardRevealSection />
        <PlaystyleAnalysis />
        <TimelineSection />
        <AchievementsSection />
        <ClosingSection />
      </div>
    </div>
  );
};

export default Index;