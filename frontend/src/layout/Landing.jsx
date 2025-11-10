import { useState } from "react";
import Footer from "@/components/Footer";
import InputArea from "@/components/InputArea";
import { motion } from "framer-motion";

const champions = [
  {
    name: "Ahri",
    role: "The Nine-Tailed Fox",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
  },
  {
    name: "Yasuo",
    role: "The Unforgiven",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
  },
  {
    name: "Jinx",
    role: "The Loose Cannon",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
  },
  {
    name: "Lux",
    role: "The Lady of Luminosity",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg",
  },
  {
    name: "Ezreal",
    role: "The Prodigal Explorer",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg",
  },
];

export default function Landing() {
  const [bgImage, setBgImage] = useState(champions[0].image);

  return (
    <div className="dark bg-black text-white overflow-hidden">
      <div className="relative overflow-hidden min-h-screen">
        {/* Background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center brightness-50 z-10"
          style={{ backgroundImage: `url(${bgImage})` }}
          animate={{
            backgroundPosition: ["50% 48%", "50% 52%", "50% 48%"],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Hero Section */}
        <section className="relative h-[85vh] flex flex-col justify-center items-center text-center z-20 overflow-hidden">
          <div className="relative z-20 flex flex-col items-center space-y-4">
            <h1 className="text-6xl font-extrabold drop-shadow-lg">Rift Rewind 2025</h1>
            <p className="text-lg text-gray-300">Your Year. Your Fights. Your Glory.</p>
            <InputArea />
          </div>
        </section>

        {/* Popular Champions */}
        <section className="absolute top-20 left-15 transform -translate-x-1/2 z-20">
          <div className="grid grid-rows-1 gap-5">
            {champions.map((champ) => (
              <motion.div
                key={champ.name}
                className="relative group rounded-sm overflow-hidden shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => setBgImage(champ.image)}
              >
                <img
                  src={champ.image}
                  alt={champ.name}
                  className="object-cover h-15 w-15 brightness-75 group-hover:brightness-100 transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      

      {/* Footer */}
      <Footer />
    </div>
  );
}