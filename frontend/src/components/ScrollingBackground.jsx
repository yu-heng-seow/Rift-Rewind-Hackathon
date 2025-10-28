import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { createNoise2D } from "simplex-noise"

gsap.registerPlugin(ScrollTrigger)

const ScrollingBackground = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const simplex = createNoise2D()
    const circles = []

    // Create noise circles
    for (let i = 0; i < 200; i++) {
      const div = document.createElement("div")
      div.classList.add("noise-circle")
      const n1 = simplex(i * 0.003, i * 0.0033)
      const n2 = simplex(i * 0.002, i * 0.001)

      const hue = Math.floor(i * 0.3) % 360
      const style = {
        transform: `translate(${n2 * 200}px, ${n1 * 200}px) rotate(${n2 *
          270}deg) scale(${3 + n1 * 2}, ${3 + n2 * 2})`,
        boxShadow: `0 0 0 .2px hsla(${hue}, 70%, 60%, .4)`,
        opacity: "0"
      }
      Object.assign(div.style, style)
      containerRef.current.appendChild(div)
      circles.push(div)
    }

    // Animate circles on scroll
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7
      }
    })

    circles.forEach((circle, i) => {
      timeline.to(
        circle,
        {
          opacity: i % 3 === 0 ? 0.6 : 0.3
        },
        0
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
      circles.forEach(circle => circle.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        width: "100%",
        height: "100%"
      }}
    />
  )
}

export default ScrollingBackground
