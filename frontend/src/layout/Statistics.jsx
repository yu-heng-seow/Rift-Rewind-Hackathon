import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const champions = [
  { name: "Ahri", role: "Mid", games: 32, winRate: 68, KDA: 3.5 },
  { name: "Yasuo", role: "Mid", games: 28, winRate: 54, KDA: 2.8 },
  { name: "Lux", role: "Support", games: 20, winRate: 70, KDA: 4.2 },
  { name: "Jinx", role: "ADC", games: 25, winRate: 60, KDA: 3.1 },
  { name: "LeeSin", role: "Jungle", games: 18, winRate: 50, KDA: 2.5 },
  { name: "Akali", role: "Mid", games: 15, winRate: 66, KDA: 3.9 },
  { name: "Ezreal", role: "ADC", games: 12, winRate: 75, KDA: 4.0 },
  { name: "MissFortune", role: "ADC", games: 10, winRate: 55, KDA: 2.9 },
  { name: "Teemo", role: "Top", games: 8, winRate: 62, KDA: 3.2 },
  { name: "Garen", role: "Top", games: 5, winRate: 80, KDA: 4.5 },
];

export default function YearEndSummary() {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray(".gridBlock");
      const layers = gsap.utils.toArray(".gridLayer");
      const gridEl = document.querySelector(".grid");

      // Scroll-triggered animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".grid-container",
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: ".grid",
          anticipatePin: 1,
        },
      });

      tl.set(blocks, { autoAlpha: 0 })
        .to(blocks, { autoAlpha: 1, duration: 0.6, stagger: 0.15 }, 0)
        .from(layers, { scale: 2.5, ease: "power1.out", stagger: 0.15 }, 0);

      // Move grid up smoothly at the end
      gsap.to(gridEl, {
        y: "-50vh",
        scrollTrigger: {
          trigger: ".grid-container",
          start: "bottom bottom",
          end: "+=50%",
          scrub: true,
        },
      });

      // Set champion images
      gsap.set(blocks, {
        backgroundImage: (i) =>
          `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champions[i % champions.length].name}_0.jpg)`,
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  const positions = [
    "top-[5vw] left-[20vw] w-[10vw] h-[10vw]",
    "top-0 left-[32.5vw] w-[15vw] h-[15vw]",
    "top-[25vw] left-0 w-[15vw] h-[15vw]",
    "top-[17.5vw] left-[17.5vw] w-[30vw] h-[30vw]",
    "top-[20vw] left-[50vw] w-[5vw] h-[5vw]",
    "top-[27.5vw] left-[50vw] w-[20vw] h-[20vw]",
    "top-[42.5vw] left-[10vw] w-[5vw] h-[5vw]",
    "bottom-[5vw] left-[42.5vw] w-[5vw] h-[5vw]",
    "bottom-0 left-[50vw] w-[10vw] h-[10vw]",
  ];

  // Helper for role distribution
  const roleDistribution = champions.reduce((acc, c) => {
    acc[c.role] = (acc[c.role] || 0) + c.games;
    return acc;
  }, {});

  return (
    <div className="bg-gray-900 text-white font-sans overflow-x-hidden">
      <div className="px-4 py-8 ">
        <h1 className="text-center text-4xl md:text-5xl py-8 font-bold">
          Year-End Summary
        </h1>
        <p className="text-center text-lg md:text-xl max-w-2xl mx-auto pb-8">
          Here's a summary of your most played champions, performance stats, and roles this year.
        </p>
      </div>

      {/* Champion Grid */}
      <div ref={gridRef} className="grid-container relative w-screen h-[300vh] m-8">
        <div className="grid absolute w-[70vw] h-[60vw] left-[15vw] top-0">
          {positions.map((pos, i) => {
            const champ = champions[i % champions.length];
            return (
              <div
                key={i}
                className={`gridLayer absolute top-0 left-0 w-full h-full ${
                  i === 3 ? "centerPiece" : ""
                }`}
                style={{ transformOrigin: "45% 50%" }}
              >
                <div
                  className={`gridBlock absolute rounded-lg shadow-lg bg-cover bg-center ${pos} ${
                    i === 3 ? "centerBlock" : ""
                  } flex items-end justify-center`}
                >
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Other Insights Section */}
      <div className="max-w-4xl mx-auto text-center py-16 px-4 space-y-6">
        <h2 className="text-3xl font-semibold">Other Insights</h2>
        <p>Total Games Played: {champions.reduce((a, c) => a + c.games, 0)}</p>
        <p>
          Favorite Role:{" "}
          {Object.keys(roleDistribution).reduce((a, b) =>
            roleDistribution[a] > roleDistribution[b] ? a : b
          )}
        </p>
        <p>
          Highest Win Rate:{" "}
          {champions.reduce((a, c) => (c.winRate > a.winRate ? c : a), champions[0]).name}
        </p>
        <p>
          Highest KDA:{" "}
          {champions.reduce((a, c) => (c.KDA > a.KDA ? c : a), champions[0]).name}
        </p>
        <p>
          Role Distribution:
          <ul className="list-disc list-inside">
            {Object.entries(roleDistribution).map(([role, games]) => (
              <li key={role}>
                {role}: {games} games
              </li>
            ))}
          </ul>
        </p>
      </div>
    </div>
  );
}
