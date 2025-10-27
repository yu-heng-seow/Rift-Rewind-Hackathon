import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

const specialChampions = [
  {
    id: 1,
    name: "Yasuo",
    title: "The Unforgiven",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
    cardImage:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yasuo_0.jpg",
    rarity: "Legendary",
    stats: {
      mastery: 7,
      points: "487,392",
      games: 124,
      winRate: 54,
      kda: "3.2",
      pentakills: 3,
      quadrakills: 12,
      triplekills: 45
    }
  },
  {
    id: 2,
    name: "Zed",
    title: "The Master of Shadows",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg",
    cardImage:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Zed_0.jpg",
    rarity: "Legendary",
    stats: {
      mastery: 7,
      points: "412,847",
      games: 98,
      winRate: 51,
      kda: "3.8",
      pentakills: 2,
      quadrakills: 15,
      triplekills: 38
    }
  },
  {
    id: 3,
    name: "Akali",
    title: "The Rogue Assassin",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_0.jpg",
    cardImage:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Akali_0.jpg",
    rarity: "Epic",
    stats: {
      mastery: 6,
      points: "298,156",
      games: 76,
      winRate: 58,
      kda: "4.1",
      pentakills: 1,
      quadrakills: 8,
      triplekills: 32
    }
  },
  {
    id: 4,
    name: "Katarina",
    title: "The Sinister Blade",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Katarina_0.jpg",
    cardImage:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Katarina_0.jpg",
    rarity: "Epic",
    stats: {
      mastery: 6,
      points: "267,943",
      games: 69,
      winRate: 52,
      kda: "3.5",
      pentakills: 4,
      quadrakills: 11,
      triplekills: 29
    }
  }
]

const CardRevealSection = () => {
  const [selectedChampion, setSelectedChampion] = useState(null)

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-purple bg-clip-text text-transparent">
            Special Champion Cards
          </h2>
          <p className="text-xl text-muted-foreground">
            Click to reveal your legendary champions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialChampions.map((champion, index) => (
            <motion.div
              key={champion.id}
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => setSelectedChampion(champion)}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md border-2 border-accent/30 hover:border-accent transition-all duration-300 shadow-glow-purple h-full">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={champion.image}
                    alt={champion.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-xs font-bold text-accent mb-1">
                      {champion.rarity}
                    </div>
                    <h3 className="text-2xl font-black text-foreground">
                      {champion.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {champion.title}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedChampion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChampion(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 90 }}
              transition={{ type: "spring", duration: 0.7 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <Card className="overflow-hidden bg-gradient-to-br from-card via-card/90 to-accent/20 border-4 border-accent shadow-glow-purple">
                <button
                  onClick={() => setSelectedChampion(null)}
                  className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background text-foreground rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/2">
                    <img
                      src={selectedChampion.cardImage}
                      alt={selectedChampion.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
                  </div>

                  <div className="flex-1 p-8">
                    <div className="mb-6">
                      <div className="inline-block px-4 py-1 bg-accent/20 border border-accent rounded-full mb-4">
                        <span className="text-accent font-bold text-sm">
                          {selectedChampion.rarity}
                        </span>
                      </div>
                      <h2 className="text-5xl font-black text-foreground mb-2">
                        {selectedChampion.name}
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        {selectedChampion.title}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        {Array.from({
                          length: selectedChampion.stats.mastery
                        }).map((_, i) => (
                          <span key={i} className="text-primary text-2xl">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-background/50 rounded-lg p-4 border border-border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Mastery Points
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {selectedChampion.stats.points}
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-4 border border-border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Games Played
                        </div>
                        <div className="text-2xl font-bold text-secondary">
                          {selectedChampion.stats.games}
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-4 border border-border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Win Rate
                        </div>
                        <div className="text-2xl font-bold text-accent">
                          {selectedChampion.stats.winRate}%
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-4 border border-border">
                        <div className="text-sm text-muted-foreground mb-1">
                          KDA
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {selectedChampion.stats.kda}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-accent/20 to-transparent rounded-lg p-4 border-l-4 border-accent">
                      <div className="text-sm font-bold text-accent mb-2">
                        Multikills
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Pentakills:
                          </span>
                          <span className="ml-2 font-bold text-primary">
                            {selectedChampion.stats.pentakills}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Quadrakills:
                          </span>
                          <span className="ml-2 font-bold text-secondary">
                            {selectedChampion.stats.quadrakills}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Triplekills:
                          </span>
                          <span className="ml-2 font-bold text-accent">
                            {selectedChampion.stats.triplekills}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CardRevealSection
