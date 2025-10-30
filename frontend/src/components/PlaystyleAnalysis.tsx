import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const roles = [
  { name: 'Mid Lane', percentage: 42, color: 'bg-primary' },
  { name: 'Jungle', percentage: 28, color: 'bg-secondary' },
  { name: 'Top Lane', percentage: 18, color: 'bg-accent' },
  { name: 'ADC', percentage: 8, color: 'bg-destructive' },
  { name: 'Support', percentage: 4, color: 'bg-muted' },
];

const insights = [
  {
    title: 'Aggressive Playstyle',
    description: 'You averaged 8.2 kills per game, showing a proactive approach to teamfights',
    icon: '⚔️',
  },
  {
    title: 'Vision Master',
    description: '487 wards placed - keeping your team informed and safe',
    icon: '👁️',
  },
  {
    title: 'Objective Focused',
    description: '73% dragon participation rate, you know what wins games',
    icon: '🐉',
  },
  {
    title: 'Comeback King',
    description: '12 victories from behind - never surrender mentality',
    icon: '👑',
  },
];

const PlaystyleAnalysis = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barsRef.current) return;

    const bars = barsRef.current.querySelectorAll('.role-bar');
    
    bars.forEach((bar) => {
      gsap.from(bar, {
        scrollTrigger: {
          trigger: bar,
          start: 'top 80%',
        },
        width: 0,
        duration: 1.5,
        ease: 'power3.out',
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-purple opacity-5" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-purple bg-clip-text text-transparent">
            Your Playstyle
          </h2>
          <p className="text-xl text-muted-foreground">
            Understanding your approach to the game
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-2 border-border">
            <h3 className="text-3xl font-bold mb-8 text-accent">Role Distribution</h3>
            <div ref={barsRef} className="space-y-6">
              {roles.map((role) => (
                <div key={role.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-foreground">{role.name}</span>
                    <span className="text-muted-foreground">{role.percentage}%</span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`role-bar h-full ${role.color}`}
                      style={{ width: `${role.percentage}%` }}
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-2 border-border">
            <h3 className="text-3xl font-bold mb-8 text-accent">Performance Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Average KDA</span>
                <span className="text-2xl font-bold text-primary">3.4</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="text-2xl font-bold text-secondary">52.7%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">CS/Min</span>
                <span className="text-2xl font-bold text-accent">7.2</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">Avg Game Length</span>
                <span className="text-2xl font-bold text-foreground">31m</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="p-6 bg-card/30 backdrop-blur-md border-2 border-border hover:border-accent transition-all duration-300 h-full shadow-glow-purple">
                <div className="text-4xl mb-4">{insight.icon}</div>
                <h4 className="text-xl font-bold mb-2 text-foreground">{insight.title}</h4>
                <p className="text-muted-foreground">{insight.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlaystyleAnalysis;
