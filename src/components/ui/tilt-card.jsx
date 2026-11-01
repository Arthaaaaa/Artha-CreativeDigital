import { useCallback, useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

const TILT_DEGREES = 6
const HOVER_SCALE = 1.015
const SPRING = { stiffness: 180, damping: 24, mass: 0.7 }

export default function TiltCard({ as = 'div', className, children, ...props }) {
  const prefersReducedMotion = useReducedMotion()
  const rotateXTarget = useMotionValue(0)
  const rotateYTarget = useMotionValue(0)
  const scaleTarget = useMotionValue(1)
  const liftTarget = useMotionValue(0)
  const rotateX = useSpring(rotateXTarget, SPRING)
  const rotateY = useSpring(rotateYTarget, SPRING)
  const scale = useSpring(scaleTarget, SPRING)
  const lift = useSpring(liftTarget, SPRING)
  const Tag = as === 'article' ? motion.article : motion.div

  const reset = useCallback(() => {
    rotateXTarget.set(0)
    rotateYTarget.set(0)
    scaleTarget.set(1)
    liftTarget.set(0)
  }, [liftTarget, rotateXTarget, rotateYTarget, scaleTarget])

  const trackPointer = useCallback((event) => {
    if (prefersReducedMotion || event.pointerType !== 'mouse') return

    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return

    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
    rotateXTarget.set(-y * TILT_DEGREES)
    rotateYTarget.set(x * TILT_DEGREES)
    scaleTarget.set(HOVER_SCALE)
    liftTarget.set(-3)
  }, [liftTarget, prefersReducedMotion, rotateXTarget, rotateYTarget, scaleTarget])

  useEffect(() => {
    if (prefersReducedMotion) reset()
  }, [prefersReducedMotion, reset])

  return <Tag
    {...props}
    className={className}
    onPointerEnter={trackPointer}
    onPointerMove={trackPointer}
    onPointerLeave={reset}
    onPointerCancel={reset}
    style={{
      ...props.style,
      transformPerspective: 1050,
      transformStyle: 'preserve-3d',
      rotateX,
      rotateY,
      scale,
      y: lift,
    }}
  >{children}</Tag>
}
