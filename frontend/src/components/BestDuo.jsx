import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Users, Trophy, Target, Zap } from "lucide-react"

const bestDuo = {
  id: 1,
  player: {
    name: "ShadowAssassin",
    avatar: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
    mainChampion: "Yasuo",
    championIcon: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Yasuo.png",
    rank: "Diamond II",
    winRate: 54,
    kda: "3.2:1",
    gamesPlayed: 487,
    performance: {
      farming: 85,
      vision: 65,
      aggression: 92,
      teamplay: 78,
      consistency: 70,
      versatility: 88
    }
  },
  topPartner: {
    name: "StormBringer",
    avatar: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malphite_0.jpg",
    mainChampion: "Malphite",
    championIcon: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Malphite.png",
    rank: "Diamond III",
    winRate: 58,
    kda: "2.8:1",
    gamesPlayed: 412,
    performance: {
      farming: 72,
      vision: 78,
      aggression: 75,
      teamplay: 90,
      consistency: 85,
      versatility: 70
    }
  },
  duoStats: {
    gamesPlayed: 156,
    winRate: 62,
    synergy: 94,
    bestCombo: "Yasuo Ult + Malphite Knockup"
  }
}

const RadarChart = ({ player1Data, player2Data }) => {
  const metrics = ['Farming', 'Vision', 'Aggression', 'Teamfight', 'Objective', 'Mechanics']
  const center = 150
  const radius = 100
  const points = 6

  const getPoint = (value, index) => {
    const angle = (Math.PI * 2 * index) / points - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  }

  const createPath = (data) => {
    const values = [
      data.farming,
      data.vision,
      data.aggression,
      data.teamplay,
      data.consistency,
      data.versatility
    ]
    return values.map((value, i) => {
      const point = getPoint(value, i)
      return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    }).join(' ') + ' Z'
  }

  const getLabelPosition = (index) => {
    const angle = (Math.PI * 2 * index) / points - Math.PI / 2
    const r = radius + 35
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  }

  return (
    <svg width="300" height="300" className="mx-auto">
      {/* Grid circles */}
      {[20, 40, 60, 80, 100].map((percent) => (
        <circle
          key={percent}
          cx={center}
          cy={center}
          r={(percent / 100) * radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Grid lines */}
      {metrics.map((_, i) => {
        const point = getPoint(100, i)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        )
      })}

      {/* Player 2 data (background) */}
      <path
        d={createPath(player2Data)}
        fill="rgba(236, 72, 153, 0.25)"
        stroke="rgb(236, 72, 153)"
        strokeWidth="2"
      />

      {/* Player 1 data (foreground) */}
      <path
        d={createPath(player1Data)}
        fill="rgba(139, 92, 246, 0.25)"
        stroke="rgb(139, 92, 246)"
        strokeWidth="2"
      />

      {/* Labels */}
      {metrics.map((label, i) => {
        const pos = getLabelPosition(i)
        return (
          <text
            key={label}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-white"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

const BestDuo = () => {
  const [showDetails, setShowDetails] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <section className="py-4 relative z-10">
      <div className="container">
        <div className="mb-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Best Duo Partnership
          </h3>
          <p className="text-sm text-gray-400">
            Click card to reveal the ultimate duo
          </p>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={handleCardClick}
          className="cursor-pointer perspective-1000 max-w-md mx-auto"
        >
          <div className={`relative w-full h-[400px] transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Card Back */}
            <div className="absolute inset-0 backface-hidden">
              <Card className="py-0 h-full overflow-hidden border-2 border-border/80 transition-all duration-300 shadow-glow-blue">
                <div className="relative h-full">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
                    alt="Game Card"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  
                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                    <div className="text-center mb-6">
                      <Badge className="mb-4 bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30">
                        ★ BEST DUO ★
                      </Badge>
                      <h2 className="text-2xl xl:text-4xl font-black text-white mb-2 drop-shadow-lg">
                        Best Partnership
                      </h2>
                      <p className="text-gray-300 text-sm">Click to reveal duo stats</p>
                    </div>
                  </div>

                  {/* Decorative corners */}
                  <div className="absolute top-4 left-2 w-12 h-12 border-t-3 border-l-3 rounded-xl border-white/70" />
                  <div className="absolute top-4 right-2 w-12 h-12 border-t-3 border-r-3 rounded-xl border-white/70" />
                  <div className="absolute bottom-4 left-2 w-12 h-12 border-b-3 border-l-3 rounded-xl border-white/70" />
                  <div className="absolute bottom-4 right-2 w-12 h-12 border-b-3 border-r-3 rounded-xl border-white/70" />
                </div>
              </Card>
            </div>

            {/* Card Front - Duo Profiles */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <Card className="h-full overflow-hidden border-2 border-border/80 transition-all duration-300 shadow-glow-blue">
                <div className="h-full flex flex-col px-2">
                  <div className="flex-1 overflow-y-auto">
                    {/* Player 1 Profile */}
                    <div className="mb-4">
                      <div className="bg-black/40 backdrop-blur">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={bestDuo.player.championIcon}
                            alt={bestDuo.player.mainChampion}
                            className="w-12 h-12 rounded-full border-2 border-purple-400 shadow-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-md font-semibold text-white overflow-x-hidden">{bestDuo.player.name}</h4>
                            <Badge variant="outline" className="mt-1 text-xs border-purple-400 text-purple-300">
                              {bestDuo.player.rank}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-purple-950/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">Games</div>
                            <div className="text-sm font-bold text-white">{bestDuo.player.gamesPlayed}</div>
                          </div>
                          <div className="bg-purple-950/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">Win Rate</div>
                            <div className="text-sm font-bold text-green-400">{bestDuo.player.winRate}%</div>
                          </div>
                          <div className="bg-purple-950/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">KDA</div>
                            <div className="text-sm font-bold text-yellow-400">{bestDuo.player.kda}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Duo Connection */}
                    <div className="flex items-center justify-center my-3">
                      <div className="flex-1 border-t-2 border-dashed border-gray-600" />
                      <div className="px-4">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-gray-600" />
                    </div>

                    {/* Player 2 Profile */}
                    <div className="mb-4">
                      <div className="bg-black/40 backdrop-blur">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={bestDuo.topPartner.championIcon}
                            alt={bestDuo.topPartner.mainChampion}
                            className="w-12 h-12 rounded-full border-2 border-pink-400 shadow-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-md font-semibold text-white overflow-x-hidden">{bestDuo.topPartner.name}</h4>
                            <Badge variant="outline" className="mt-1 text-xs border-pink-400 text-pink-300">
                              {bestDuo.topPartner.rank}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-pink-950/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">Games</div>
                            <div className="text-sm font-bold text-white">{bestDuo.topPartner.gamesPlayed}</div>
                          </div>
                          <div className="bg-pink-950/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">Win Rate</div>
                            <div className="text-sm font-bold text-green-400">{bestDuo.topPartner.winRate}%</div>
                          </div>
                          <div className="bg-pink-950/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">KDA</div>
                            <div className="text-sm font-bold text-yellow-400">{bestDuo.topPartner.kda}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Synergy Score */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border-2 border-yellow-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-yellow-400">Synergy Score</span>
                        <span className="text-xl font-black text-yellow-400">{bestDuo.duoStats.synergy}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-1000"
                          style={{ width: `${bestDuo.duoStats.synergy}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDetails(true)
                    }}
                    className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Comparison Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative overflow-hidden rounded-2xl bg-card shadow-2xl">
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-20 bg-black/80 hover:bg-black text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>

                <div className="relative z-10 p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <Badge className="mb-4 bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30">
                      ★ LEGENDARY DUO ANALYSIS ★
                    </Badge>
                    <h2 className="text-4xl font-black text-white mb-2">
                      {bestDuo.player.name} & {bestDuo.topPartner.name}
                    </h2>
                    <p className="text-gray-400">{bestDuo.duoStats.bestCombo}</p>
                  </div>

                  <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
                    {/* Player 1 */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur-2xl" />
                        <img
                          src={bestDuo.player.avatar}
                          alt={bestDuo.player.mainChampion}
                          className="relative w-48 h-48 object-cover object-top rounded-lg border-2 border-purple-500 shadow-2xl"
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                          <img
                            src={bestDuo.player.championIcon}
                            alt={bestDuo.player.mainChampion}
                            className="w-16 h-16 rounded-full border-2 border-purple-400 bg-gray-900 shadow-lg"
                          />
                        </div>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 text-center mt-4">
                        {bestDuo.player.name}
                      </h3>
                      <div className="text-purple-300 font-bold text-lg mb-1">
                        {bestDuo.player.mainChampion}
                      </div>
                      <Badge variant="outline" className="mb-4 border-purple-400 text-purple-300">
                        {bestDuo.player.rank}
                      </Badge>

                      <div className="w-full space-y-2">
                        <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-purple-500/30">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Total Games</span>
                            <span className="text-white font-bold">{bestDuo.player.gamesPlayed}</span>
                          </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-purple-500/30">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Win Rate</span>
                            <span className="text-green-400 font-bold">{bestDuo.player.winRate}%</span>
                          </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-purple-500/30">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">KDA Ratio</span>
                            <span className="text-yellow-400 font-bold">{bestDuo.player.kda}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center - Radar Chart */}
                    <div className="flex flex-col items-center justify-center">

                      <div className="bg-black/40 backdrop-blur rounded-2xl px-6 py-2 border border-purple-500/30">
                        <RadarChart 
                          player1Data={bestDuo.player.performance}
                          player2Data={bestDuo.topPartner.performance}
                        />
                      </div>

                      <div className="mt-6 flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-500 rounded-full" />
                          <span className="text-gray-300">{bestDuo.player.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-pink-500 rounded-full" />
                          <span className="text-gray-300">{bestDuo.topPartner.name}</span>
                        </div>
                      </div>

                      {/* Duo Stats Card */}
                      <div className="mt-6 w-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur rounded-xl p-3">
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-4 h-4" />
                            <span className="font-bold">DUO STATISTICS</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">Games</div>
                            <div className="text-xl font-bold text-white">{bestDuo.duoStats.gamesPlayed}</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                            <div className="text-xl font-bold text-green-400">{bestDuo.duoStats.winRate}%</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">Synergy</div>
                            <div className="text-xl font-bold text-yellow-400">{bestDuo.duoStats.synergy}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Player 2 */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-pink-500/30 rounded-lg blur-2xl" />
                        <img
                          src={bestDuo.topPartner.avatar}
                          alt={bestDuo.topPartner.mainChampion}
                          className="relative w-48 h-48 object-cover object-top rounded-lg border-2 border-pink-500 shadow-2xl"
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                          <img
                            src={bestDuo.topPartner.championIcon}
                            alt={bestDuo.topPartner.mainChampion}
                            className="w-16 h-16 rounded-full border-2 border-pink-400 bg-gray-900 shadow-lg"
                          />
                        </div>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 text-center mt-4">
                        {bestDuo.topPartner.name}
                      </h3>
                      <div className="text-pink-300 font-bold text-lg mb-1">
                        {bestDuo.topPartner.mainChampion}
                      </div>
                      <Badge variant="outline" className="mb-4 border-pink-400 text-pink-300">
                        {bestDuo.topPartner.rank}
                      </Badge>

                      <div className="w-full space-y-2">
                        <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-pink-500/30">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Total Games</span>
                            <span className="text-white font-bold">{bestDuo.topPartner.gamesPlayed}</span>
                          </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-pink-500/30">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Win Rate</span>
                            <span className="text-green-400 font-bold">{bestDuo.topPartner.winRate}%</span>
                          </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-pink-500/30">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">KDA Ratio</span>
                            <span className="text-yellow-400 font-bold">{bestDuo.topPartner.kda}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  )
}

export default BestDuo