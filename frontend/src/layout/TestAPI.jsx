// TestAPI.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useSAW, useYES, useCOMP } from "@/hooks/useAPI";

const TestAPI = () => {
  const { fetchSAW, loading: sawLoading, error: sawError, data: sawData } = useSAW();
  const { fetchYES, loading: yesLoading, error: yesError, data: yesData } = useYES();
  const { fetchCOMP, loading: compLoading, error: compError, data: compData } = useCOMP();

  // Example input data
  const INPUT_DUO = { gameName: "Watermelon", tagLine: "x1gua", region: "sea" };
  const INPUT_PLAYER = { gameName: "D4C", tagLine: "2009", region: "sea" };

  /* -------------------- Handlers -------------------- */
  const testSAW = async () => {
    try {
      const resp = await fetchSAW(INPUT_PLAYER);
      console.log("SAW Parsed Response:", resp);
    } catch (err) {
      console.error("SAW Test failed:", err);
    }
  };

  const testYES = async () => {
    try {
      const resp = await fetchYES(INPUT_PLAYER);
      console.log("YES Lambda Response:", resp);
    } catch (err) {
      console.error("YES Test failed:", err);
    }
  };

  const testCOMP = async () => {
    try {
      const resp = await fetchCOMP({ player: INPUT_PLAYER, bestDuo: INPUT_DUO });
      console.log("COMP Comparison Response:", resp);
    } catch (err) {
      console.error("COMP Test failed:", err);
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Test API</h1>

      {/* ---- SAW ---- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test SAW (Bedrock Agent)</h2>
        {sawLoading && <p>Loading...</p>}
        {sawError && <p className="text-red-500">Error: {sawError}</p>}
        <Button onClick={testSAW} disabled={sawLoading}>
          {sawLoading ? "Loading..." : "Test SAW"}
        </Button>
        {sawData && (
          <pre className="p-3 mt-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(sawData, null, 2)}
          </pre>
        )}
      </div>

      {/* ---- YES ---- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test YES (Lambda Function)</h2>
        {yesLoading && <p>Loading...</p>}
        {yesError && <p className="text-red-500">Error: {yesError}</p>}
        <Button onClick={testYES} disabled={yesLoading}>
          {yesLoading ? "Loading..." : "Test YES"}
        </Button>
        {yesData && (
          <pre className="p-3 mt-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(yesData, null, 2)}
          </pre>
        )}
      </div>

      {/* ---- COMP ---- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test COMP (Comparison Agent)</h2>
        {compLoading && <p>Loading...</p>}
        {compError && <p className="text-red-500">Error: {compError}</p>}
        <Button onClick={testCOMP} disabled={compLoading}>
          {compLoading ? "Loading..." : "Test COMP"}
        </Button>
        {compData && (
          <pre className="p-3 mt-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(compData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default TestAPI;
