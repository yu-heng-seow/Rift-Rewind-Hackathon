import { motion } from "framer-motion"

const ClosingSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: "20%", left: "20%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: "20%", right: "20%" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-gold bg-clip-text text-transparent">
            See You on the Rift
          </h2>
          <p className="text-2xl md:text-3xl text-foreground/80 mb-12">
            Your legend continues in 2025
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-6 bg-card/30 backdrop-blur-sm rounded-lg border-2 border-primary"
            >
              <div className="text-5xl mb-4">🎯</div>
              <div className="text-3xl font-bold text-primary mb-2">487</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-6 bg-card/30 backdrop-blur-sm rounded-lg border-2 border-secondary"
            >
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-3xl font-bold text-secondary mb-2">
                52.7%
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-6 bg-card/30 backdrop-blur-sm rounded-lg border-2 border-accent"
            >
              <div className="text-5xl mb-4">⚡</div>
              <div className="text-3xl font-bold text-accent mb-2">324</div>
              <div className="text-sm text-muted-foreground">Hours Played</div>
            </motion.div>
          </div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            Thank you for an incredible year. Here's to climbing even higher in
            the next season!
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default ClosingSection
