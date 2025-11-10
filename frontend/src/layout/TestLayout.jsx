import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/Dashboard';
import ClosingSection from '@/components/ClosingSection';
import ScrollingBackground from '@/components/ScrollingBackground';

import { usePlayer } from '@/context/PlayerContext';

const Index = () => {
  const { playerData } = usePlayer();

  if (!playerData) return <p>No data loaded yet.</p>;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ScrollingBackground />
      <div className="relative z-10">
        <HeroSection player={playerData.summoner}/>
        <Dashboard playerData={playerData}/>
        <ClosingSection player={playerData.summoner}/>
      </div>
    </div>
  );
};

export default Index;