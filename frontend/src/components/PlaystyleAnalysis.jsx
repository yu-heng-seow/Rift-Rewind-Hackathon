import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const PlaystyleAnalysis = ( {insights} ) => {

  return (
    <div className="space-y-6">
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
            <div className="text-4xl mb-2 flex items-center">
              {insight.icon}
              <h4 className="text-xl font-bold ml-4 text-foreground">
                {insight.title}
              </h4>
            </div>
            <p className="text-muted-foreground">{insight.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default PlaystyleAnalysis
