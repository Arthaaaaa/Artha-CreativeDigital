import { useEffect, useRef } from 'react'
import { paintRecipe } from './generated/react-gradient-engine.js'

const recipe = {
  type: 'FLOW',
  width: 2048,
  height: 1152,
  speed: 20,
  startT: 252.1678968800584,
  stops: ['#07090D', '#07090D', '#0E1420', '#0E1420', '#1E50A2', '#6ED3FF'],
  divs: [0.40732355900531836, 0.6591562455081214, 0.7949668992664161, 0.8549668992664161, 0.9149668992664162],
  mesh: [[44.19459293287707, 3], [59.710108899083394, 13.223032585923498], [72.31615673644659, 46.3037109375]],
  params: { scale: 100, distortion: 10, swirl: 60 },
  size: 50,
  hexStyle: 'hive',
  ballStyle: 'convex',
  glintHorizon: 0.44,
  cover: 50,
  rings: 12,
  weave: 20,
  refract: 50,
}

export default function HeroGradient() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    if (!canvas.getContext('2d')) return undefined

    let frame = 0
    let previousTime = 0
    let time = recipe.startT
    const render = () => paintRecipe(canvas, recipe, time)
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const scale = Math.min(window.devicePixelRatio || 1, 240 / Math.max(width, height, 1))
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      render()
    }
    const animate = (now) => {
      if (previousTime) time += recipe.speed / 100 * 1.2 * Math.min(0.05, (now - previousTime) / 1000)
      previousTime = now
      render()
      frame = window.requestAnimationFrame(animate)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    frame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <canvas className="hero-gradient" ref={canvasRef} aria-hidden="true" />
}
