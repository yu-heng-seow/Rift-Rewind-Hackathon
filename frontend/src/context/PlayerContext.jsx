import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  // User Input
  const [playerInput, setPlayerInput] = useState({
    gameName: "",
    tagLine: "",
    region: "",
  });

  // Raw API responses
  const [sawResponse, setSawResponse] = useState(null);
  const [yesResponse, setYesResponse] = useState(null);
  const [compResponse, setCompResponse] = useState(null);

  // formatted player data
  const [playerData, setPlayerData] = useState(null);

  const formatPlayerData = (yes, saw, comp) => {
    if (!yes) return;

    // --- Extract basic player info ---
    const summoner = yes.summoner || {};
    const stats = yes.yearStats || {};
    const topChamps = yes.topChampions || [];
    const roles = yes.roleDistribution || [];
    const achievements = yes.recentAchievements || [];
    const duo = yes.bestDuo || {};

    // --- Parse SAW metrics (strengths/weaknesses) ---
    let parsedSAW = null;
    try {
      parsedSAW = saw?.response ? JSON.parse(saw.response) : null;
    } catch {
      parsedSAW = null;
    }

    const insights = parsedSAW
      ? Object.entries(parsedSAW.insights).map(([key, desc]) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          description: desc,
          icon: "⭐",
        }))
      : [];

    const performanceMetrics = parsedSAW
      ? Object.entries(parsedSAW.scores).map(([metric, value]) => ({
          metric: metric.charAt(0).toUpperCase() + metric.slice(1),
          value: value, 
          description: parsedSAW.insights?.[metric] || "",
        }))
      : [];

    // --- Calculate KDA ---
    const calculateKDA = (kills, deaths, assists) => {
      const totalDeaths = Math.max(deaths, 1); // Avoid division by zero
      return ((kills + assists) / totalDeaths).toFixed(2);
    };

    const playerKDA = calculateKDA(
      stats.totalKills || 0,
      stats.totalDeaths || 1,
      stats.totalAssists || 0
    );

    // --- Map top champions ---
    const topChampions = topChamps.map((champ) => ({
      name: champ.name,
      games: champ.games,
      wins: champ.wins,
      losses: champ.losses,
      winRate: champ.winRate,
      kda: champ.kda,
      mastery: champ.masteryLevel ?? 6,
      points: champ.masteryPoints ?? "Unknown",
      role: champ.role ?? "Unknown",
      image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.name}_0.jpg`,
    }));

    // --- Role Distribution ---
    const roleDistribution = roles.map((r) => ({
      role: r.role,
      value: r.value,
    }));

    // --- Achievements ---
    const recentAchievements = achievements.map((a) => ({
      title: a.name,
      description: a.description,
      level: a.level,
      icon: "🏆",
    }));

    // --- Best Duo Info ---
    // Get duo's top champion if available, otherwise use placeholder
    const duoTopChamp = duo.topChampion || "Malphite";
    
    const bestDuo = {
      name: duo.name || "Unknown Player",
      tagLine: duo.tagline || "NA1",
      avatar: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${duoTopChamp}_0.jpg`,
      mainChampion: duoTopChamp,
      championIcon: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${duoTopChamp}.png`,
      rank: duo.rank || "Unknown",
      winRate: duo.winRate || 0,
      kda: duo.kda || "0.00:1",
      gamesPlayed: duo.gamesTogether || 0,
      // Placeholder performance metrics - will be populated when duo details are fetched
      performanceMetrics: [],
    };

    // --- Duo synergy from COMP ---
    let parsedCOMP = null;
    try {
      parsedCOMP = comp?.response ? JSON.parse(comp.response) : null;
    } catch {
      parsedCOMP = null;
    }

    const duoStats = parsedCOMP
      ? {
          gamesPlayed: bestDuo.gamesPlayed,
          winRate: parsedCOMP.duo_winrate || 0,
          synergy: parsedCOMP.playstyle_synergy?.is_complementary ? 95 : 70,
          bestCombo: parsedCOMP.playstyle_synergy?.synergy_insight || "Strong synergy detected!",
        }
      : {
          gamesPlayed: bestDuo.gamesPlayed,
          winRate: 56,
          synergy: 70,
          bestCombo: "Loading synergy data...",
        };

    // --- Final Combined Object ---
    const formatted = {
      summoner: {
        name: summoner.name,
        avatar: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampions[0]?.name || "Yasuo"}_0.jpg`,
        mainChampion: topChampions[0]?.name || "Unknown",
        championIcon: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${topChampions[0]?.name || "Yasuo"}.png`,
        level: summoner.level,
        rank: summoner.rank,
        lp: summoner.lp || 0,
        kda: playerKDA,
        winRate: summoner.winRate,
        region: summoner.region,
      },
      yearStats: {
        gamesPlayed: stats.gamesPlayed,
        wins: stats.wins,
        losses: stats.losses,
        hoursPlayed: stats.hoursPlayed,
        totalKills: stats.totalKills,
        totalDeaths: stats.totalDeaths,
        totalAssists: stats.totalAssists,
        pentakills: stats.pentakills,
        quadrakills: stats.quadrakills,
        triplekills: stats.triplekills,
      },
      insights,
      performanceMetrics,
      monthlyProgress: yes.monthlyProgress || [],
      topChampions,
      roleDistribution,
      recentAchievements,
      bestDuo,
      duoStats,
    };

    setPlayerData(formatted);
    console.log(playerData);
  };

  return (
    <PlayerContext.Provider
      value={{
        playerInput,
        setPlayerInput,
        sawResponse,
        setSawResponse,
        yesResponse,
        setYesResponse,
        compResponse,
        setCompResponse,
        playerData,
        setPlayerData,
        formatPlayerData,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);