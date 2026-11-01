import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import patrickJane from '../../image/Patrick Jane.jpg'
import asa from '../../image/Asa.PNG'
import yeji from '../../image/Yeji.jpg'
import drTirta from '../../image/dr.Tirta.png'
import './about-social-proof.css'

const avatars = [
  { src: patrickJane, label: 'Patrick Jane' },
  { src: asa, label: 'Asa' },
  { src: yeji, label: 'Yeji' },
  { src: drTirta, label: 'dr. Tirta' },
]

const LIKE_BURST = 100
const FIREWORK_COLORS = ['#f48ea7', '#cc8ef5', '#8ce8c3', '#91d2fa', '#f5a524', '#e5484d', '#9fc7fa']
const fireworkParticles = Array.from({ length: 14 }, (_, index) => {
  const spoke = Math.floor(index / 2)
  const pair = index % 2
  const angle = (Math.PI * 2 * spoke) / 7 + (pair === 0 ? -0.07 : 0.07)
  const radius = (pair === 0 ? 34 : 46) * (LIKE_BURST / 100)
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    delay: pair * 0.025,
    color: FIREWORK_COLORS[spoke],
  }
})

function LikeButton() {
  const [count, setCount] = useState(2064)
  const [burst, setBurst] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [rollDirection, setRollDirection] = useState(1)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!burst) return undefined
    const timeout = window.setTimeout(() => setBurst(0), 760)
    return () => window.clearTimeout(timeout)
  }, [burst])

  const handleLike = () => {
    const nextIsLiked = !isLiked
    setIsLiked(nextIsLiked)
    setRollDirection(nextIsLiked ? 1 : -1)
    setCount((value) => value + (nextIsLiked ? 1 : -1))
    if (nextIsLiked) setBurst((value) => value + 1)
    else setBurst(0)
  }

  return <button
    type="button"
    className="about-like-button"
    onClick={handleLike}
    aria-label={`${isLiked ? 'Unlike' : 'Like'}, ${count} likes`}
    aria-pressed={isLiked}
    style={{ '--like-corner': '9px', '--like-burst': `${LIKE_BURST}` }}
  >
    <span className="about-like-icon" aria-hidden="true">
      {!reduceMotion && burst > 0 && <span key={burst} className="about-like-burst">
        <motion.i
          className="about-like-ring"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 0.55, 0], scale: [0.2, 0.72, 1.1] }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        />
        {fireworkParticles.map((particle, index) => <motion.i
          key={index}
          className="about-like-particle"
          style={{ '--particle-color': particle.color }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.55 }}
          animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 1, 0], scale: [0.55, 1, 0.86, 0.3] }}
          transition={{ duration: 0.62, delay: particle.delay, ease: [0.22, 1, 0.36, 1] }}
        />)}
      </span>}
      <motion.svg
        className="about-like-heart"
        viewBox="0 0 24 24"
        fill={isLiked ? 'currentColor' : 'none'}
        aria-hidden="true"
        animate={reduceMotion ? undefined : { scale: burst > 0 ? [1, 1.32, 0.94, 1] : 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.3 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </span>
    <span className="about-like-count" aria-live="polite" aria-atomic="true">
      {String(count).split('').map((digit, index, digits) => <RollingDigit
        key={`place-${digits.length - index - 1}`}
        digit={digit}
        direction={rollDirection}
        reduceMotion={reduceMotion}
      />)}
    </span>
  </button>
}

const digitVariants = {
  enter: (direction) => ({ y: direction > 0 ? '100%' : '-100%' }),
  center: { y: '0%' },
  exit: (direction) => ({ y: direction > 0 ? '-100%' : '100%' }),
}

function RollingDigit({ digit, direction, reduceMotion }) {
  return <span className="about-like-digit" aria-hidden="true">
    <AnimatePresence initial={false} custom={direction} mode="sync">
      <motion.span
        key={digit}
        className="about-like-digit-value"
        custom={direction}
        variants={digitVariants}
        initial={reduceMotion ? false : 'enter'}
        animate="center"
        exit={reduceMotion ? undefined : 'exit'}
        transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
      >{digit}</motion.span>
    </AnimatePresence>
  </span>
}

function AvatarGroup() {
  return <div className="about-avatar-group" aria-label="Liked by community">
    {avatars.map(({ src, label }) => <img key={label} src={src} alt={label} title={label} loading="lazy" />)}
  </div>
}

export default function AboutSocialProof() {
  return <div className="about-social-proof">
    <LikeButton />
    <div className="about-community">
      <p className="about-community-copy">Liked by <strong>Patrick jane</strong>, <strong>Enami asa</strong>, and <strong>others</strong></p>
      <AvatarGroup />
    </div>
  </div>
}
