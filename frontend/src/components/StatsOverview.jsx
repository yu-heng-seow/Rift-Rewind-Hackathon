import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import ChampionShowcase from "@/components/ChampionShowcase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// --- Constants & Tooltip ---
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const CustomRadarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded-md text-sm">
        <p>{`${payload[0].payload.metric}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// --- Component ---
const StatsOverview = ({ playerData }) => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    gsap.from(".stat-card", { opacity: 0, y: 30, duration: 0.6, stagger: 0.1 });
  }, []);

  if (!playerData) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Loading player statistics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Tabs Header */}
        <TabsList className="grid w-full grid-cols-3 lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="champions">Champions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* ---------------- Overview Tab ---------------- */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance Radar Chart */}
            <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your strengths and areas for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={playerData.performanceMetrics}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip content={<CustomRadarTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Role Distribution */}
            <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>Games played by role</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={playerData.roleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, value }) => `${role} ${value.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {playerData.roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Progress */}
          <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Win/Loss and KDA trends throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={playerData.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="wins" stroke="#10b981" strokeWidth={2} name="Wins" />
                  <Line yAxisId="left" type="monotone" dataKey="losses" stroke="#ef4444" strokeWidth={2} name="Losses" />
                  <Line yAxisId="right" type="monotone" dataKey="kda" stroke="#f59e0b" strokeWidth={2} name="KDA" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Champions Tab ---------------- */}
        <TabsContent value="champions" className="space-y-4">
          <ChampionShowcase champions={playerData.topChampions} />

          {/* Champion Performance Chart */}
          <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
            <CardHeader>
              <CardTitle>Champion Performance</CardTitle>
              <CardDescription>Win rate comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={playerData.topChampions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  <Bar dataKey="winRate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Performance Tab ---------------- */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
              <CardHeader>
                <CardTitle className="text-sm">Avg Kills</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-500">
                  {(playerData.yearStats.totalKills / playerData.yearStats.gamesPlayed).toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
              <CardHeader>
                <CardTitle className="text-sm">Avg Deaths</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-500">
                  {(playerData.yearStats.totalDeaths / playerData.yearStats.gamesPlayed).toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
              <CardHeader>
                <CardTitle className="text-sm">Avg Assists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-500">
                  {(playerData.yearStats.totalAssists / playerData.yearStats.gamesPlayed).toFixed(1)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Breakdown */}
          <Card className="stat-card border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>Detailed analysis of your playstyle metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playerData.performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <span className="text-sm font-bold text-primary">{metric.value}/100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsOverview;
