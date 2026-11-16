import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconVolume,
  IconVolumeOff,
} from '@tabler/icons-react'
import storyOne from '../../video/Mograph-example-use free claude-1.mp4'
import storyTwo from '../../video/Mograph-example-use free claude-2.mp4'
import storyThree from '../../video/Mograph-example-use free claude-3.mp4'
import './stories-carousel.css'

const stories = [storyOne, storyTwo, storyThree]

const slideVariants = {
  enter: (direction) => ({
    x: `${direction * 106}%`,
    rotateY: direction * -90,
  }),
  center: { x: '0%', rotateY: 0 },
  exit: (direction) => ({
    x: `${direction * -106}%`,
    rotateY: direction * 90,
  }),
}

export default function StoriesCarousel() {
  const carouselRef = useRef(null)
  const videoRef = useRef(null)
  const touchStartX = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [metadataReady, setMetadataReady] = useState(false)
  const [frameReady, setFrameReady] = useState(false)
  const [videoError, setVideoError] = useState('')
  const [playbackBlocked, setPlaybackBlocked] = useState(false)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsNearViewport(entry.isIntersecting)
    }, { rootMargin: '360px 0px' })
    observer.observe(carousel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!isNearViewport || prefersReducedMotion || !metadataReady || videoError) {
      video.pause()
      return undefined
    }

    let cancelled = false
    video.play().catch(() => {
      if (!cancelled) setPlaybackBlocked(true)
    })

    return () => {
      cancelled = true
      video.pause()
    }
  }, [activeIndex, isNearViewport, metadataReady, prefersReducedMotion, videoError])

  const selectStory = (index, nextDirection) => {
    const nextIndex = (index + stories.length) % stories.length
    const video = videoRef.current

    if (video) {
      video.pause()
    }

    if (nextIndex === activeIndex) {
      if (video) {
        video.currentTime = 0
        if (isNearViewport && !prefersReducedMotion) {
          video.play().catch(() => setPlaybackBlocked(true))
        }
      }
      setProgress(0)
      return
    }

    setDirection(nextDirection ?? (nextIndex > activeIndex ? 1 : -1))
    setActiveIndex(nextIndex)
    setProgress(0)
    setMetadataReady(false)
    setFrameReady(false)
    setVideoError('')
    setPlaybackBlocked(false)
  }

  const move = (step) => selectStory(activeIndex + step, step)

  const updateProgress = (event) => {
    const video = event.currentTarget
    if (!Number.isFinite(video.duration) || video.duration <= 0 || video.paused) return
    setProgress(Math.min(1, video.currentTime / video.duration))
  }

  const handleMetadata = (event) => {
    const video = event.currentTarget
    const duration = video.duration
    setMetadataReady(true)
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setFrameReady(true)
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      setVideoError('Durasi video tidak tersedia. Gunakan panah untuk berpindah.')
    }
  }

  const handleLoadedData = (event) => {
    if (event.currentTarget.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setFrameReady(true)
      setMetadataReady(true)
    }
  }

  const toggleSound = () => {
    const video = videoRef.current
    const nextMuted = !isMuted
    setIsMuted(nextMuted)

    if (!video) return
    video.muted = nextMuted
    if (!nextMuted && isNearViewport && !prefersReducedMotion) {
      video.play().catch(() => setPlaybackBlocked(true))
    }
  }

  const handleKeyDown = (event) => {
    if (event.target instanceof HTMLVideoElement) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch' && !event.target.closest('button')) {
      touchStartX.current = event.clientX
    }
  }

  const handlePointerUp = (event) => {
    if (touchStartX.current === null) return
    const distance = event.clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) > 42) move(distance < 0 ? 1 : -1)
  }

  return <div
    ref={carouselRef}
    className="stories-carousel"
    role="region"
    aria-roledescription="carousel"
    aria-label="High-Retention Motion Graphic Series"
    tabIndex={0}
    onKeyDown={handleKeyDown}
    onPointerDown={handlePointerDown}
    onPointerUp={handlePointerUp}
    onPointerCancel={() => { touchStartX.current = null }}
  >
    <div className="stories-stage">
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          className="stories-card"
          key={activeIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 150, damping: 24 }}
        >
          {!frameReady && !videoError && <div className="stories-skeleton" aria-hidden="true" />}
          <video
            ref={videoRef}
            className={frameReady ? 'is-ready' : ''}
            src={`${stories[activeIndex]}#t=0.001`}
            autoPlay={!prefersReducedMotion && isNearViewport}
            muted={isMuted}
            playsInline
            preload="metadata"
            controls={Boolean(prefersReducedMotion || playbackBlocked)}
            aria-label={`Motion graphic ${activeIndex + 1} dari ${stories.length}`}
            onLoadedMetadata={handleMetadata}
            onLoadedData={handleLoadedData}
            onTimeUpdate={updateProgress}
            onPlay={() => {
              setPlaybackBlocked(false)
              setFrameReady(true)
            }}
            onEnded={() => {
              setProgress(1)
              if (!prefersReducedMotion) selectStory(activeIndex + 1, 1)
            }}
            onError={() => setVideoError('Video ini tidak dapat dimuat. Gunakan panah untuk berpindah.')}
          />
          {videoError && <span className="stories-status" role="status">{videoError}</span>}
          {prefersReducedMotion && <span className="stories-motion-note">Mode gerak terbatas: putar video dengan kontrol.</span>}
        </motion.div>
      </AnimatePresence>
    </div>

    <div className="stories-controls" role="group" aria-label="Navigasi video">
      <button className="stories-arrow" type="button" aria-label="Video sebelumnya" onClick={() => move(-1)}>
        <IconChevronLeft aria-hidden="true" />
      </button>
      <div className="stories-progress" role="group" aria-label="Progress video">
        {stories.map((_, index) => <button
          className="stories-progress-segment"
          type="button"
          key={index}
          aria-label={`Putar video ${index + 1} dari ${stories.length}`}
          aria-current={index === activeIndex ? 'step' : undefined}
          onClick={() => selectStory(index)}
        >
          <span style={{ transform: `scaleX(${index < activeIndex ? 1 : index === activeIndex ? progress : 0})` }} />
        </button>)}
      </div>
      <button className="stories-arrow" type="button" aria-label="Video berikutnya" onClick={() => move(1)}>
        <IconChevronRight aria-hidden="true" />
      </button>
    </div>

    <div className="stories-audio-row">
      <button
        className="stories-audio-button"
        type="button"
        aria-pressed={!isMuted}
        onClick={toggleSound}
      >
        {isMuted ? <IconVolumeOff aria-hidden="true" /> : <IconVolume aria-hidden="true" />}
        {isMuted ? 'Aktifkan suara' : 'Matikan suara'}
      </button>
      {playbackBlocked && <span className="stories-audio-hint" role="status">Tekan putar pada video untuk melanjutkan.</span>}
    </div>
  </div>
}
