import { motion, useReducedMotion } from 'motion/react'

export function MenuToggleIcon({ open, duration = 500, strokeWidth = 2, className }) {
  const reduceMotion = useReducedMotion()
  const transition = {
    duration: reduceMotion ? 0 : duration / 1000,
    ease: [0.22, 1, 0.36, 1],
  }

  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="presentation"
      aria-hidden="true"
      initial={false}
    >
      <motion.path
        d={open ? 'M 6 18 L 18 6' : 'M 4 7 L 20 7'}
        animate={{ d: open ? 'M 6 18 L 18 6' : 'M 4 7 L 20 7' }}
        transition={transition}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <motion.path
        d="M 4 12 H 20"
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.4 : 1 }}
        transition={transition}
        style={{ transformOrigin: 'center' }}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <motion.path
        d={open ? 'M 6 6 L 18 18' : 'M 4 17 L 20 17'}
        animate={{ d: open ? 'M 6 6 L 18 18' : 'M 4 17 L 20 17' }}
        transition={transition}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </motion.svg>
  )
}
