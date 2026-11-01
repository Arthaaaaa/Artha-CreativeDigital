import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import './greeting-curtain.css'

const SESSION_KEY = 'artha-greeting-curtain-seen'
const GREETINGS = ['Halo', 'Hello', 'Bonjour', 'Hola', 'Ciao', 'こんにちは', '안녕하세요', 'नमस्ते']

function shouldPlayIntro() {
  if (typeof window === 'undefined') return false

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false

  try {
    return window.sessionStorage.getItem(SESSION_KEY) !== 'seen'
  } catch {
    return true
  }
}

export default function GreetingCurtain() {
  const [visible, setVisible] = useState(shouldPlayIntro)

  useLayoutEffect(() => {
    if (!visible) return undefined

    const curtain = document.querySelector('.greeting-curtain')
    const greeting = curtain?.querySelector('.greeting-curtain__word')
    const appRoot = document.getElementById('root')
    if (!curtain || !greeting) {
      setVisible(false)
      return undefined
    }

    const htmlOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    const wasRootInert = appRoot?.inert ?? false
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    if (appRoot) appRoot.inert = true

    let timeline
    const context = gsap.context(() => {
      timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          try {
            window.sessionStorage.setItem(SESSION_KEY, 'seen')
          } catch {
            // Storage can be unavailable in private or restricted contexts.
          }
          setVisible(false)
        },
      })

      timeline.fromTo(greeting,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.16 },
        0,
      )

      GREETINGS.slice(1).forEach((word, index) => {
        const at = (index + 1) * 0.25
        timeline.to(greeting, { autoAlpha: 0, y: -10, duration: 0.08, ease: 'power2.in' }, at - 0.08)
        timeline.call(() => { greeting.textContent = word }, [], at)
        timeline.fromTo(greeting,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' },
          at,
        )
      })

      timeline.to(greeting, { autoAlpha: 0, y: -10, duration: 0.08, ease: 'power2.in' }, 2)
      timeline.to(curtain, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, 2.08)
    }, curtain)

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finishForReducedMotion = (event) => {
      if (event.matches) timeline?.progress(1)
    }
    motionPreference.addEventListener?.('change', finishForReducedMotion)

    return () => {
      motionPreference.removeEventListener?.('change', finishForReducedMotion)
      context.revert()
      document.documentElement.style.overflow = htmlOverflow
      document.body.style.overflow = bodyOverflow
      if (appRoot) appRoot.inert = wasRootInert
    }
  }, [visible])

  if (!visible || typeof document === 'undefined') return null

  return createPortal(
    <div className="greeting-curtain" aria-hidden="true">
      <span className="greeting-curtain__word">Halo</span>
    </div>,
    document.body,
  )
}
