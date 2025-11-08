import { ScrollArea } from "@/components/ui/scroll-area"
import BasicInfo from "@/components/BasicInfo";
import StatsOverview from "@/components/StatsOverview";
import Achievements from "@/components/Achievements";
import BestDuo from "@/components/BestDuo";

export default function Dashboard({ playerData }) {
  return (
    <section className="flex flex-col lg:flex-row gap-4 w-full px-6 py-8 bg-background min-h-screen">
      {/* Left Panel */}
      <div className="w-full lg:w-1/4 lg:sticky top-8 self-start">
        <div className="h-screen bg-card rounded-2xl shadow-sm border border-border max-h-[calc(100vh-4rem)]">
          <ScrollArea className="h-full p-4">
            <BasicInfo playerData={playerData} />
          </ScrollArea>
        </div>
      </div>

      {/* Center Panel (auto expands) */}
      <div className="flex-1 min-w-0">
        <div className="h-screen bg-card rounded-2xl shadow-sm border border-border max-h-[calc(100vh-4rem)]">
          <ScrollArea className="h-full p-4">
            <StatsOverview playerData={playerData} />
          </ScrollArea>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/4 xl:w-1/5 lg:sticky top-8 self-start">
        <div className="h-screen flex flex-col bg-card rounded-2xl shadow-sm border border-border max-h-[calc(100vh-4rem)]">
          <ScrollArea className="h-full p-4">
            <Achievements playerData={playerData} />
            <BestDuo playerData={playerData}/>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
