import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoadingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const playerId = location.state?.playerId;

  useEffect(() => {
    if (!playerId) {
      navigate("/");
      return;
    }

    // Simulate loading 
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); 
      navigate("/statistics", { state: { playerId } });
    };

    fetchData();
  }, [playerId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="border-4 border-t-transparent border-white rounded-full w-16 h-16 mb-6"
      />
      <h2 className="text-2xl font-semibold">Fetching your data...</h2>
    </div>
  );
}
