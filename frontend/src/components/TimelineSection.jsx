import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card } from "@/components/ui/card"

gsap.registerPlugin(ScrollTrigger)

const timelineEvents = [
  {
    month: "January",
    title: "Season Start",
    description: "Placed in Gold III after placements",
    highlight: "Started strong with 7-3 placements"
  },
  {
    month: "March",
    title: "Champion Pool Expansion",
    description: "Mastered Zed and Lee Sin",
    highlight: "Added two new champions to rotation"
  },
  {
    month: "June",
    title: "Yasuo Mastery 7",
    description: "Achieved highest mastery with main champion",
    highlight: "487K mastery points"
  },
  {
    month: "August",
    title: "Pentakill Spree",
    description: "Epic month with 3 pentakills",
    highlight: "Best performance of the season"
  },
  {
    month: "October",
    title: "Platinum Promotion",
    description: "Reached Platinum I for the first time",
    highlight: "Personal best rank achieved"
  },
  {
    month: "December",
    title: "Year-End Push",
    description: "Finished with 52.7% win rate",
    highlight: "487 total games played"
  }
]

const TimelineSection = () => {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    if (!lineRef.current) return

    gsap.from(lineRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 20%",
        scrub: 1
      },
      scaleY: 0,
      transformOrigin: "top"
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-gold bg-clip-text text-transparent">
            Your Journey
          </h2>
          <p className="text-xl text-muted-foreground">
            Key moments throughout 2024
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent"
            style={{ transform: "translateX(-50%)" }}
          />

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.month}
                initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col md:gap-8`}
              >
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  } mb-4 md:mb-0`}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary transition-all duration-300 inline-block">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-sm text-primary font-bold mb-2">
                        {event.month}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      <p className="text-sm text-secondary font-semibold">
                        {event.highlight}
                      </p>
                    </motion.div>
                  </Card>
                </div>

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    className="w-12 h-12 rounded-full bg-gradient-gold border-4 border-background shadow-glow-gold flex items-center justify-center"
                  >
                    <span className="text-xl font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </motion.div>
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineSection
