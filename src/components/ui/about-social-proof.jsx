import './about-social-proof.css'

const techStack = [
  'Codex',
  'Google AI Studio',
  'Antigravity',
  'Web UI/UX',
  'AI Automation',
  'Motion Design',
]

export default function AboutSocialProof() {
  return <div className="about-tech-stack" aria-label="Tech & AI Stack">
    {techStack.map((item) => <span className="about-tech-pill" key={item}>{item}</span>)}
  </div>
}
