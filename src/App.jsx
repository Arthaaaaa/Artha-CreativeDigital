import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import UseAnimations from 'react-useanimations'
import arrowUpRight from 'react-useanimations/lib/arrowUpRight'
import {
  caseStudyCards,
  contact,
  freeTemplateUrl,
  projects,
  whatsappMessage,
  whatsappSessionMessage,
} from './data/site.js'
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
  { label: 'Cara Kerja', href: '#workflow', id: 'workflow' },
  { label: 'Template & Sesi', href: '#resources', id: 'resources' },
  { label: 'Tentang', href: '#about', id: 'about' },
]

const roles = ['Developer', 'Designer', 'AI Automation Builder']
const HeroAvatar = lazy(() => import('./components/ui/hero-avatar.jsx'))

function Sparkle({ className = '' }) {
  const gradientId = `${useId().replaceAll(':', '')}-sparkle-fill`
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 2.5 29.5 18.5 45.5 24 29.5 29.5 24 45.5 18.5 29.5 2.5 24 18.5 18.5 24 2.5Z" fill={`url(#${gradientId})`} stroke="rgba(255,255,255,.9)" strokeWidth="1.2" /><defs><linearGradient id={gradientId} x1="11" y1="8" x2="37" y2="40"><stop stopColor="#fff" /><stop offset=".42" stopColor="#aab9d1" /><stop offset=".7" stopColor="#4269a8" /><stop offset="1" stopColor="#f5ffff" /></linearGradient></defs></svg>
}

function whatsappHref(customMessage = whatsappMessage) {
  const number = contact.whatsappNumber.replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(customMessage)}` : ''
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
          ? <NavbarButton href={contactUrl} target="_blank" rel="noreferrer">Diskusikan Proyek</NavbarButton>
          : <NavbarButton href="#contact" onClick={closeMenu}>Diskusikan Proyek</NavbarButton>}
      </NavBody>

      <MobileNav className={menuOpen ? 'is-open' : ''}>
        <MobileNavHeader>
          <NavbarLogo onClick={closeMenu}><SparkMark className="brand-mark" /><span>Artha</span></NavbarLogo>
          <MobileNavToggle isOpen={menuOpen} onClick={() => setMenuOpen((open) => !open)} />
        </MobileNavHeader>
        <MobileNavMenu id="primary-navigation-mobile" isOpen={menuOpen} onClose={closeMenu}>
          <NavItems items={items} activeLink={`#${active}`} onItemClick={closeMenu} className="nav-links-mobile" />
          {contactUrl
            ? <NavbarButton href={contactUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>Diskusikan Proyek</NavbarButton>
            : <NavbarButton href="#contact" onClick={closeMenu}>Diskusikan Proyek</NavbarButton>}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  </header>
}

function RoleLine() {
  return <p className="role-wrap">
    <LayoutTextFlip text="Menggabungkan peran seorang " words={roles} duration={3000} />
    <span className="role-suffix" aria-hidden="true">{' '}untuk mengubah ide menjadi sistem digital yang fungsional.</span>
    <span className="sr-only">Menggabungkan peran seorang {roles.join(', ')} untuk mengubah ide menjadi sistem digital yang fungsional.</span>
  </p>
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
      <p className="identity-badge" ref={identityBadgeRef}><Sparkle /><span>Hai, aku Artha — Creative Developer</span></p>
      <h1 id="hero-title">Bangun Website Berkarakter &amp; Otomasi Kerja Bisnis dengan AI.</h1>
      <RoleLine />
      <p className="hero-support">Membantu pemilik bisnis, UMKM, dan tim hadir lebih profesional lewat website yang dirancang khusus (bukan sekadar template pasaran) serta memangkas pekerjaan manual berulang menggunakan alur kerja AI.</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#contact" onPointerEnter={playAvatarExcited} onPointerLeave={resetAvatarAnimation}><span className="particle-field" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i className="floating-point" key={i} />)}</span><span>Diskusikan Proyek</span></a>
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
          <span>Lihat Karya ↗</span>
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
        <a className="button button-tertiary" href="#resources">
          <span>Ambil Template Gratis</span>
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
    }, { rootMargin: '280px 0px' })
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
      preload="metadata"
      aria-hidden="true"
      onLoadedMetadata={(event) => {
        if (event.currentTarget.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          setHasFrame(true)
          setPlaybackFailed(false)
        }
      }}
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
      <SectionHeading
        eyebrow="KARYA PILIHAN"
        title="Proyek dan sistem yang pernah aku bangun."
        description="Mulai dari pengembangan website bisnis, sistem otomasi operasional dengan AI, hingga produksi visual berdaya retensi tinggi."
      />
      <div className="case-study-grid">
        {caseStudyCards.map((card) => <div className="case-study-reveal-shell" key={card.id}>
          <TiltCard as="article" className={`case-study-card case-study-card-${card.id}`}>
            <div className="case-study-card-top">
              <div className="project-labels case-study-labels">
                <span className="project-status">Live</span>
                <span className="project-origin case-study-badge">{card.badge}</span>
              </div>
              <h3>{card.title}</h3>
              <p className="case-study-description">{card.description}</p>
            </div>
            <div className="case-study-actions">
              <a
                className="button button-primary case-study-btn-primary"
                href={card.primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{card.primaryLabel}</span>
              </a>
              <a
                className="button button-secondary case-study-btn-secondary"
                href={card.secondaryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{card.secondaryLabel}</span>
              </a>
            </div>
          </TiltCard>
        </div>)}
      </div>
      <div className="featured-project">
        <TiltCard className="project-preview-tilt">
          <ProjectPreviewVideo src={rumaPreview} label={ruma.title} />
        </TiltCard>
        <div className="project-info">
          <div className="project-labels">
            <span className="project-status">{ruma.status}</span>
            <span className="project-origin">{ruma.badge}</span>
          </div>
          <p className="project-type">{ruma.type}</p>
          <h3>{ruma.title}</h3>
          <p className="project-note">{ruma.description}</p>
          <div className="project-links">
            <ProjectAuraLink href={ruma.projectUrl}>Kunjungi website Ruma</ProjectAuraLink>
            <ProjectAuraLink href={ruma.demoUrl}>Kunjungi dashboard Ruma (demo)</ProjectAuraLink>
          </div>
        </div>
      </div>
      <div className="featured-project featured-project-office">
        <div className="project-info">
          <div className="project-labels">
            <span className="project-status">{office.status}</span>
            <span className="project-origin">{office.badge}</span>
          </div>
          <p className="project-type">{office.type}</p>
          <h3>{office.title}</h3>
          <p className="project-note">{office.description}</p>
          <ProjectAuraLink href={office.projectUrl}>Kunjungi Office</ProjectAuraLink>
        </div>
        <TiltCard className="project-preview-tilt">
          <ProjectPreviewVideo src={officePreview} label={office.title} />
        </TiltCard>
      </div>
      <div className="featured-project stories-project">
        <div className="project-info">
          <div className="project-labels">
            <span className="project-status">{aiAutomation.status}</span>
            <span className="project-origin">{aiAutomation.badge}</span>
          </div>
          <p className="project-type">{aiAutomation.title}</p>
          <h3>{aiAutomation.subtitle}</h3>
          <p className="project-note">{aiAutomation.description}</p>
        </div>
        <StoriesCarousel />
      </div>
      <div className="work-placeholder"><span className="work-placeholder-star"><Sparkle /></span><p>Eksperimen dan studi kasus terbaru juga didokumentasikan secara rutin di TikTok &amp; Instagram.</p></div>
    </div>
  </section>
}

const services = [
  {
    id: 'website',
    title: 'Pembuatan Website Berkarakter',
    description: 'Website profil bisnis, landing page konversi tinggi, dan web aplikasi yang cepat, responsif di HP, serta punya identitas visual kuat—jauh dari kesan template AI pasaran.',
    features: [
      <>Desain kustom berbasis sistem (<code>DESIGN.md</code>), bukan template pasaran</>,
      'Tampilan responsif & nyaman diakses lewat layar HP',
      'Performa loading cepat & struktur halaman terarah',
      'Siap diintegrasikan dengan dashboard atau alur kontak bisnis',
    ],
    ctaLabel: 'Diskusikan kebutuhan website',
    visual: 'browser',
  },
  {
    id: 'ai',
    title: 'Otomatisasi Operasional dengan AI',
    description: 'Pangkas waktu kerja tim dari tugas-tugas berulang (rekap data, laporan, pengelolaan dokumen, hingga integrasi sistem) menggunakan workflow otomasi dan AI yang berjalan otomatis.',
    ctaLabel: 'Diskusikan otomasi kerja',
    visual: 'workflow',
  },
  {
    id: 'motion',
    title: 'Short-Form Motion Graphics',
    description: 'Mengubah penjelasan produk teknologi, SaaS, atau edukasi yang rumit menjadi video vertikal pendek yang dinamis, mudah dipahami, dan menahan perhatian penonton dari detik pertama.',
    ctaLabel: 'Diskusikan produksi visual',
    visual: 'motion',
  },
]

function ServicesSection() {
  const renderService = (service) => <div className={`service-reveal-shell service-reveal-shell-${service.id}`} key={service.id}>
    <TiltCard as="article" className={`service-card service-${service.id}`}>
      <div className={`service-visual visual-${service.visual}`}>
        {service.visual === 'browser' && <div className="service-video-frame"><video className="service-build-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={websiteBuildVideo} type="video/mp4" /></video></div>}
        {service.visual === 'workflow' && <AiWorkflowPipeline />}
        {service.visual === 'motion' && <ServiceMotionPreview />}
      </div>
      <div className="service-copy">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        {service.features && <ul className="service-features">
          {service.features.map((feature, index) => <li key={index}>
            <span className="service-feature-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.2 6.6 11.3 12.5 4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span>{feature}</span>
          </li>)}
        </ul>}
        <a href="#contact" className="service-link">{service.ctaLabel} <ButtonArrow /></a>
      </div>
    </TiltCard>
  </div>

  return <section className="services-section section-space" id="services" aria-labelledby="services-title">
    <div className="section-inner">
      <SectionHeading eyebrow="LAYANAN" title="Apa yang bisa kita bangun bersama?" />
      <div className="service-grid">
        <div className="service-column service-column-left">
          {services.filter((service) => service.id === 'website').map(renderService)}
        </div>
        <div className="service-column service-column-right">
          {services.filter((service) => service.id === 'ai' || service.id === 'motion').map(renderService)}
        </div>
      </div>
    </div>
  </section>
}

const workflowSteps = [
  {
    step: 'Langkah 01',
    title: 'Audit & Design Brief',
    description: <>Kita mulai dengan memetakan tujuan bisnis, target audiens, dan aturan desain (<code>DESIGN.md</code>) agar solusi yang dibangun tepat sasaran sejak hari pertama.</>,
  },
  {
    step: 'Langkah 02',
    title: 'AI-Accelerated Build',
    description: 'Proses penulisan kode, penyusunan komponen, dan perakitan alur otomasi dipercepat menggunakan ekosistem AI modern sehingga pengerjaan jauh lebih efisien.',
  },
  {
    step: 'Langkah 03',
    title: 'Human Polish & Uji Coba',
    description: 'Penyempurnaan manual pada tata letak, micro-interaction, kontras visual, hingga kenyamanan tampilan di layar HP sebelum proyek diluncurkan.',
  },
]

function WorkflowSection() {
  return <section className="workflow-section section-space" id="workflow" aria-labelledby="workflow-title">
    <div className="section-inner">
      <SectionHeading
        eyebrow="CARA KERJA"
        title="Cepat karena AI, presisi karena kendali manusia."
        description="AI mempercepat pembuatan fondasi dari nol, tapi arah bisnis dan detail kualitas tetap dikerjakan secara terukur."
      />
      <div className="workflow-grid">
        {workflowSteps.map((item) => <div className="workflow-reveal-shell" key={item.step}>
          <TiltCard as="article" className="workflow-card">
            <span className="workflow-step-badge">{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </TiltCard>
        </div>)}
      </div>
    </div>
  </section>
}

function ResourcesSection() {
  const sessionUrl = whatsappHref(whatsappSessionMessage)

  return <section className="resources-section section-space" id="resources" aria-labelledby="resources-title">
    <div className="section-inner">
      <SectionHeading
        eyebrow="UNTUK KREATOR & PEMULA"
        title="Mau ngulik sendiri? Mulai dari sini."
      />
      <div className="resources-grid">
        <div className="resource-reveal-shell">
          <TiltCard as="article" className="resource-card resource-card-free">
            <div className="resource-card-top">
              <span className="resource-badge resource-badge-free">Gratis</span>
              <h3>Template Sistem AI (<code>skill.md</code> &amp; Design Brief)</h3>
              <p>Ambil kumpulan file konfigurasi instruksi AI dan panduan kerangka desain yang aku gunakan di eksperimen konten TikTok &amp; Instagram agar hasil prompt kamu lebih rapi dan konsisten.</p>
            </div>
            <div className="resource-card-footer">
              <a
                className="button button-secondary resource-cta"
                href={freeTemplateUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>Ambil Template Gratis ↗</span>
              </a>
            </div>
          </TiltCard>
        </div>

        <div className="resource-reveal-shell">
          <TiltCard as="article" className="resource-card resource-card-session">
            <div className="resource-card-top">
              <span className="resource-badge resource-badge-limited">Slot Terbatas</span>
              <h3>1-on-1 Guided Session (Bimbingan Privat)</h3>
              <p>Sesi pendampingan langsung via Zoom/Google Meet (60–90 menit) untuk bantu kamu merakit website pertama atau menyusun workflow AI dari nol tanpa buang waktu berjam-jam di tahap revisi.</p>
            </div>
            <div className="resource-card-footer">
              <a
                className="button button-primary resource-cta"
                href={sessionUrl || '#contact'}
                target={sessionUrl ? '_blank' : undefined}
                rel={sessionUrl ? 'noreferrer' : undefined}
              >
                <span>Tanya Jadwal Sesi Bimbingan</span>
                <ButtonArrow />
              </a>
            </div>
          </TiltCard>
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
        <p className="section-eyebrow">TENTANG AKU</p>
        <h2 id="about-title">INTRO</h2>
        <p className="about-description">Hai, aku Artha, seorang Creative Developer yang menggabungkan desain antarmuka, rekayasa web, dan kecerdasan buatan (AI) untuk membangun produk digital yang berkarakter sekaligus fungsional.</p>
        <p className="about-description">Lewat akun TikTok dan Instagram, aku aktif mendokumentasikan berbagai eksperimen pembuatan website dengan AI dan otomasi kerja yang kini telah ditonton lebih dari 200.000+ kali secara organik oleh komunitas kreator, pembelajar, dan pelaku bisnis.</p>
        <p className="about-description">Saat ini, aku berfokus membantu pemilik bisnis dan tim merancang website profesional serta membangun sistem otomasi AI yang memangkas jam kerja manual berulang.</p>
      </div>
    </div>
  </section>
}

const contactFlowSteps = [
  '1. Ceritakan kebutuhan via WA',
  '2. Bedah solusi & estimasi (Gratis)',
  '3. Eksekusi proyek',
]

function ContactSection() {
  const link = whatsappHref()
  return <section className="contact-section section-space" id="contact" aria-labelledby="contact-title">
    <div className="section-inner">
      <div className="contact-panel">
        <span className="contact-light-sweep" aria-hidden="true" />
        <Sparkle className="contact-sparkle" />
        <p className="section-eyebrow">MARI MULAI DARI KEBUTUHANMU</p>
        <h2 id="contact-title">Punya proyek atau alur kerja yang ingin dibangun?</h2>
        <p className="contact-description">Ceritakan masalah atau rencana bisnismu. Kita mulai dari solusi yang paling masuk akal.</p>
        <div className="contact-flow-steps" aria-label="Alur diskusi proyek">
          {contactFlowSteps.map((step, index) => <span className="contact-flow-item" key={step}>
            <span className="contact-flow-pill">{step}</span>
            {index < contactFlowSteps.length - 1 && <span className="contact-flow-arrow" aria-hidden="true">→</span>}
          </span>)}
        </div>
        {link ? <a className="button button-primary contact-button" href={link} target="_blank" rel="noreferrer">Mulai diskusi di WhatsApp <ButtonArrow /></a> : <div className="contact-pending"><button className="button button-primary contact-button" type="button" disabled>Mulai diskusi di WhatsApp <ButtonArrow /></button><p>Placeholder: tautan WhatsApp menunggu nomor terverifikasi.</p></div>}
      </div>
    </div>
  </section>
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-main section-inner"><a href="#home" className="brand footer-brand"><SparkMark className="brand-mark" /><span>Artha</span></a><nav aria-label="Navigasi footer"><a href="#work">Karya</a><a href="#services">Layanan</a><a href="#workflow">Cara Kerja</a><a href="#resources">Template &amp; Sesi</a><a href="#about">Tentang</a><a href="#contact">Diskusikan Proyek</a></nav><a className="back-top" href="#home">Kembali ke atas <span aria-hidden="true">↑</span></a></div>
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
      <WorkflowSection />
      <ResourcesSection />
      <AboutSection />
      <ContactSection />
    </main>
    <FloatingDock />
    <Footer />
  </div>
}
