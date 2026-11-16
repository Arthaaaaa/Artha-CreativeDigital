import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { createAvatar } from '@bible-strong/avatar-react'
import { createAvatarIdleTimer } from './avatar-idle-timer.js'
import '@bible-strong/avatar-react/styles.css'
import definition from '../../avatar/unknown.avatar.json'

const Avatar = createAvatar(definition)
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const IDLE_DELAY = 60_000

export default function HeroAvatar({ anchorRef, excited = false }) {
  const stageRef = useRef(null)
  const avatarRef = useRef(null)
  const excitedRef = useRef(excited)
  const activityRef = useRef(null)
  excitedRef.current = excited

  useEffect(() => {
    const controller = avatarRef.current
    if (!controller) return undefined

    const activity = {
      idlePlaying: false,
      lastPointer: null,
    }
    const idleTimer = createAvatarIdleTimer({
      delay: IDLE_DELAY,
      isPaused: () => excitedRef.current,
      onIdle: () => { activity.idlePlaying = controller.play('idle').ok },
      now: () => performance.now(),
      setTimer: (callback, delay) => window.setTimeout(callback, delay),
      clearTimer: (timer) => window.clearTimeout(timer),
    })
    activity.scheduleIdle = idleTimer.schedule
    activity.cancelIdle = idleTimer.cancel
    activity.resetIdle = idleTimer.reset
    activityRef.current = activity

    const onPointerMove = (event) => {
      const point = { x: event.clientX, y: event.clientY }
      if (activity.lastPointer && Math.hypot(point.x - activity.lastPointer.x, point.y - activity.lastPointer.y) < 2) return
      activity.lastPointer = point
      if (activity.idlePlaying && !excitedRef.current) {
        controller.stop()
        activity.idlePlaying = false
      }
      activity.resetIdle()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    idleTimer.schedule()

    return () => {
      idleTimer.cancel()
      window.removeEventListener('pointermove', onPointerMove)
      if (controller.getState().status === 'playing') controller.stop()
      activityRef.current = null
    }
  }, [])

  useEffect(() => {
    const controller = avatarRef.current
    const activity = activityRef.current
    if (!controller || !activity) return

    if (excited) {
      activity.cancelIdle()
      activity.idlePlaying = false
      controller.play('excited')
    } else {
      if (controller.getState().activeAnimation === 'excited') controller.stop()
      activity.idlePlaying = false
      activity.scheduleIdle()
    }
  }, [excited])

  useLayoutEffect(() => {
    const stage = stageRef.current
    const anchor = anchorRef.current
    if (!stage || !anchor) return undefined

    const initialRect = anchor.getBoundingClientRect()
    let docked = initialRect.bottom <= 0 || initialRect.top >= window.innerHeight
    let positionFrame = 0
    let gazeFrame = 0
    let transitionTimer = 0
    let eyes = []
    let pointer = null
    let gaze = { x: 0, y: 0 }
    let target = { x: 0, y: 0 }
    let previousTime = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateGazeTarget = () => {
      if (reduceMotion.matches || !pointer) {
        target = { x: 0, y: 0 }
        return
      }
      const rect = stage.getBoundingClientRect()
      target = {
        x: clamp((pointer.x - (rect.left + rect.width / 2)) / (rect.width * 0.42), -1, 1) * 20,
        y: clamp((pointer.y - (rect.top + rect.height / 2)) / (rect.height * 0.42), -1, 1) * 16,
      }
    }

    const animateGaze = (time) => {
      gazeFrame = 0
      if (!eyes.length) return
      const elapsed = previousTime ? Math.min(48, time - previousTime) : 16
      previousTime = time
      const ease = 1 - Math.exp(-elapsed / 55)
      gaze.x += (target.x - gaze.x) * ease
      gaze.y += (target.y - gaze.y) * ease
      const moving = Math.abs(target.x - gaze.x) + Math.abs(target.y - gaze.y) > 0.02
      const transform = `translate(${gaze.x.toFixed(2)} ${gaze.y.toFixed(2)})`
      eyes.forEach((eye) => eye.setAttribute('transform', transform))
      if (moving) gazeFrame = requestAnimationFrame(animateGaze)
    }

    const queueGaze = () => {
      updateGazeTarget()
      if (!gazeFrame) gazeFrame = requestAnimationFrame(animateGaze)
    }

    const findEyes = () => {
      const eyeGroup = stage.querySelector('.bs-avatar__svg g[clip-path]')
      eyes = eyeGroup ? Array.from(eyeGroup.querySelectorAll(':scope > path')).slice(0, 2) : []
      if (eyes.length) queueGaze()
    }

    const updatePosition = () => {
      if (positionFrame) return
      positionFrame = requestAnimationFrame(() => {
        positionFrame = 0
        const rect = anchor.getBoundingClientRect()
        const nextDocked = rect.bottom <= 0 || rect.top >= window.innerHeight
        const dockingChanged = nextDocked !== docked
        docked = nextDocked
        const isMobile = window.innerWidth <= 768
        const size = docked
          ? (isMobile ? clamp(Math.round(window.innerWidth * 0.13), 44, 52) : Math.min(112, window.innerWidth * 0.2))
          : (isMobile ? 36 : 44)
        const margin = isMobile ? 20 : 28
        const left = docked
          ? window.innerWidth - size - margin
          : Math.min(rect.right + 8, window.innerWidth - size - 12)
        const top = docked ? window.innerHeight - size - margin : rect.top + (rect.height - size) / 2
        stage.dataset.docked = docked ? 'true' : 'false'

        if (dockingChanged) {
          stage.classList.add('is-transitioning')
          window.clearTimeout(transitionTimer)
          transitionTimer = window.setTimeout(() => stage.classList.remove('is-transitioning'), 620)
        }
        stage.style.left = `${left}px`
        stage.style.top = `${top}px`
        stage.style.width = `${size}px`
        stage.style.height = `${size}px`
        stage.style.visibility = 'visible'
        queueGaze()
      })
    }

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch' || reduceMotion.matches) {
        pointer = null
        queueGaze()
        return
      }
      pointer = { x: event.clientX, y: event.clientY }
      queueGaze()
    }
    const onPointerOut = (event) => {
      if (event.relatedTarget === null) {
        pointer = null
        queueGaze()
      }
    }
    const onBlur = () => {
      pointer = null
      queueGaze()
    }
    const onMotionPreferenceChange = () => {
      if (reduceMotion.matches) {
        pointer = null
        queueGaze()
      }
    }

    findEyes()
    updatePosition()
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut)
    window.addEventListener('blur', onBlur)
    reduceMotion.addEventListener('change', onMotionPreferenceChange)
    const onViewportChange = () => updatePosition()
    window.addEventListener('scroll', onViewportChange, { passive: true })
    window.addEventListener('resize', onViewportChange)

    return () => {
      cancelAnimationFrame(positionFrame)
      cancelAnimationFrame(gazeFrame)
      window.clearTimeout(transitionTimer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', onBlur)
      reduceMotion.removeEventListener('change', onMotionPreferenceChange)
      window.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', onViewportChange)
    }
  }, [anchorRef])

  return createPortal(
    <div ref={stageRef} className="hero-avatar-portal" aria-hidden="true">
      <Avatar ref={avatarRef} defaultExpression="neutral" size="100%" ariaLabel="Avatar Artha" />
    </div>,
    document.body,
  )
}
