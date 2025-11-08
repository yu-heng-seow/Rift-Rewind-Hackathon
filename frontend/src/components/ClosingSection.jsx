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
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 bg-gradient-gold bg-clip-text text-transparent">
            See You on the Rift
          </h2>
          <p className="text-2xl md:text-3xl text-foreground/80 mb-12">
            Your legend continues in 2026
          </p>

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
