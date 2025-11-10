import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";

const ChampionShowcase = ({ champions }) => {

  return (
    <div className="space-y-4">
      {champions.map((champion, index) => (
        <motion.div
          key={champion.name}
          whileHover={{ scale: 1.02 }}
          className="champion-card"
        >
          <Card className="overflow-hidden p-0 bg-card/40 backdrop-blur-lg border-2 border-border/80 hover:border-secondary transition-all duration-300 shadow-glow-blue">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img
                  src={champion.image}
                  alt={champion.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/90" />
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-md">
                  #{index + 1}
                </div>
              </div>

              <div className="flex-1 px-12 py-6 flex flex-col justify-center gap-4">
                <div className="flex flex-wrap items-center gap-5">
                  <h3 className="text-2xl font-black text-foreground">
                    {champion.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xl leading-none">
                    {Array.from({ length: champion.mastery }).map((_, i) => (
                      <span key={i} className="text-primary">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left">
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                      Mastery Points
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {champion.points}
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                      Games Played
                    </div>
                    <div className="text-xl font-bold text-secondary">
                      {champion.games}
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                      Win Rate
                    </div>
                    <div className="text-xl font-bold text-accent">
                      {champion.winRate}%
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-start gap-6">
                    <div className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                      KDA
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {champion.kda}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ChampionShowcase;
