import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const rarityColors = {
  Legendary: "bg-yellow-500/10 border-yellow-500/50 text-yellow-400",
  Epic: "bg-purple-500/10 border-purple-500/50 text-purple-400",
  Rare: "bg-blue-500/10 border-blue-500/50 text-blue-400",
};

export default function Achievements({ playerData }) {
  const achievements = playerData.recentAchievements;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-primary mb-1">Recent Achievements</h3>
      {achievements.map((a, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card
            className={`flex items-center justify-between p-4 rounded-xl 
              border-2 border-border/80 hover:border-secondary transition-all 
              duration-300 shadow-glow-blue ${rarityColors[a.rarity]}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full border">
              {a.level}
            </span>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
