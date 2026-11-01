export function createAvatarIdleTimer({ delay, isPaused, onIdle, now, setTimer, clearTimer }) {
  let timer = 0
  let lastActivityAt = now()

  const schedule = () => {
    clearTimer(timer)
    if (isPaused()) return
    timer = setTimer(() => {
      timer = 0
      if (isPaused()) return
      const remaining = delay - (now() - lastActivityAt)
      if (remaining <= 0) onIdle()
      else schedule()
    }, Math.max(0, delay - (now() - lastActivityAt)))
  }

  return {
    schedule,
    reset: () => {
      lastActivityAt = now()
      schedule()
    },
    cancel: () => {
      clearTimer(timer)
      timer = 0
    },
  }
}
