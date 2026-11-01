import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MenuToggleIcon } from './menu-toggle-icon.jsx'

const cn = (...values) => values.filter(Boolean).join(' ')

export function Navbar({ children, className }) {
  const [visible, setVisible] = useState(() => typeof window !== 'undefined' && window.scrollY > 100)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 100)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <motion.div className={cn('site-nav-resize', className)}>
      {React.Children.map(children, (child) => (
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child
      ))}
    </motion.div>
  )
}

export function NavBody({ children, className, visible }) {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(48px) saturate(190%)' : 'none',
        boxShadow: visible
          ? '0 12px 36px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(255,255,255,.08)'
          : 'none',
        width: visible ? '92%' : '100%',
        y: visible ? 20 : 0,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 50 }}
      className={cn('site-nav', visible && 'is-scrolled', className)}
      role="navigation"
      aria-label="Navigasi utama"
      data-visible={visible ? 'true' : 'false'}
    >
      {children}
    </motion.div>
  )
}

export function NavItems({ items, className, onItemClick, activeLink }) {
  const [hovered, setHovered] = useState(null)

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn('nav-links', className)}
    >
      {items.map((item, index) => (
        <a
          onMouseEnter={() => setHovered(index)}
          onClick={onItemClick}
          className="nav-link"
          key={`link-${index}`}
          href={item.link}
          aria-current={activeLink === item.link ? 'location' : undefined}
        >
          {activeLink === item.link && <motion.span className="nav-active" layoutId="artha-nav-active" aria-hidden="true" />}
          {hovered === index && <motion.span className="nav-hovered" layoutId="artha-nav-hover" aria-hidden="true" />}
          <span>{item.name}</span>
        </a>
      ))}
    </motion.div>
  )
}

export function MobileNav({ children, className, visible }) {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(48px) saturate(190%)' : 'none',
        boxShadow: visible
          ? '0 12px 36px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(255,255,255,.08)'
          : 'none',
        width: visible ? '92%' : '100%',
        y: visible ? 20 : 0,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 50 }}
      className={cn('site-nav-mobile', visible && 'is-scrolled', className)}
      role="navigation"
      aria-label="Navigasi utama"
      data-visible={visible ? 'true' : 'false'}
    >
      {children}
    </motion.div>
  )
}

export function MobileNavHeader({ children, className }) {
  return <div className={cn('nav-mobile-header', className)}>{children}</div>
}

export function MobileNavMenu({ children, className, isOpen, onClose: _onClose, id }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={cn('nav-mobile-menu', className)}
          aria-label="Tautan navigasi"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MobileNavToggle({ isOpen, onClick }) {
  return (
    <button
      className="menu-toggle"
      type="button"
      aria-expanded={isOpen}
      aria-controls="primary-navigation-mobile"
      aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
      onClick={onClick}
    >
      <MenuToggleIcon open={isOpen} duration={500} strokeWidth={1.8} className="menu-toggle-icon" />
    </button>
  )
}

export function NavbarLogo({ children, onClick }) {
  return (
    <a href="#home" className="brand" aria-label="Artha, Beranda" onClick={onClick}>
      {children}
    </a>
  )
}

export function NavbarButton({
  href,
  as: Tag = 'a',
  children,
  className,
  variant = 'primary',
  ...props
}) {
  const variantClass = {
    primary: '',
    secondary: 'nav-cta-secondary',
    dark: 'nav-cta-dark',
    gradient: 'nav-cta-gradient',
  }[variant]

  return (
    <Tag
      href={href || undefined}
      className={cn('nav-cta', variantClass, className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
