const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";

interface GpiScore {
  metric: string;
  value: number;
  fullMark: number;
}

interface AgentResponse {
  scores: {
    farming: number;
    vision: number;
    aggression: number;
    teamplay: number;
    consistency: number;
    versatility: number;
  };
  insights: {
    farming: string;
    vision: string;
    aggression: string;
    teamplay: string;
    consistency: string;
    versatility: string;
  };
  summary: string;
}

const Saw = () => {
  const location = useLocation();
  const { gameName, tagLine, region } = location.state as {
    gameName: string;
    tagLine: string;
    region: string;
  };

  const [gpiData, setGpiData] = useState<GpiScore[]>([
    { metric: "Farming", value: 0, fullMark: 100 },
    { metric: "Vision", value: 0, fullMark: 100 },
    { metric: "Aggression", value: 0, fullMark: 100 },
    { metric: "Teamplay", value: 0, fullMark: 100 },
    { metric: "Consistency", value: 0, fullMark: 100 },
    { metric: "Versatility", value: 0, fullMark: 100 },
  ]);
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  useEffect(() => {
    const fetchGpi = async () => {
      try {
        const client = new BedrockAgentRuntimeClient({
          region: "us-east-1",
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });

        const input = {
          agentId: "UFSZYQKWFU",
          agentAliasId: "BIMY05KDZF",
          sessionId: `${Date.now()}`,
          inputText: `Analyze strengths and weaknesses for player ${gameName}#${tagLine} in region ${region}`,
        };

        const command = new InvokeAgentCommand(input);
        const response = await client.send(command);

        let fullResponse = "";

        if (response.completion) {
          for await (const chunk of response.completion) {
            if (chunk.chunk && chunk.chunk.bytes) {
              const decoder = new TextDecoder("utf-8");
              const text = decoder.decode(chunk.chunk.bytes);
              fullResponse += text;
            }
          }
        }

        console.log("Full Response:", fullResponse);

        // Try to extract JSON from the response
        // Sometimes the agent adds extra text, so we need to find the JSON part
        let jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }

        const parsed: AgentResponse = JSON.parse(jsonMatch[0]);

        if (!parsed.scores) {
          throw new Error("Invalid response format - missing scores");
        }

        const scores = parsed.scores;
        const insightsData = parsed.insights || {
          farming: "No insight available",
          vision: "No insight available",
          aggression: "No insight available",
          teamplay: "No insight available",
          consistency: "No insight available",
          versatility: "No insight available",
        };

        setGpiData([
          { metric: "Farming", value: scores.farming || 0, fullMark: 100 },
          { metric: "Vision", value: scores.vision || 0, fullMark: 100 },
          {
            metric: "Aggression",
            value: scores.aggression || 0,
            fullMark: 100,
          },
          { metric: "Teamplay", value: scores.teamplay || 0, fullMark: 100 },
          {
            metric: "Consistency",
            value: scores.consistency || 0,
            fullMark: 100,
          },
          {
            metric: "Versatility",
            value: scores.versatility || 0,
            fullMark: 100,
          },
        ]);

        // Normalize insight keys to match metric names
        setInsights({
          Farming: insightsData.farming,
          Vision: insightsData.vision,
          Aggression: insightsData.aggression,
          Teamplay: insightsData.teamplay,
          Consistency: insightsData.consistency,
          Versatility: insightsData.versatility,
        });

        setSummary(parsed.summary || "Analysis complete.");
      } catch (err) {
        console.error("Error details:", err);
        setError(
          `Failed to fetch data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGpi();
  }, [gameName, tagLine, region]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-2xl">Analyzing your performance...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-500 p-8 max-w-md">
          <div className="text-2xl text-red-400 mb-4">Error</div>
          <div className="text-gray-300">{error}</div>
        </Card>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const metric = payload[0].payload.metric;
      return (
        <Card className="bg-gray-900/95 border-primary p-4 max-w-xs">
          <div className="text-primary font-bold mb-2">{metric}</div>
          <div className="text-2xl font-bold mb-2">
            {payload[0].value.toFixed(1)}/100
          </div>
          <div className="text-sm text-gray-300">{insights[metric]}</div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GPI Analysis
          </h1>
          <p className="text-2xl text-gray-300">
            {gameName}
            <span className="text-primary">#{tagLine}</span>
          </p>
          <p className="text-lg text-gray-400 mt-2">
            Region: {region.toUpperCase()}
          </p>
        </div>

        {/* Summary Card */}
        <Card className="bg-gray-800/50 border-primary/30 p-6 mb-8">
          <h2 className="text-xl font-bold mb-3 text-primary">
            Overall Summary
          </h2>
          <p className="text-gray-300">{summary}</p>
        </Card>

        {/* Radar Chart */}
        <div className="bg-gray-800/30 rounded-lg p-8 mb-8">
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={gpiData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis
                dataKey="metric"
                stroke="#fff"
                tick={{ fill: "#fff", fontSize: 14 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#666"
                tick={{ fill: "#999" }}
              />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-400 mt-4">
            Hover over the chart to see detailed insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gpiData.map((item) => (
            <Card
              key={item.metric}
              className="bg-gray-800 p-6 hover:bg-gray-700 transition-all cursor-pointer border-2 border-transparent hover:border-primary"
              onMouseEnter={() => setHoveredMetric(item.metric)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="text-sm text-gray-400 mb-2">{item.metric}</div>
              <div className="text-3xl font-bold text-primary mb-2">
                {item.value.toFixed(1)}
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              {hoveredMetric === item.metric && (
                <div className="mt-3 text-sm text-gray-300 animate-in fade-in duration-200">
                  {insights[item.metric]}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Saw;
// ```

// ### 3. Key Changes Made:

// 1. **Agent prompt returns structured JSON** with separate `scores` and `insights` objects
// 2. **Frontend extracts JSON** from the response (handles cases where agent adds extra text)
// 3. **Hover functionality** on both the radar chart (via Recharts Tooltip) and stat cards
// 4. **Better error handling** with detailed error messages
// 5. **Improved UI** with gradients, animations, and better visual hierarchy

// ### 4. Test Your Agent

// Test with this prompt in AWS Console:
// ```
// Analyze strengths and weaknesses for player Tyler1#15422 in region americas
