import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

// A helper function to parse the agent's streaming response
async function getAgentResponse(response) {
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
  return fullResponse;
}

// A helper to safely extract JSON from the agent's text response
function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in the agent's response.");
  }
  return JSON.parse(match[0]);
}

export default function LoadingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameName, tagLine, region } = location.state || {};
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we don't have the user info, go back to the landing page
    if (!gameName || !tagLine || !region) {
      navigate("/landing");
      return;
    }

    const fetchData = async () => {
      try {
        // ------------------------------------------------------------------
        // ⚠️ WARNING: DO NOT USE HARDCODED KEYS IN PRODUCTION.
        // Replace these placeholders with a secure authentication method
        // (e.g., Amazon Cognito or your own backend proxy).
        // ------------------------------------------------------------------
        const client = new BedrockAgentRuntimeClient({
          region: "us-east-1", // Use the region your agent is in
          credentials: {
            accessKeyId: "YOUR_ACCESS_KEY_ID", // <-- REPLACE THIS
            secretAccessKey: "YOUR_SECRET_ACCESS_KEY", // <-- REPLACE THIS
          },
        });

        const input = {
          agentId: "UFSZYQKWFU", // Your Agent ID
          agentAliasId: "BIMY05KDZF", // Your Agent Alias ID
          sessionId: `${Date.now()}`, // A unique session ID
          inputText: `Analyze strengths and weaknesses for player ${gameName}#${tagLine} in region ${region}`,
        };

        const command = new InvokeAgentCommand(input);
        const response = await client.send(command);
        const fullResponse = await getAgentResponse(response);
        const agentData = extractJson(fullResponse);

        if (!agentData.scores || !agentData.insights) {
          throw new Error("Invalid data format from agent.");
        }

        // 1. Format Performance Metrics for the Radar Chart
        const metrics = [
          "farming",
          "vision",
          "aggression",
          "teamplay",
          "consistency",
          "versatility",
        ];

        const newPerformanceMetrics = metrics.map((metric) => ({
          metric: metric.charAt(0).toUpperCase() + metric.slice(1),
          value: agentData.scores[metric] || 0,
          description: agentData.insights[metric] || "No insight available.",
        }));

        // 2. Format Insights for the PlaystyleAnalysis component
        // We use the agent's main summary here.
        const newInsights = [
          {
            title: "AI-Generated Summary",
            description: agentData.summary || "Your analysis is complete.",
            icon: "🤖",
          },
        ];

        // 3. Pass all fetched data to the main dashboard page
        navigate("/", {
          state: {
            fetchedData: {
              performanceMetrics: newPerformanceMetrics,
              insights: newInsights,
              summoner: {
                name: gameName,
                region: region.toUpperCase(),
              },
            },
          },
        });
      } catch (err) {
        console.error("Error fetching agent data:", err);
        setError(err.message);
        // Optional: Navigate to an error page or back to landing
        // navigate("/landing", { state: { error: err.message } });
      }
    };

    fetchData();
  }, [gameName, tagLine, region, navigate]);

  // Display a loading spinner or error message
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white">
      {error ? (
        <div className="text-center max-w-md p-4">
          <h2 className="text-2xl font-semibold text-destructive mb-4">
            Analysis Failed
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate("/landing")}>Try Again</Button>
        </div>
      ) : (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="border-4 border-t-transparent border-primary rounded-full w-16 h-16 mb-6"
          />
          <h2 className="text-2xl font-semibold animate-pulse">
            Analyzing your legend...
          </h2>
          <p className="text-muted-foreground mt-2">
            Fetching data for {gameName}#{tagLine}
          </p>
        </>
      )}
    </div>
  );
}
