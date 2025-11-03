import BasicInfo from "@/components/BasicInfo";
import StatsOverview from "@/components/StatsOverview";
import Achievements from "@/components/Achievements";
import BestDuo from "@/components/BestDuo";

const playerData = {
  summoner: {
    name: "ShadowAssassin",
    level: 247,
    rank: "Diamond II",
    lp: 63,
    winRate: 54.2,
    region: "NA",
  },
  yearStats: {
    gamesPlayed: 487,
    wins: 264,
    losses: 223,
    hoursPlayed: 324,
    totalKills: 3892,
    totalDeaths: 3124,
    totalAssists: 4567,
    pentakills: 7,
    quadrakills: 34,
    triplekills: 156,
  },
  performanceMetrics: [
    { metric: "Farming", value: 78, description: "CS per minute and gold efficiency" },
    { metric: "Vision", value: 65, description: "Ward placement and map awareness" },
    { metric: "Aggression", value: 85, description: "Early game pressure and kill participation" },
    { metric: "Teamplay", value: 72, description: "Objective control and team coordination" },
    { metric: "Consistency", value: 68, description: "Performance stability across games" },
    { metric: "Versatility", value: 58, description: "Champion pool diversity and adaptability" },
  ],
  monthlyProgress: [
    { month: "Jan", wins: 45, losses: 38, kda: 3.2 },
    { month: "Feb", wins: 52, losses: 41, kda: 3.5 },
    { month: "Mar", wins: 38, losses: 45, kda: 2.9 },
    { month: "Apr", wins: 48, losses: 39, kda: 3.4 },
    { month: "May", wins: 55, losses: 35, kda: 3.8 },
    { month: "Jun", wins: 26, losses: 25, kda: 3.3 },
  ],
  topChampions: [
    { name: "Yasuo", games: 87, winRate: 58, kda: 3.9, role: "Mid" },
    { name: "Zed", games: 65, winRate: 61, kda: 4.2, role: "Mid" },
    { name: "Lee Sin", games: 54, winRate: 52, kda: 3.4, role: "Jungle" },
    { name: "Thresh", games: 43, winRate: 56, kda: 3.1, role: "Support" },
    { name: "Vayne", games: 38, winRate: 55, kda: 3.7, role: "ADC" },
  ],
  roleDistribution: [
    { role: "Mid", value: 40.7 },
    { role: "Jungle", value: 25.7 },
    { role: "ADC", value: 18.3 },
    { role: "Support", value: 10.7 },
    { role: "Top", value: 4.7 },
  ],
  recentAchievements: [
    { title: "Pentakill Master", description: "Earned 7 pentakills this year", icon: "🔥" },
    { title: "Consistency King", description: "20+ game win streak", icon: "👑" },
    { title: "One-Trick Wonder", description: "100+ games on Yasuo", icon: "⚔️" },
    { title: "Vision Master", description: "Placed 10,000+ wards", icon: "👁️" },
  ],
};

export default function Dashboard() {
  return (
    <section className="flex flex-col lg:flex-row gap-4 w-full px-6 py-8 bg-background min-h-screen">
      {/* Left Panel */}
      <div className="w-full lg:w-1/4 lg:sticky top-8 self-start">
        <div className="h-screen bg-card rounded-2xl shadow-sm border border-border p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <BasicInfo playerData={playerData} />
        </div>
      </div>

      {/* Center Panel (auto expands) */}
      <div className="flex-1 min-w-0">
        <div className="h-screen bg-card rounded-2xl shadow-sm border border-border p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <StatsOverview playerData={playerData} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/4 xl:w-1/5 lg:sticky top-8 self-start">
        <div className="h-screen flex flex-col bg-card rounded-2xl shadow-sm border border-border p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Achievements playerData={playerData} />
          <BestDuo />
        </div>
      </div>
    </section>
  );
}
