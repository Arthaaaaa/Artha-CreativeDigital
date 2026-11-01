import assert from 'node:assert/strict'
import { createAvatarIdleTimer } from './avatar-idle-timer.js'

let now
let nextId
let timers

function setup(isPaused = () => false) {
  now = 0
  nextId = 0
  timers = new Map()
  let idleCount = 0
  const timer = createAvatarIdleTimer({
    delay: 60_000,
    isPaused,
    onIdle: () => { idleCount += 1 },
    now: () => now,
    setTimer: (callback, delay) => {
      const id = ++nextId
      timers.set(id, { callback, dueAt: now + delay })
      return id
    },
    clearTimer: (id) => timers.delete(id),
  })

  const advance = (ms) => {
    const end = now + ms
    while (true) {
      const next = [...timers.entries()].sort((a, b) => a[1].dueAt - b[1].dueAt)[0]
      if (!next || next[1].dueAt > end) break
      now = next[1].dueAt
      timers.delete(next[0])
      next[1].callback()
    }
    now = end
  }

  return { timer, advance, idleCount: () => idleCount }
}

const test = (name, run) => {
  run()
  console.log(`✓ ${name}`)
}

test('waits 60 seconds after the latest meaningful pointer movement', () => {
  const { timer, advance, idleCount } = setup()
  timer.schedule()
  advance(30_000)
  timer.reset()
  advance(59_999)
  assert.equal(idleCount(), 0)
  advance(1)
  assert.equal(idleCount(), 1)
  advance(120_000)
  assert.equal(idleCount(), 1)
})

test('does not play idle while excited and resumes the remaining quiet period after', () => {
  let excited = true
  const { timer, advance, idleCount } = setup(() => excited)
  timer.schedule()
  advance(45_000)
  timer.reset()
  advance(45_000)
  assert.equal(idleCount(), 0)
  excited = false
  timer.schedule()
  advance(14_999)
  assert.equal(idleCount(), 0)
  advance(1)
  assert.equal(idleCount(), 1)
})
