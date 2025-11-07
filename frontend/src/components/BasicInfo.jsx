import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Clock, Award, TrendingUp } from "lucide-react";

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <Card className="w-full py-4 border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      {trend && (
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend}
        </div>
      )}
    </CardContent>
  </Card>
);

export default function BasicInfo({ playerData }) {
  const kda = (
    (playerData.yearStats.totalKills + playerData.yearStats.totalAssists) /
    playerData.yearStats.totalDeaths
  ).toFixed(2);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Player Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-primary mb-2">
            {playerData.summoner.name}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Level {playerData.summoner.level}</Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
              {playerData.summoner.rank}
            </Badge>
            <Badge variant="secondary">{playerData.summoner.lp} LP</Badge>
            <Badge variant="outline">{playerData.summoner.region}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-xl font-bold text-primary">
            {playerData.summoner.winRate}%
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-col-2 lg:grid-cols-1 gap-4">
        <StatCard
          title="Games Played"
          value={playerData.yearStats.gamesPlayed}
          subtitle={`${playerData.yearStats.wins}W ${playerData.yearStats.losses}L`}
          icon={Trophy}
        />
        <StatCard
          title="KDA Ratio"
          value={kda}
          subtitle={`${playerData.yearStats.totalKills} / ${playerData.yearStats.totalDeaths} / ${playerData.yearStats.totalAssists}`}
          icon={Target}
        />
        <StatCard
          title="Hours Played"
          value={playerData.yearStats.hoursPlayed}
          icon={Clock}
          trend="+8% from last month"
        />
        <StatCard
          title="Pentakills"
          value={playerData.yearStats.pentakills}
          subtitle={`${playerData.yearStats.quadrakills} Quadrakills`}
          icon={Award}
        />
      </div>
    </div>
  );
}
