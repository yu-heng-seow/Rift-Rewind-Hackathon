import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    title: 'Pentakill Master',
    description: 'Achieved 7 pentakills throughout the season',
    rarity: 'Legendary',
    date: 'Aug 15, 2024',
    icon: '🏆',
  },
  {
    title: 'Challenger Mindset',
    description: 'Reached Platinum I division',
    rarity: 'Epic',
    date: 'Oct 3, 2024',
    icon: '💎',
  },
  {
    title: 'Marathon Session',
    description: 'Played 18 games in a single day',
    rarity: 'Rare',
    date: 'Jul 22, 2024',
    icon: '⚡',
  },
  {
    title: 'Comeback Champion',
    description: 'Won 5 games in a row after being down 10k gold',
    rarity: 'Epic',
    date: 'Sep 8, 2024',
    icon: '🔥',
  },
  {
    title: 'Vision Legend',
    description: 'Placed over 500 wards in ranked games',
    rarity: 'Rare',
    date: 'Nov 12, 2024',
    icon: '👁️',
  },
  {
    title: 'One Trick Wonder',
    description: 'Achieved Mastery 7 on Yasuo',
    rarity: 'Epic',
    date: 'Jun 30, 2024',
    icon: '⭐',
  },
];

const rarityColors = {
  Legendary: 'border-primary text-primary shadow-glow-gold',
  Epic: 'border-accent text-accent shadow-glow-purple',
  Rare: 'border-secondary text-secondary shadow-glow-blue',
};

const AchievementsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const achievementCards = sectionRef.current.querySelectorAll('.achievement-card');
    
    achievementCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
        scale: 0.8,
        opacity: 0,
        rotation: Math.random() * 20 - 10,
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-primary">
            Achievements Unlocked
          </h2>
          <p className="text-xl text-muted-foreground">
            Your legendary moments this year
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="achievement-card"
            >
              <Card className={`p-6 bg-card/50 backdrop-blur-sm border-2 ${rarityColors[achievement.rarity as keyof typeof rarityColors]} transition-all duration-300 h-full relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl animate-pulse-glow">{achievement.icon}</div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.date}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
