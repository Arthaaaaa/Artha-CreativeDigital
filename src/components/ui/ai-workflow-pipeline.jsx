import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './ai-workflow-pipeline.css'

// Adapted from ReactVibe Pipeline (MIT): https://reactvibe.com/docs/motion/pipeline
const endNodes = [
  { id: 0, title: 'Database', info: 'Database: 240 new records successfully committed' },
  { id: 1, title: 'Dashboard', info: 'Dashboard: Real-time analytics and metrics updated' },
  { id: 2, title: 'Email Service', info: 'Email Service: 12 summary reports dispatched to users' },
]

export default function AiWorkflowPipeline() {
  const [activeIndex, setActiveIndex] = useState(1)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return undefined
    const interval = setInterval(() => setActiveIndex((current) => (current + 1) % endNodes.length), 3000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const connectors = [
    'M 74 103 L 88 103',
    'M 179 103 L 207 103',
    'M 270 103 C 282 103 282 46 291 46',
    'M 270 103 L 291 103',
    'M 270 103 C 282 103 282 161 291 161',
  ]
  const particlePaths = [
    { path: 'M 42 103.5 L 133 103.5', delay: '0s' },
    { path: 'M 133 103.5 L 238 103.5', delay: '3s' },
    { path: 'M 238 103.5 L 270 103 C 282 103 282 46 291 46 L 318.5 46', delay: '6s' },
    { path: 'M 238 103.5 L 318.5 103.5', delay: '6s' },
    { path: 'M 238 103.5 L 270 103 C 282 103 282 161 291 161 L 318.5 161', delay: '6s' },
  ]
  const particles = prefersReducedMotion ? [] : particlePaths

  return <div className="ai-pipeline" role="group" aria-label="Alur otomatisasi kerja dengan AI">
    <div className="ai-pipeline-canvas">
      <svg className="ai-pipeline-connections" viewBox="0 0 350 207" fill="none" aria-hidden="true">
        <defs>
          <filter id="ai-pipeline-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
          </filter>
        </defs>
        <g className="ai-pipeline-track" strokeWidth="1.5" strokeDasharray="4 4">
          {connectors.map((path) => <path key={path} d={path} />)}
        </g>
        <g>
          {particles.map(({ path, delay }, index) => <PipelineParticle key={index} path={path} delay={delay} />)}
        </g>
      </svg>

      <PipelineStage className="ai-pipeline-input" label="Input" title="Data Sources" note="rest · graphql · streams" />
      <PipelineStage className="ai-pipeline-process" label="Processing" title="Transformation" note="clean · parse · validate" />
      <div className="ai-pipeline-stage ai-pipeline-route">
        <div className="ai-pipeline-stage-card ai-pipeline-routing-card">
          <span className="ai-pipeline-kicker">Routing</span>
          <span className="ai-pipeline-stage-title">Logic Engine</span>
          <span className="ai-pipeline-processing-dots" aria-hidden="true">
            {[0, 1, 2].map((index) => <motion.i key={index} animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }} />)}
          </span>
        </div>
        <span className="ai-pipeline-note">filter · map · dispatch</span>
      </div>

      {endNodes.map((node, index) => <div className={`ai-pipeline-output ai-pipeline-output-${index}`} key={node.id}>
        <div className={`ai-pipeline-output-card${activeIndex === index ? ' is-active' : ''}`}>
          <span>{node.title}</span>
          <motion.i animate={{ scale: activeIndex === index ? 1.25 : 1 }} transition={{ duration: 0.2 }} />
        </div>
      </div>)}
    </div>

    <div className="ai-pipeline-info" aria-live="polite">
      <span aria-hidden="true">›</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={activeIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >{endNodes[activeIndex].info}</motion.span>
      </AnimatePresence>
    </div>
  </div>
}

function PipelineStage({ className, label, title, note }) {
  return <div className={`ai-pipeline-stage ${className}`}>
    <div className="ai-pipeline-stage-card">
      <span className="ai-pipeline-kicker">{label}</span>
      <span className="ai-pipeline-stage-title">{title}</span>
    </div>
    <span className="ai-pipeline-note">{note}</span>
  </div>
}

function PipelineParticle({ path, delay }) {
  return <g>
    <circle cx="0" cy="0" r="6" className="ai-pipeline-particle-glow" opacity="0" filter="url(#ai-pipeline-glow)">
      <animateMotion dur="3s" begin={delay} repeatCount="indefinite" path={path} />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.01;0.98;0.99;1" dur="3s" begin={delay} repeatCount="indefinite" />
    </circle>
    <circle cx="0" cy="0" r="2.5" className="ai-pipeline-particle-core" opacity="0">
      <animateMotion dur="3s" begin={delay} repeatCount="indefinite" path={path} />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.01;0.98;0.99;1" dur="3s" begin={delay} repeatCount="indefinite" />
    </circle>
  </g>
}
