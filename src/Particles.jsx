import { useEffect, useRef } from 'react'

const W = 480
const H = 400
const CX = W / 2
const CY = H / 2
const N = 720
const SHAPES = ['Cosmic', 'TwinSparkle', 'Burst', 'Surprise', 'Wing']
const SVG_SHAPES = {
  TwinSparkle: 'M 315.5 71 L 317.5 71 L 296.5 106 L 274.5 150 L 268.5 168 L 268.5 180 L 273 184.5 L 282 188.5 L 330 196.5 L 385 198.5 L 386.5 200 L 385 201.5 L 340 202.5 L 296 206.5 L 263 212.5 L 242 220.5 L 229 230.5 L 186.5 278 L 151.5 328 L 150 329.5 L 147.5 328 L 159.5 310 L 185.5 262 L 196.5 234 L 197.5 220 L 185 211.5 L 162 206.5 L 124 202.5 L 81 201.5 L 79.5 200 L 81 198.5 L 139 196.5 L 167 193.5 L 197 188.5 L 223 179.5 L 234 171.5 L 263.5 141 L 315 71.5 Z M 377.5 95 L 364.5 120 L 363.5 129 L 377 133.5 L 400.5 135 L 372 136.5 L 354 141.5 L 341.5 154 L 325.5 175 L 339.5 150 L 341.5 142 L 337 138.5 L 329 136.5 L 303.5 135 L 329 133.5 L 349 128.5 L 360.5 118 L 377 95.5 Z',
  Burst: 'M 120.5 61 L 150.5 106 L 161.5 120 L 177 133.5 L 186 132.5 L 200 123.5 L 227.5 97 L 252 69.5 L 219.5 124 L 213.5 141 L 213.5 150 L 215.5 153 L 231 161.5 L 250 167.5 L 308 180.5 L 353.5 188 L 267 181.5 L 231 181.5 L 217 183.5 L 210.5 187 L 211.5 202 L 221.5 229 L 271 332.5 L 219.5 247 L 188.5 203 L 180 194.5 L 175 192.5 L 165 194.5 L 151 203.5 L 143 211.5 L 153.5 189 L 153.5 174 L 150 169.5 L 142 164.5 L 118.5 157 L 138 156.5 L 148 153.5 L 153.5 149 L 154.5 142 L 145.5 113 L 121 61.5 Z',
  Surprise: 'M 150.5 56 L 156 55.5 L 161.5 62 L 173.5 110 L 190.5 167 L 190.5 172 L 193.5 177 L 199.5 199 L 197.5 205 L 186 214.5 L 179 214.5 L 175.5 210 L 167.5 183 L 150.5 138 L 146.5 122 L 143.5 118 L 137.5 100 L 137.5 87 L 146.5 60 Z M 276.5 83 L 286 83.5 L 289.5 90 L 286.5 119 L 280.5 281 L 278.5 288 L 275 290.5 L 270 290.5 L 240 278.5 L 236.5 274 L 225.5 175 L 222.5 163 L 220.5 134 L 216.5 112 L 216.5 101 L 220 97.5 Z M 197.5 226 L 205 225.5 L 207.5 228 L 216.5 256 L 216.5 261 L 211 266.5 L 197 268.5 L 194.5 266 L 188.5 251 L 185.5 237 L 189 231.5 Z M 318.5 262 L 325 261.5 L 344.5 275 L 344.5 281 L 329.5 311 L 329.5 314 L 325 319.5 L 317 319.5 L 308.5 313 L 304.5 305 L 314.5 268 Z M 244.5 298 L 251 298.5 L 278.5 312 L 280.5 316 L 278.5 341 L 274 344.5 L 270 344.5 L 244.5 330 L 241.5 325 L 239.5 314 L 239.5 301 Z',
  Wing: 'M 299.5 70 C 284 99 262 122 230 155 C 219 166 207 181 197 198 C 229 179 256 162 276 145 C 300 125 314 106 320 92 C 304 116 285 137 263 155 C 239 175 216 197 198 220 C 233 205 260 190 281 173 C 301 156 316 139 324 123 C 305 150 283 172 258 190 C 233 209 212 229 194 252 C 231 239 263 223 287 203 C 307 186 323 169 331 151 C 314 180 293 202 268 222 C 243 241 219 263 193 286 C 228 278 262 263 291 242 C 313 226 330 207 339 188 C 320 218 296 242 269 263 C 245 281 219 302 184 330 C 222 326 259 311 292 289 C 317 272 336 251 347 229 Z',
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const stillness = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const pointAngle = (x, y) => Math.atan2(y - CY, x - CX)

function addSparkle(path, cx, cy, rx, ryTop, ryBottom, waist, angle = 0) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const point = (x, y) => [cx + x * cos - y * sin, cy + x * sin + y * cos]
  const radius = Math.max(2, Math.min(rx, (ryTop + ryBottom) / 2) * 0.06)
  const [topLeftX, topLeftY] = point(-radius, -ryTop + radius * 1.8)
  const [topX, topY] = point(0, -ryTop)
  const [topRightX, topRightY] = point(radius, -ryTop + radius * 1.8)
  const [rightTopX, rightTopY] = point(rx - radius * 1.8, -radius)
  const [rightX, rightY] = point(rx, 0)
  const [rightBottomX, rightBottomY] = point(rx - radius * 1.8, radius)
  const [bottomRightX, bottomRightY] = point(radius, ryBottom - radius * 1.8)
  const [bottomX, bottomY] = point(0, ryBottom)
  const [bottomLeftX, bottomLeftY] = point(-radius, ryBottom - radius * 1.8)
  const [leftBottomX, leftBottomY] = point(-rx + radius * 1.8, radius)
  const [leftX, leftY] = point(-rx, 0)
  const [leftTopX, leftTopY] = point(-rx + radius * 1.8, -radius)

  path.moveTo(topLeftX, topLeftY)
  path.quadraticCurveTo(topX, topY, topRightX, topRightY)
  path.bezierCurveTo(...point(waist * 0.88, -ryTop * 0.32), ...point(rx * 0.32, -waist * 0.88), rightTopX, rightTopY)
  path.quadraticCurveTo(rightX, rightY, rightBottomX, rightBottomY)
  path.bezierCurveTo(...point(rx * 0.32, waist * 0.88), ...point(waist * 0.88, ryBottom * 0.32), bottomRightX, bottomRightY)
  path.quadraticCurveTo(bottomX, bottomY, bottomLeftX, bottomLeftY)
  path.bezierCurveTo(...point(-waist * 0.88, ryBottom * 0.32), ...point(-rx * 0.32, waist * 0.88), leftBottomX, leftBottomY)
  path.quadraticCurveTo(leftX, leftY, leftTopX, leftTopY)
  path.bezierCurveTo(...point(-rx * 0.32, -waist * 0.88), ...point(-waist * 0.88, -ryTop * 0.32), topLeftX, topLeftY)
  path.closePath()
}

function cosmicPath() {
  const path = new Path2D()
  addSparkle(path, CX, CY, 124, 146, 160, 36, -0.04)
  path.ellipse(CX, CY - 2, 148, 50, -0.65, 0, Math.PI * 2)
  return path
}

function shapePath(shape) {
  if (shape === 'Cosmic') return cosmicPath()
  if (SVG_SHAPES[shape]) return new Path2D(SVG_SHAPES[shape])
  return new Path2D()
}

function homePositions(shape) {
  const mask = document.createElement('canvas')
  mask.width = W
  mask.height = H
  const ctx = mask.getContext('2d')
  const path = shapePath(shape)
  let inside

  if (shape === 'Cosmic') {
    const star = new Path2D()
    addSparkle(star, CX, CY, 124, 146, 160, 36, -0.04)
    ctx.fill(star)
    ctx.beginPath()
    ctx.ellipse(CX, CY - 2, 148, 50, -0.65, 0, Math.PI * 2)
    ctx.fill()
    const pixels = ctx.getImageData(0, 0, W, H).data
    inside = (x, y) => pixels[((Math.floor(y) * W + Math.floor(x)) * 4) + 3] > 128
  } else {
    inside = (x, y) => ctx.isPointInPath(path, x, y)
  }

  let area = 0
  for (let y = 1; y < H; y += 2) for (let x = 1; x < W; x += 2) if (inside(x, y)) area += 4
  const spacing = Math.sqrt((area / N) * (2 / Math.sqrt(3)))
  const rowHeight = (spacing * Math.sqrt(3)) / 2
  const points = []
  for (let y = rowHeight / 2, row = 0; y < H; y += rowHeight, row += 1) {
    for (let x = spacing / 2 + (row % 2) * (spacing / 2); x < W; x += spacing) {
      if (inside(x, y)) points.push([x, y])
    }
  }
  if (!points.length) return Array.from({ length: N }, () => [CX, CY])
  return Array.from({ length: N }, (_, index) => points[Math.floor((index * points.length) / N)])
}

export default function Particles({ shape = 'Wing', reach = 30, force = 100, grain = 'Fine', dotSize = 1 } = {}) {
  const canvasRef = useRef(null)
  const dotsRef = useRef([])
  const currentShapeRef = useRef('Wing')
  const pointerRef = useRef(null)
  const frameRef = useRef(0)
  const optionsRef = useRef({ reach, force, grain, dotSize })
  optionsRef.current = { reach, force, grain, dotSize }
  const reducedMotion = stillness()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * ratio)
      canvas.height = Math.round(H * ratio)
      draw()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas.parentElement)
    return () => observer.disconnect()
  }, [])

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    const scale = canvas.width / W
    context.setTransform(scale, 0, 0, scale, 0, 0)
    context.clearRect(0, 0, W, H)
    context.fillStyle = getComputedStyle(canvas).color
    const settings = optionsRef.current
    const radius = typeof settings.dotSize === 'number' && settings.dotSize > 0 ? settings.dotSize : settings.grain === 'Coarse' ? 2.7 : 1.9
    context.beginPath()
    for (const dot of dotsRef.current) {
      const speed = Math.hypot(dot.vx, dot.vy)
      if (speed < 0.3) {
        context.moveTo(dot.x + radius, dot.y)
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
      } else {
        const stretch = Math.min(2.6, 1 + speed * 0.12)
        const rotation = Math.atan2(dot.vy, dot.vx)
        context.moveTo(dot.x + Math.cos(rotation) * radius * stretch, dot.y + Math.sin(rotation) * radius * stretch)
        context.ellipse(dot.x, dot.y, radius * stretch, radius / Math.sqrt(stretch), rotation, 0, Math.PI * 2)
      }
    }
    context.fill()
  }

  const become = (nextShape) => {
    const homes = homePositions(nextShape)
    const dots = dotsRef.current
    currentShapeRef.current = nextShape
    if (!dots.length) {
      dotsRef.current = homes.map(([x, y]) => ({ hx: x, hy: y, x, y, vx: 0, vy: 0 }))
      return
    }
    const from = dots.map((dot, index) => [pointAngle(dot.x, dot.y), index]).sort((a, b) => a[0] - b[0])
    const to = homes.map((point, index) => [pointAngle(point[0], point[1]), index]).sort((a, b) => a[0] - b[0])
    from.forEach(([, dotIndex], index) => {
      const home = homes[to[index][1]]
      dots[dotIndex].hx = home[0]
      dots[dotIndex].hy = home[1]
      if (reducedMotion) {
        dots[dotIndex].x = home[0]
        dots[dotIndex].y = home[1]
      }
    })
  }

  const run = () => {
    if (frameRef.current) return
    let previous = 0
    const tick = (timestamp) => {
      const dt = previous ? clamp((timestamp - previous) / 16.67, 0, 2.5) : 1
      previous = timestamp
      const pointer = pointerRef.current
      const radius = clamp(optionsRef.current.reach, 30, 160)
      const strength = (clamp(optionsRef.current.force, 0, 100) / 100) * 11
      let moving = Boolean(pointer)
      for (const dot of dotsRef.current) {
        if (pointer && !reducedMotion) {
          const dx = dot.x - pointer.x
          const dy = dot.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance < radius && distance > 0.01) {
            const push = Math.pow(1 - distance / radius, 2) * strength
            dot.vx += (dx / distance) * push * dt
            dot.vy += (dy / distance) * push * dt
          }
        }
        dot.vx = (dot.vx + (dot.hx - dot.x) * 0.05 * dt) * Math.pow(0.84, dt)
        dot.vy = (dot.vy + (dot.hy - dot.y) * 0.05 * dt) * Math.pow(0.84, dt)
        dot.x += dot.vx * dt
        dot.y += dot.vy * dt
        if (Math.abs(dot.hx - dot.x) < 0.05 && Math.abs(dot.hy - dot.y) < 0.05 && Math.abs(dot.vx) < 0.02 && Math.abs(dot.vy) < 0.02) {
          dot.x = dot.hx
          dot.y = dot.hy
          dot.vx = 0
          dot.vy = 0
        } else moving = true
      }
      draw()
      frameRef.current = moving ? requestAnimationFrame(tick) : 0
    }
    frameRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const validShape = SHAPES.includes(shape) ? shape : SHAPES[0]
    become(validShape)
    draw()
    run()
  }, [shape])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const pointerPosition = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const scale = rect.width / W
    return { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale }
  }

  const changeShape = (event) => {
    if (!reducedMotion) {
      const point = pointerPosition(event)
      for (const dot of dotsRef.current) {
        const dx = dot.x - point.x
        const dy = dot.y - point.y
        const distance = Math.hypot(dx, dy)
        if (distance > 200 || distance < 0.01) continue
        const push = (1 - distance / 200) * 30 * (0.4 + (clamp(force, 0, 100) / 100) * 1.2)
        dot.vx += (dx / distance) * push
        dot.vy += (dy / distance) * push
      }
    }
    const nextIndex = (SHAPES.indexOf(currentShapeRef.current) + 1) % SHAPES.length
    become(SHAPES[nextIndex])
    draw()
    run()
  }

  return <div className="ptc">
    <canvas
      ref={canvasRef}
      className="ptc-canvas"
      role="img"
      aria-label="Bentuk partikel interaktif. Gerakkan pointer untuk mengusik titik, klik untuk mengganti bentuk."
      onPointerMove={(event) => {
        if (reducedMotion) return
        pointerRef.current = pointerPosition(event)
        run()
      }}
      onPointerLeave={() => { pointerRef.current = null; run() }}
      onPointerDown={changeShape}
    />
  </div>
}
