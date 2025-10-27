import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card } from "@/components/ui/card"

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { label: "Games Played", value: "487", icon: "🎮" },
  { label: "Hours in Game", value: "324", icon: "⏱️" },
  { label: "Total Kills", value: "3,892", icon: "⚔️" },
  { label: "Pentakills", value: "7", icon: "🔥" }
]

const StatsOverview = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll(".stat-card")

    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "top 50%",
          scrub: 1
        },
        y: 100,
        opacity: 0,
        delay: index * 0.1
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-primary">
            By The Numbers
          </h2>
          <p className="text-xl text-muted-foreground">
            Your battlefield statistics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="stat-card bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary transition-all duration-300 p-8 text-center relative overflow-hidden group shadow-glow-gold">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4 animate-pulse-glow">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsOverview
