import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const cn = (...values) => values.filter(Boolean).join(' ')

export function LayoutTextFlip({
  text = 'Build Amazing',
  words = ['Landing Pages', 'Component Blocks', 'Page Sections', '3D Shaders'],
  duration = 3000,
  textClassName,
  wordClassName,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (words.length < 2) return undefined

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % words.length)
    }, duration)

    return () => window.clearInterval(interval)
  }, [duration, words.length])

  if (!words.length) return text

  return <>
    <motion.span layoutId="artha-role-prefix" className={cn('role-prefix', textClassName)} aria-hidden="true">
      {text}
    </motion.span>
    <motion.span layout className="role-flip-layout" aria-hidden="true">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentIndex}
          initial={{ y: 0, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: 0, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5 }}
          className={cn('role-line role-flip-word', wordClassName)}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  </>
}
