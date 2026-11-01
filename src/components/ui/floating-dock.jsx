import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { IconBrandInstagram, IconBrandLinkedin, IconBrandTiktok, IconMail } from '@tabler/icons-react'
import './floating-dock.css'

const items = [
  { title: 'Instagram', href: 'https://www.instagram.com/zackyarta/', icon: IconBrandInstagram },
  { title: 'TikTok', href: 'https://www.tiktok.com/@zackyarta?_r=1&_t=ZS-9B0iK6NYiaD', icon: IconBrandTiktok },
  { title: 'LinkedIn', href: 'https://www.linkedin.com/in/zacky-artha-81279b298/?isSelfProfile=true', icon: IconBrandLinkedin },
  { title: 'Email', href: 'mailto:zackyartha@gmail.com', icon: IconMail },
]

const spring = { mass: 0.1, stiffness: 150, damping: 12 }

export default function FloatingDock() {
  const mouseX = useMotionValue(Infinity)

  return <div className="floating-dock-slot">
    <motion.nav
      className="floating-dock"
      aria-label="Media sosial dan kontak"
      onPointerMove={(event) => event.pointerType === 'mouse' && mouseX.set(event.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item) => <FloatingDockItem key={item.title} item={item} mouseX={mouseX} />)}
    </motion.nav>
  </div>
}

function FloatingDockItem({ item, mouseX }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect()
    return x - (bounds ? bounds.left + bounds.width / 2 : 0)
  })
  const size = useSpring(useTransform(distance, [-140, 0, 140], [44, 64, 44]), spring)
  const iconSize = useSpring(useTransform(distance, [-140, 0, 140], [22, 32, 22]), spring)
  const Icon = item.icon
  const isEmail = item.href.startsWith('mailto:')

  return <motion.a
    ref={ref}
    className="floating-dock-item"
    href={item.href}
    aria-label={item.title}
    target={isEmail ? undefined : '_blank'}
    rel={isEmail ? undefined : 'noopener noreferrer'}
    style={{ width: size, height: size }}
    onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
    onPointerLeave={() => setHovered(false)}
    onFocus={() => setHovered(true)}
    onBlur={() => setHovered(false)}
  >
    <AnimatePresence>
      {hovered && <motion.span className="floating-dock-tooltip" initial={{ opacity: 0, y: 5, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 2, x: '-50%' }}>{item.title}</motion.span>}
    </AnimatePresence>
    <motion.span className="floating-dock-icon" style={{ width: iconSize, height: iconSize }}>
      <Icon aria-hidden="true" />
    </motion.span>
  </motion.a>
}
