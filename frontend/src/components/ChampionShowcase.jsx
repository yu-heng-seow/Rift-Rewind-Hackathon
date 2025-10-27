import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card } from "@/components/ui/card"

gsap.registerPlugin(ScrollTrigger)

const champions = [
  {
    name: "Yasuo",
    mastery: 7,
    points: "487,392",
    games: 124,
    winRate: 54,
    kda: "3.2",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg"
  },
  {
    name: "Zed",
    mastery: 7,
    points: "412,847",
    games: 98,
    winRate: 51,
    kda: "3.8",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg"
  },
  {
    name: "Lee Sin",
    mastery: 6,
    points: "324,156",
    games: 87,
    winRate: 49,
    kda: "2.9",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/LeeSin_0.jpg"
  }
]

const ChampionShowcase = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const championCards = sectionRef.current.querySelectorAll(".champion-card")

    championCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 40%",
          scrub: 1
        },
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        rotation: index % 2 === 0 ? -5 : 5
      })
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 bg-gradient-to-b from-background to-background/50"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-blue bg-clip-text text-transparent">
            Champion Mastery
          </h2>
          <p className="text-xl text-muted-foreground">
            Your most played legends
          </p>
        </motion.div>

        <div className="space-y-8">
          {champions.map((champion, index) => (
            <motion.div
              key={champion.name}
              whileHover={{ scale: 1.02 }}
              className="champion-card"
            >
              <Card className="overflow-hidden bg-card/30 backdrop-blur-md border-2 border-border hover:border-secondary transition-all duration-300 shadow-glow-blue">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                    <img
                      src={champion.image}
                      alt={champion.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/90" />
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="flex-1 p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-4xl font-black text-foreground">
                        {champion.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: champion.mastery }).map(
                          (_, i) => (
                            <span key={i} className="text-primary text-2xl">
                              ★
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Mastery Points
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {champion.points}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Games Played
                        </div>
                        <div className="text-2xl font-bold text-secondary">
                          {champion.games}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Win Rate
                        </div>
                        <div className="text-2xl font-bold text-accent">
                          {champion.winRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          KDA
                        </div>
                        <div className="text-2xl font-bold text-foreground">
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
      </div>
    </section>
  )
}

export default ChampionShowcase
