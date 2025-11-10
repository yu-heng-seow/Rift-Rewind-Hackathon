// useAPI.js
import { useState } from "react";

const SAW_FUNCTION_URL = import.meta.env.VITE_SAW_FUNCTION_URL;
const YES_FUNCTION_URL = import.meta.env.VITE_YES_FUNCTION_URL;
const COMP_FUNCTION_URL = import.meta.env.VITE_COMP_FUNCTION_URL;

/* -------------------- SAW -------------------- */
export function useSAW() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchSAW = async ({ gameName, tagLine, region }) => {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(SAW_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze strengths and weaknesses for player ${gameName}#${tagLine} in region ${region}`,
        }),
      });

      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

      const result = await resp.json();
      setData(result);
      return result;
    } catch (err) {
      console.error("SAW API Error:", err);
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchSAW, loading, error, data };
}

/* -------------------- YES -------------------- */
export function useYES() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchYES = async ({ gameName, tagLine, region }) => {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(YES_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName, tagLine, region }),
      });

      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

      const result = await resp.json();
      setData(result);
      return result;
    } catch (err) {
      console.error("YES API Error:", err);
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchYES, loading, error, data };
}

/* -------------------- COMP -------------------- */
export function useCOMP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchCOMP = async ({ player, bestDuo }) => {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(COMP_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Compare player ${bestDuo.gameName}#${bestDuo.tagLine} in region ${bestDuo.region} and player ${player.gameName}#${player.tagLine} in region ${player.region}`,
        }),
      });

      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

      const result = await resp.json();
      setData(result);
      return result;
    } catch (err) {
      console.error("COMP API Error:", err);
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCOMP, loading, error, data };
}
