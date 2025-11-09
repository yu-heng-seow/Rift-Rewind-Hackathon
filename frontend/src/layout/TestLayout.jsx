import { useLocation } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import ClosingSection from "@/components/ClosingSection";
import ScrollingBackground from "@/components/ScrollingBackground";
import HeroSection from "@/components/HeroSection";

// This is now the BASE template data.
// It will be used as a fallback if fetching fails
// or for components your agent doesn't provide data for.
const basePlayerData = {
  summoner: {
    name: "ShadowAssassin",
    avatar:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
    mainChampion: "Yasuo",
    championIcon:
      "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Yasuo.png",
    level: 247,
    rank: "Diamond II",
    lp: 63,
    kda: "2.5:1",
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
  insights: [
    {
      title: "Aggressive Playstyle",
      description:
        "You averaged 8.2 kills per game, showing a proactive approach to teamfights",
      icon: "⚔️",
    },
    {
      title: "Vision Master",
      description: "487 wards placed - keeping your team informed and safe",
      icon: "👁️",
    },
  ],
  performanceMetrics: [
    {
      metric: "Farming",
      value: 78,
      description: "CS per minute and gold efficiency",
    },
    {
      metric: "Vision",
      value: 65,
      description: "Ward placement and map awareness",
    },
    {
      metric: "Aggression",
      value: 85,
      description: "Early game pressure and kill participation",
    },
    {
      metric: "Teamplay",
      value: 72,
      description: "Objective control and team coordination",
    },
    {
      metric: "Consistency",
      value: 68,
      description: "Performance stability across games",
    },
    {
      metric: "Versatility",
      value: 58,
      description: "Champion pool diversity and adaptability",
    },
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
    {
      name: "Yasuo",
      mastery: 7,
      points: "487,392",
      games: 87,
      winRate: 58,
      kda: 3.9,
      role: "Mid",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
    },
    {
      name: "Zed",
      mastery: 7,
      points: "412,847",
      games: 65,
      winRate: 61,
      kda: 4.2,
      role: "Mid",
      image:
        "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg",
    },
  ],
  roleDistribution: [
    { role: "Mid", value: 40.7 },
    { role: "Jungle", value: 25.7 },
    { role: "ADC", value: 18.3 },
    { role: "Support", value: 10.7 },
    { role: "Top", value: 4.7 },
  ],
  recentAchievements: [
    {
      title: "Pentakill Master",
      description: "Earned 7 pentakills this year",
      icon: "🔥",
    },
    {
      title: "Consistency King",
      description: "20+ game win streak",
      icon: "👑",
    },
  ],
  bestDuo: {
    name: "StormBringer",
    avatar:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malphite_0.jpg",
    mainChampion: "Malphite",
    championIcon:
      "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Malphite.png",
    rank: "Diamond III",
    winRate: 58,
    kda: "2.8:1",
    gamesPlayed: 412,
    performanceMetrics: [
      { metric: "Farming", value: 72 },
      { metric: "Vision", value: 78 },
      { metric: "Aggression", value: 75 },
      { metric: "Teamplay", value: 90 },
      { metric: "Consistency", value: 85 },
      { metric: "Versatility", value: 70 },
    ],
  },
  duoStats: {
    gamesPlayed: 156,
    winRate: 62,
    synergy: 94,
    bestCombo: "Yasuo Ult + Malphite Knockup",
  },
};

const Index = () => {
  const location = useLocation();
  const fetchedData = location.state?.fetchedData;

  // Merge the fetched data with the base template data
  const playerData = {
    ...basePlayerData,
    // Overwrite summoner data with fetched name/region
    summoner: {
      ...basePlayerData.summoner,
      ...fetchedData?.summoner,
    },
    // Overwrite insights with the AI summary
    insights: fetchedData?.insights || basePlayerData.insights,
    // Overwrite performance metrics with AI data
    performanceMetrics:
      fetchedData?.performanceMetrics || basePlayerData.performanceMetrics,

    // Keep the rest of the hardcoded data (BestDuo, topChampions, etc.)
    // Your agent can be expanded to provide this data in the future
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ScrollingBackground />
      <div className="relative z-10">
        <HeroSection player={playerData.summoner} />
        <Dashboard playerData={playerData} />
        <ClosingSection player={playerData.summoner} />
      </div>
    </div>
  );
};

export default Index;
