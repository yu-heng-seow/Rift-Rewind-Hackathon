import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const champions = [
  {
    name: "Ahri",
    role: "The Nine-Tailed Fox",
    splash:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
    icon: "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/Ahri.png",
  },
  {
    name: "Yasuo",
    role: "The Unforgiven",
    splash:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
    icon: "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/Yasuo.png",
  },
  {
    name: "Jinx",
    role: "The Loose Cannon",
    splash:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
    icon: "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/Jinx.png",
  },
  {
    name: "Lux",
    role: "The Lady of Luminosity",
    splash:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg",
    icon: "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/Lux.png",
  },
  {
    name: "Ezreal",
    role: "The Prodigal Explorer",
    splash:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg",
    icon: "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/Ezreal.png",
  },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-2 bg-transparent">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-white">Rift Rewind</h1>
      </div>

      <div className="flex-1 flex justify-center">
        <Menubar className="bg-black/20 shadow-none border-none">
          <MenubarMenu>
            <MenubarTrigger>Overview</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Dashboard</MenubarItem>
              <MenubarItem>Stats</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Highlights</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Achievements</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Top Champions</MenubarItem>
              <MenubarItem>Game Milestones</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Others</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="flex items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/588.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="py-4 text-center text-gray-500 text-sm bg-black border-t border-gray-800">
      Design & Developed by Benson/Edwin/Yuheng/Zhi Yi @ 2025
    </footer>
  );
};

const InputArea = () => {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName.trim() && tagLine.trim() && region) {
      navigate("/saw", { state: { gameName, tagLine, region } });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-full max-w-sm"
    >
      <div>
        <Label htmlFor="gameName">Gamer Name</Label>
        <Input
          id="gameName"
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter your gamer name"
          className="bg-background/80 text-foreground"
          required
        />
      </div>
      <div>
        <Label htmlFor="tagLine">Tag Line</Label>
        <Input
          id="tagLine"
          type="text"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="Enter your tag line"
          className="bg-background/80 text-foreground"
          required
        />
      </div>
      <div>
        <Label htmlFor="region">Region</Label>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="bg-background/80 text-foreground">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="americas">Americas</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
            <SelectItem value="sea">SEA</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="bg-white text-black">
        View Summary
      </Button>
    </form>
  );
};

export default function Landing() {
  const [bgImage, setBgImage] = useState(champions[0].splash);

  return (
    <div className="dark bg-black text-white overflow-hidden min-h-screen flex flex-col">
      <div className="relative overflow-hidden flex-1">
        <Header />

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
            <h1 className="text-6xl font-extrabold drop-shadow-lg">
              Rift Rewind 2025
            </h1>
            <p className="text-lg text-gray-300">
              Your Year. Your Fights. Your Glory.
            </p>
            <InputArea />
          </div>
        </section>

        {/* Popular Champions - Fixed to vertical sidebar */}
        <section className="absolute top-20 left-10 z-20">
          <div className="grid grid-cols-1 gap-5">
            {champions.map((champ) => (
              <motion.div
                key={champ.name}
                className="relative group rounded-sm overflow-hidden shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => setBgImage(champ.splash)}
              >
                <img
                  src={champ.icon}
                  alt={champ.name}
                  className="object-cover h-16 w-16 brightness-75 group-hover:brightness-100 transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
