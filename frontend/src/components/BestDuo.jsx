import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Users, Trophy, Target, Zap, Loader2 } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { useYES, useSAW, useCOMP } from "@/hooks/useAPI";

const RadarChart = ({ player1Data, player2Data }) => {
  const metrics = ['Farming', 'Vision', 'Aggression', 'Teamplay', 'Consistency', 'Versatility']
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
      data.farming || 0,
      data.vision || 0,
      data.aggression || 0,
      data.teamplay || 0,
      data.consistency || 0,
      data.versatility || 0
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
  const { playerInput, playerData, setPlayerData, yesResponse } = usePlayer()
  const [showDetails, setShowDetails] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { fetchSAW } = useSAW();
  const { fetchYES } = useYES();
  const { fetchCOMP } = useCOMP();

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  const handleViewDetails = async (e) => {
    e.stopPropagation()
    setLoading(true)
    setError(null)
    setShowDetails(true)

    try {
      // Parse duo player input
      const duoInput = {
        gameName: playerData.bestDuo.name,
        tagLine: yesResponse.bestDuo.tagline || 'NA1',
        region: playerInput.region
      }

      console.log("Fetching duo data for:", duoInput)

      // Fetch duo player data (YES + SAW)
      const yesRes = await fetchYES(duoInput);
      const sawRes = await fetchSAW(duoInput);

      console.log("Duo YES Response:", yesRes)
      console.log("Duo SAW Response:", sawRes)

      // Update bestDuo with YES data
      if (yesRes) {
        const summoner = yesRes.summoner || {}
        const stats = yesRes.yearStats || {}
        const topChamps = yesRes.topChampions || []

        const updatedBestDuo = {
          ...playerData.bestDuo,
          name: summoner.name || playerData.bestDuo.name,
          avatar: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChamps[0]?.name || "Malphite"}_0.jpg`,
          mainChampion: topChamps[0]?.name || "Unknown",
          championIcon: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${topChamps[0]?.name || "Malphite"}.png`,
          rank: summoner.rank || "Unranked",
          winRate: summoner.winRate || 0,
          kda: `${((stats.totalKills + stats.totalAssists) / Math.max(stats.totalDeaths, 1)).toFixed(2)}:1`,
          gamesPlayed: stats.gamesPlayed || 0,
        }

        // Update bestDuo with SAW data
        if (sawRes) {
          let parsedSAW = null
          try {
            parsedSAW = sawRes?.response ? JSON.parse(sawRes.response) : null
          } catch (err) {
            console.error("Failed to parse SAW response:", err)
          }

          if (parsedSAW && parsedSAW.scores) {
            updatedBestDuo.performanceMetrics = Object.entries(parsedSAW.scores).map(([metric, value]) => ({
              metric: metric.charAt(0).toUpperCase() + metric.slice(1),
              value: value,
              description: parsedSAW.insights?.[metric] || ""
            }))
          }
        }

        // Fetch COMP data
        const compInput = {
          player: {
            gameName: playerInput?.gameName,
            tagLine: playerInput?.tagLine || 'NA1',
            region: playerInput.region
          },
          bestDuo: duoInput
        }

        console.log("Fetching COMP data with:", compInput)
        const compRes = await fetchCOMP(compInput)
        console.log("COMP Response:", compRes)

        // Parse COMP data
        let parsedCOMP = null
        try {
          parsedCOMP = compRes?.response ? JSON.parse(compRes.response) : null
        } catch (err) {
          console.error("Failed to parse COMP response:", err)
        }

        // Update duoStats with COMP data
        let updatedDuoStats = { ...playerData.duoStats }
        
        if (parsedCOMP) {
          // Calculate synergy score based on playstyle comparison
          const isSimilar = parsedCOMP.playstyle_comparison?.synergy?.includes("similar")
          const synergyScore = isSimilar ? 70 : 94 // Lower for similar, higher for complementary

          // Extract best combo from score comparison insights
          const bestCombo = parsedCOMP.playstyle_comparison?.synergy || 
                           parsedCOMP.summary || 
                           "Strong synergy detected!"

          updatedDuoStats = {
            gamesPlayed: updatedBestDuo.gamesPlayed || 0,
            winRate: playerData.duoStats?.winRate || 0, // Keep original duo win rate if available
            synergy: synergyScore,
            bestCombo: bestCombo
          }
        }

        // Update playerData with all new information
        setPlayerData({
          ...playerData,
          bestDuo: updatedBestDuo,
          duoStats: updatedDuoStats
        })
      }

    } catch (err) {
      console.error("Error fetching duo details:", err)
      setError("Failed to load duo details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!playerData) return null

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
                    <div className="flex justify-center items-center py-6 bg-black/50 backdrop-blur-lg rounded-xl shadow-lg min-w-[180px]">
                      <img
                        src={playerData.summoner.championIcon}
                        alt={playerData.summoner.mainChampion}
                        className="w-14 h-14 rounded-full border-2 border-purple-400 shadow-md object-cover"
                      />
                      <div className="ml-6">
                        <h4 className="text-lg font-bold text-white mb-2 text-center">{playerData.summoner.name}</h4>
                        <Badge variant="outline" className="text-xs border-purple-400 text-purple-300 px-2 py-0.5">
                          {playerData.summoner.rank}
                        </Badge>
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
                    <div className="flex justify-center items-center py-6 bg-black/50 backdrop-blur-lg rounded-xl shadow-lg min-w-[180px]">
                      <img
                        src={playerData.bestDuo.championIcon}
                        alt={playerData.bestDuo.mainChampion}
                        className="w-14 h-14 rounded-full border-2 border-pink-400 shadow-md object-cover"
                      />
                      <div className="ml-6">
                        <h4 className="text-lg font-bold text-white mb-2 text-center">{playerData.bestDuo.name}</h4>
                        <Badge variant="outline" className="text-xs border-pink-400 text-pink-300 px-2 py-0.5">
                          {playerData.bestDuo.rank}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleViewDetails}
                    disabled={loading}
                    className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-1" />
                        View Details
                      </>
                    )}
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
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                      <span className="text-xl">Loading duo analysis...</span>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  {!loading && !error && playerData.bestDuo.performanceMetrics?.length > 0 && (
                    <>
                      {/* Header */}
                      <div className="text-center mb-8">
                        <Badge className="mb-4 bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30">
                          ★ LEGENDARY DUO ANALYSIS ★
                        </Badge>
                        <h2 className="text-4xl font-black text-white mb-2">
                          {playerData.summoner.name} & {playerData.bestDuo.name}
                        </h2>
                        <p className="text-gray-400">
                          {playerData.duoStats?.bestCombo || "Loading synergy analysis..."}
                        </p>
                      </div>

                      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
                        {/* Player 1 */}
                        <div className="flex flex-col items-center">
                          <div className="relative mb-6">
                            <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur-2xl" />
                            <img
                              src={playerData.summoner.avatar}
                              alt={playerData.summoner.mainChampion}
                              className="relative w-48 h-48 object-cover object-top rounded-lg border-2 border-purple-500 shadow-2xl"
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                              <img
                                src={playerData.summoner.championIcon}
                                alt={playerData.summoner.mainChampion}
                                className="w-16 h-16 rounded-full border-2 border-purple-400 bg-gray-900 shadow-lg"
                              />
                            </div>
                          </div>
                          <h3 className="text-3xl font-black text-white mb-2 text-center mt-4">
                            {playerData.summoner.name}
                          </h3>
                          <div className="text-purple-300 font-bold text-lg mb-1">
                            {playerData.summoner.mainChampion}
                          </div>
                          <Badge variant="outline" className="mb-4 border-purple-400 text-purple-300">
                            {playerData.summoner.rank}
                          </Badge>

                          <div className="w-full space-y-2">
                            <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-purple-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Total Games</span>
                                <span className="text-white font-bold">{playerData.yearStats.gamesPlayed}</span>
                              </div>
                            </div>
                            <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-purple-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Win Rate</span>
                                <span className="text-green-400 font-bold">{playerData.summoner.winRate}%</span>
                              </div>
                            </div>
                            <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-purple-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">KDA Ratio</span>
                                <span className="text-yellow-400 font-bold">{playerData.summoner.kda}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Center - Radar Chart */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-black/40 backdrop-blur rounded-2xl px-6 py-2 border border-purple-500/30">
                            <RadarChart 
                              player1Data={Object.fromEntries(
                                playerData.performanceMetrics.map(m => [m.metric.toLowerCase(), m.value])
                              )}
                              player2Data={Object.fromEntries(
                                playerData.bestDuo.performanceMetrics.map(m => [m.metric.toLowerCase(), m.value])
                              )}
                            />
                          </div>

                          <div className="mt-6 flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-purple-500 rounded-full" />
                              <span className="text-gray-300">{playerData.summoner.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-pink-500 rounded-full" />
                              <span className="text-gray-300">{playerData.bestDuo.name}</span>
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
                                <div className="text-xl font-bold text-white">{playerData.duoStats?.gamesPlayed || 0}</div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                                <div className="text-xl font-bold text-green-400">{playerData.duoStats?.winRate || 0}%</div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <div className="text-xs text-gray-400 mb-1">Synergy</div>
                                <div className="text-xl font-bold text-yellow-400">
                                  {playerData.duoStats?.synergy || 70}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Player 2 */}
                        <div className="flex flex-col items-center">
                          <div className="relative mb-6">
                            <div className="absolute inset-0 bg-pink-500/30 rounded-lg blur-2xl" />
                            <img
                              src={playerData.bestDuo.avatar}
                              alt={playerData.bestDuo.mainChampion}
                              className="relative w-48 h-48 object-cover object-top rounded-lg border-2 border-pink-500 shadow-2xl"
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                              <img
                                src={playerData.bestDuo.championIcon}
                                alt={playerData.bestDuo.mainChampion}
                                className="w-16 h-16 rounded-full border-2 border-pink-400 bg-gray-900 shadow-lg"
                              />
                            </div>
                          </div>
                          <h3 className="text-3xl font-black text-white mb-2 text-center mt-4">
                            {playerData.bestDuo.name}
                          </h3>
                          <div className="text-pink-300 font-bold text-lg mb-1">
                            {playerData.bestDuo.mainChampion}
                          </div>
                          <Badge variant="outline" className="mb-4 border-pink-400 text-pink-300">
                            {playerData.bestDuo.rank}
                          </Badge>

                          <div className="w-full space-y-2">
                            <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-pink-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Total Games</span>
                                <span className="text-white font-bold">{playerData.bestDuo.gamesPlayed}</span>
                              </div>
                            </div>
                            <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-pink-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Win Rate</span>
                                <span className="text-green-400 font-bold">{playerData.bestDuo.winRate}%</span>
                              </div>
                            </div>
                            <div className="bg-black/40 backdrop-blur rounded-lg p-3 border border-pink-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">KDA Ratio</span>
                                <span className="text-yellow-400 font-bold">{playerData.bestDuo.kda}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
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