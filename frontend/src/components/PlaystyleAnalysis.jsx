import { Card } from "@/components/ui/card"

const PlaystyleAnalysis = ( {insights} ) => {

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <Card className="p-6 bg-card/30 backdrop-blur-md border-2 border-border hover:border-accent transition-all duration-300 h-full shadow-glow-purple">
          <div className="text-4xl mb-3 flex items-center">
            {insight.icon}
            <h4 className="text-xl font-bold ml-4 text-foreground">
              {insight.title}
            </h4>
          </div>
          <p className="text-muted-foreground">{insight.description}</p>
        </Card>
      ))}
    </div>
  )
}

export default PlaystyleAnalysis
