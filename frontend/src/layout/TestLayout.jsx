import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/Dashboard';
import StatsOverview from '@/components/StatsOverview';
import ChampionShowcase from '@/components/ChampionShowcase';
import PlaystyleAnalysis from '@/components/PlaystyleAnalysis';
import TimelineSection from '@/components/TimelineSection';
import ClosingSection from '@/components/ClosingSection';
import ScrollingBackground from '@/components/ScrollingBackground';
import CardRevealSection from '@/components/BestDuo';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ScrollingBackground />
      <div className="relative z-10">
        <HeroSection />
        <TimelineSection />
        <ClosingSection />
      </div>
    </div>
  );
};

export default Index;