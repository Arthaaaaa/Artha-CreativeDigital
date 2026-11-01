import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import UseAnimations from 'react-useanimations'
import arrowUpRight from 'react-useanimations/lib/arrowUpRight'
import { contact, projects, whatsappMessage } from './data/site.js'
import HeroGradient from './HeroGradient.jsx'
import { Particles } from './Particles.tsx'
import { LayoutTextFlip } from './components/ui/layout-text-flip.jsx'
import GlassFolder from './components/ui/glass-folder-cards.tsx'
import SparkMark from './components/ui/spark-mark.jsx'
import TiltCard from './components/ui/tilt-card.jsx'
import AiWorkflowPipeline from './components/ui/ai-workflow-pipeline.jsx'
import StoriesCarousel from './components/ui/stories-carousel.jsx'
import ProfileCard from './components/ui/profile-card.jsx'
import FloatingDock from './components/ui/floating-dock.jsx'
import arthaProfilePhoto from './image/artha-profile-photo.png'
import AboutSocialProof from './components/ui/about-social-proof.jsx'
import rumaPreview from './video/ruma-preview.mp4'
import officePreview from './video/visual_office_orchestra-preview-compressed.mp4'
import websiteBuildVideo from './video/build-rumacofee-progress-compressed.mp4'
import motionGraphicsVideo from './video/Mograph-example-use free claude - Layanan section.mp4'
import { useScrollStory } from './useScrollStory.js'
import GreetingCurtain from './components/ui/greeting-curtain.jsx'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from './components/ui/resizable-navbar.jsx'

const navItems = [
  { label: 'Beranda', href: '#home', id: 'home' },
  { label: 'Karya', href: '#work', id: 'work' },
  { label: 'Layanan', href: '#services', id: 'services' },
  { label: 'Tentang', href: '#about', id: 'about' },
]

const roles = ['Developer', 'Designer', 'AI Automation Builder']
const HeroAvatar = lazy(() => import('./components/ui/hero-avatar.jsx'))

function Sparkle({ className = '' }) {
  const gradientId = `${useId().replaceAll(':', '')}-sparkle-fill`
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 2.5 29.5 18.5 45.5 24 29.5 29.5 24 45.5 18.5 29.5 2.5 24 18.5 18.5 24 2.5Z" fill={`url(#${gradientId})`} stroke="rgba(255,255,255,.9)" strokeWidth="1.2" /><defs><linearGradient id={gradientId} x1="11" y1="8" x2="37" y2="40"><stop stopColor="#fff" /><stop offset=".42" stopColor="#aab9d1" /><stop offset=".7" stopColor="#4269a8" /><stop offset="1" stopColor="#f5ffff" /></linearGradient></defs></svg>
}

function whatsappHref() {
  const number = contact.whatsappNumber.replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}` : ''
}

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const contactUrl = whatsappHref()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5] })
    navItems.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && setMenuOpen(false)
    const closeOnOutside = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest('.site-nav-resize')) setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutside)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutside)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const items = navItems.map(({ label, href }) => ({ name: label, link: href }))

  return <header className="site-header">
    <Navbar>
      <NavBody className={menuOpen ? 'is-open' : ''}>
        <NavbarLogo onClick={closeMenu}><SparkMark className="brand-mark" /><span>Artha</span></NavbarLogo>
        <NavItems items={items} activeLink={`#${active}`} onItemClick={closeMenu} />
        {contactUrl
          ? <NavbarButton href={contactUrl} target="_blank" rel="noreferrer">Diskusikan proyek</NavbarButton>
          : <NavbarButton href="#contact" onClick={closeMenu}>Diskusikan proyek</NavbarButton>}
      </NavBody>

      <MobileNav className={menuOpen ? 'is-open' : ''}>
        <MobileNavHeader>
          <NavbarLogo onClick={closeMenu}><SparkMark className="brand-mark" /><span>Artha</span></NavbarLogo>
          <MobileNavToggle isOpen={menuOpen} onClick={() => setMenuOpen((open) => !open)} />
        </MobileNavHeader>
        <MobileNavMenu id="primary-navigation-mobile" isOpen={menuOpen} onClose={closeMenu}>
          <NavItems items={items} activeLink={`#${active}`} onItemClick={closeMenu} className="nav-links-mobile" />
          {contactUrl
            ? <NavbarButton href={contactUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>Diskusikan proyek</NavbarButton>
            : <NavbarButton href="#contact" onClick={closeMenu}>Diskusikan proyek</NavbarButton>}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  </header>
}

function RoleLine() {
  return <div className="role-wrap">
    <LayoutTextFlip text="Seorang " words={roles} duration={3000} />
    <span className="sr-only">Seorang {roles.join(', ')}.</span>
  </div>
}

function HeroArtwork() {
  return <div className="hero-art"><Particles count={1400} dotSize={0.5} /></div>
}

function ButtonArrow() {
  return <svg className="button-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function ServiceMotionPreview() {
  const videoRef = useRef(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return () => video.pause()
    }

    const observer = new IntersectionObserver(([entry]) => setIsNearViewport(entry.isIntersecting), { rootMargin: '160px 0px' })
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!isNearViewport || prefersReducedMotion) {
      video.pause()
      return
    }
    video.play().catch(() => { })
  }, [isNearViewport, prefersReducedMotion])

  return <video ref={videoRef} className="service-motion-video" src={isNearViewport ? motionGraphicsVideo : undefined} muted loop playsInline preload="metadata" aria-hidden="true" />
}

function Hero() {
  const [workFolderOpen, setWorkFolderOpen] = useState(false)
  const [avatarExcited, setAvatarExcited] = useState(false)
  const identityBadgeRef = useRef(null)
  const playAvatarExcited = (event) => {
    if (event.pointerType !== 'touch' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAvatarExcited(true)
    }
  }
  const resetAvatarAnimation = (event) => {
    if (event.pointerType !== 'touch') setAvatarExcited(false)
  }

  return <section className="hero section-shell" id="home" aria-labelledby="hero-title">
    <HeroGradient />
    <div className="hero-copy">
      <p className="identity-badge" ref={identityBadgeRef}><Sparkle />Creative Developer</p>
      <h1 id="hero-title">Hai, aku Artha.</h1>
      <RoleLine />
      <p className="hero-support">Aku membantu bisnis lewat website, desain, dan otomatisasi kerja dengan AI.</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#contact" onPointerEnter={playAvatarExcited} onPointerLeave={resetAvatarAnimation}><span className="particle-field" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i className="floating-point" key={i} />)}</span><span>Diskusikan proyek</span></a>
        <a
          className="button button-secondary"
          href="#work"
          onPointerEnter={(event) => event.pointerType !== 'touch' && setWorkFolderOpen(true)}
          onPointerLeave={(event) => event.pointerType !== 'touch' && setWorkFolderOpen(false)}
          onFocus={() => setWorkFolderOpen(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setWorkFolderOpen(false)
          }}
        >
          <span>Lihat karya</span>
          <span className="hero-work-folder" aria-hidden="true" inert>
            <GlassFolder
              label=""
              meta=""
              tone="dark"
              art="none"
              action="none"
              open={workFolderOpen}
              width={28}
              files={[{ name: 'Karya' }, { name: 'Eksperimen' }, { name: 'Desain' }]}
            />
          </span>
        </a>
      </div>
    </div>
    <HeroArtwork />
    <Suspense fallback={null}>
      <HeroAvatar anchorRef={identityBadgeRef} excited={avatarExcited} />
    </Suspense>
  </section>
}

function SectionHeading({ eyebrow, title, description }) {
  return <div className="section-heading">
    {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {description && <p className="section-intro">{description}</p>}
  </div>
}

function ProjectPreviewVideo({ src, label }) {
  const previewRef = useRef(null)
  const videoRef = useRef(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [hasFrame, setHasFrame] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [playbackFailed, setPlaybackFailed] = useState(false)

  useEffect(() => {
    const preview = previewRef.current
    if (!preview) return undefined

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return () => videoRef.current?.pause()
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsNearViewport(entry.isIntersecting)
    }, { rootMargin: '180px 0px' })
    observer.observe(preview)

    return () => {
      observer.disconnect()
      videoRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!isNearViewport) {
      video.pause()
      return
    }

    video.play().catch(() => setPlaybackFailed(true))
  }, [isNearViewport, hasFrame])

  const showFallback = loadFailed || (playbackFailed && !hasFrame)

  return <div className="project-preview" ref={previewRef} role="group" aria-label={`Pratinjau video ${label}`}>
    <div className="preview-glow" />
    {!hasFrame && !showFallback && <div className="project-preview-skeleton" aria-hidden="true" />}
    {showFallback && <p className="project-preview-fallback" role="status">Pratinjau video belum dapat ditampilkan.</p>}
    <video
      ref={videoRef}
      className={`project-preview-video${hasFrame ? ' is-ready' : ''}`}
      src={isNearViewport ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onLoadedData={(event) => {
        if (event.currentTarget.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          setHasFrame(true)
          setPlaybackFailed(false)
        }
      }}
      onError={() => setLoadFailed(true)}
    />
  </div>
}

function ProjectAuraLink({ href, children }) {
  const trackPointer = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--aura-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--aura-y', `${event.clientY - bounds.top}px`)
  }

  return <a className="project-aura-link" href={href} target="_blank" rel="noreferrer" onPointerMove={trackPointer}>
    <span className="project-aura-glow" aria-hidden="true" />
    <span className="project-aura-default-border" aria-hidden="true" />
    <span className="project-aura-content">{children}<UseAnimations animation={arrowUpRight} size={32} strokeColor="#ffffff" className="project-aura-arrow" aria-hidden="true" /></span>
  </a>
}

function WorkSection() {
  const ruma = projects[0]
  const office = projects[1]
  const aiAutomation = projects[2]
  return <section className="work-section section-space" id="work" aria-labelledby="work-title">
    <div className="section-inner">
      <SectionHeading eyebrow="Karya pilihan" title="Proyek yang pernah dan sedang aku kerjakan." description="Mulai dari website dan eksperimen AI hingga karya visual yang aku kembangkan." />
      <div className="featured-project">
        <TiltCard className="project-preview-tilt">
          <ProjectPreviewVideo src={rumaPreview} label="Ruma Coffee Website" />
        </TiltCard>
        <div className="project-info">
          <div className="project-labels"><span className="project-status">Live</span><span className="project-origin">Proyek pribadi</span></div>
          <p className="project-type">Website</p>
          <h3>{ruma.title}</h3>
          <p className="project-note">Website Ruma Coffee beserta demo dashboard-nya.</p>
          <div className="project-links">
            <ProjectAuraLink href={ruma.projectUrl}>Kunjungi website Ruma</ProjectAuraLink>
            <ProjectAuraLink href="https://arthaaaaa.github.io/ruma-coffee/projects/ruma-coffee/admin-demo/">Kunjungi dashboard Ruma (demo)</ProjectAuraLink>
          </div>
        </div>
      </div>
      <div className="featured-project featured-project-office">
        <div className="project-info">
          <div className="project-labels"><span className="project-status">Live</span><span className="project-origin">Proyek pribadi</span></div>
          <p className="project-type">{office.type}</p>
          <h3>{office.title}</h3>
          <p className="project-note">Eksperimen dashboard untuk otomasi kerja dengan AI.</p>
          <ProjectAuraLink href={office.projectUrl}>Kunjungi Office</ProjectAuraLink>
        </div>
        <TiltCard className="project-preview-tilt">
          <ProjectPreviewVideo src={officePreview} label="Visual Office Orchestra Dashboard" />
        </TiltCard>
      </div>
      <div className="featured-project stories-project">
        <div className="project-info">
          <div className="project-labels"><span className="project-status">Live</span><span className="project-origin">Proyek pribadi</span></div>
          <p className="project-type">{aiAutomation.title}</p>
          <h3>{aiAutomation.subtitle}</h3>
          <p className="project-note">{aiAutomation.description}</p>
        </div>
        <StoriesCarousel />
      </div>
      <div className="work-placeholder"><span className="work-placeholder-star"><Sparkle /></span><p>Karya lainnya akan ditampilkan setelah pratinjau siap.</p></div>
    </div>
  </section>
}

const services = [
  { id: 'website', title: 'Pembuatan website', description: 'Website yang membantu bisnis menjelaskan layanan dan hadir lebih profesional secara online.', visual: 'browser' },
  { id: 'design', title: 'Desain grafis', description: 'Visual untuk brand, produk, marketplace, dan kebutuhan konten digital.', visual: 'poster' },
  { id: 'ai', title: 'Otomatisasi kerja dengan AI', description: 'Membantu pekerjaan berulang berjalan lebih praktis dengan bantuan AI, sesuai kebutuhan bisnis.', visual: 'workflow' },
  { id: 'motion', title: 'Motion Graphics', description: 'Mengubah ide dan cerita menjadi pengalaman visual yang dinamis melalui motion design, storytelling, dan eksplorasi AI.', visual: 'motion' },
]

function ServicesSection() {
  const renderService = (service) => <div className={`service-reveal-shell service-reveal-shell-${service.id}`} key={service.id}>
    <TiltCard as="article" className={`service-card service-${service.id}`}>
      <div className={`service-visual visual-${service.visual}`}>
        {service.visual === 'browser' && <video className="service-build-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={websiteBuildVideo} type="video/mp4" /></video>}
        {service.visual === 'poster' && <div className="poster-visual"><span>ART</span><i /></div>}
        {service.visual === 'workflow' && <AiWorkflowPipeline />}
        {service.visual === 'motion' && <ServiceMotionPreview />}
      </div>
      <div className="service-copy"><h3>{service.title}</h3><p>{service.description}</p><a href={service.id === 'motion' ? '#work' : '#contact'} className="service-link">{service.id === 'motion' ? 'Lihat eksplorasi' : 'Diskusikan kebutuhan'} <ButtonArrow /></a></div>
    </TiltCard>
  </div>

  return <section className="services-section section-space" id="services" aria-labelledby="services-title">
    <div className="section-inner">
      <SectionHeading eyebrow="Layanan" title="Apa yang bisa kita bangun?" />
      <div className="service-grid">
        <div className="service-column service-column-left">
          {services.filter((service) => service.id === 'website' || service.id === 'motion').map(renderService)}
        </div>
        <div className="service-column service-column-right">
          {services.filter((service) => service.id === 'design' || service.id === 'ai').map(renderService)}
        </div>
      </div>
    </div>
  </section>
}

function AboutSection() {
  return <section className="about-section section-space" id="about" aria-labelledby="about-title">
    <div className="section-inner about-layout">
      <div className="about-art">
        <span className="about-word about-art-word" aria-hidden="true">A<br />R<br />T<br />H<br />A</span>
        <ProfileCard avatarUrl={arthaProfilePhoto} avatarAlt="Foto Artha" name="Artha" title="Creative Developer" handle="" status="Online" contactText="Contact Me" showUserInfo theme="dark" radius={16} holo={0.42} glare={0.34} enableTilt tiltStrength={7} parallax={5} enableMobileTilt={false} intro onContactClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="about-profile-card" />
        <AboutSocialProof />
      </div>
      <div className="about-copy">
        <p className="section-eyebrow">ABOUT ME</p>
        <h2 id="about-title">INTRO</h2>
        <p className="about-description">Hai, aku Artha, seorang Creative Developer yang menggabungkan desain, teknologi, dan AI untuk menciptakan pengalaman digital yang menarik sekaligus fungsional.</p>
        <p className="about-description">Aku berfokus pada pengembangan website, desain grafis, dan AI workflow automation. Aku senang mengeksplorasi ide, bereksperimen dengan pendekatan baru, dan mengubah konsep menjadi karya digital yang memiliki karakter visual serta tujuan yang jelas.</p>
        <p className="about-description">Saat ini, aku terbuka untuk proyek freelance dan kolaborasi yang memungkinkan ide-ide baru berkembang menjadi sesuatu yang nyata.</p>
      </div>
    </div>
  </section>
}

function ContactSection() {
  const link = whatsappHref()
  return <section className="contact-section section-space" id="contact" aria-labelledby="contact-title">
    <div className="section-inner">
      <div className="contact-panel">
        <span className="contact-light-sweep" aria-hidden="true" />
        <Sparkle className="contact-sparkle" />
        <p className="section-eyebrow">Mari mulai dari kebutuhanmu</p>
        <h2 id="contact-title">Punya proyek yang ingin dibangun?</h2>
        <p className="contact-description">Ceritakan kebutuhanmu. Kita mulai dari tujuan dan solusi yang paling masuk akal.</p>
        <p className="consultation-note">Konsultasi awal gratis.</p>
        {link ? <a className="button button-primary contact-button" href={link} target="_blank" rel="noreferrer">Mulai diskusi di WhatsApp <ButtonArrow /></a> : <div className="contact-pending"><button className="button button-primary contact-button" type="button" disabled>Mulai diskusi di WhatsApp <ButtonArrow /></button><p>Placeholder: tautan WhatsApp menunggu nomor terverifikasi.</p></div>}
      </div>
    </div>
  </section>
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-main section-inner"><a href="#home" className="brand footer-brand"><SparkMark className="brand-mark" /><span>Artha</span></a><nav aria-label="Navigasi footer"><a href="#work">Karya</a><a href="#services">Layanan</a><a href="#about">Tentang</a><a href="#contact">Diskusikan proyek</a></nav><a className="back-top" href="#home">Kembali ke atas <span aria-hidden="true">↑</span></a></div>
    <div className="footer-signature section-inner" aria-hidden="true">ARTHA</div>
    <p className="copyright">© {new Date().getFullYear()} Artha</p>
  </footer>
}

export default function App() {
  const pageRef = useRef(null)
  useScrollStory(pageRef)

  return <div ref={pageRef}>
    <GreetingCurtain />
    <a className="skip-link" href="#main-content">Lewati ke konten</a>
    <Nav />
    <main id="main-content">
      <Hero />
      <WorkSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </main>
    <FloatingDock />
    <Footer />
  </div>
}
