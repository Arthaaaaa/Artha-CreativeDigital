import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollStory(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const media = gsap.matchMedia(root)

    media.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 768px)',
      },
      ({ conditions }) => {
        if (conditions.reduceMotion) return undefined

        const ctx = gsap.context(() => {
          const select = gsap.utils.selector(root)

          gsap.timeline({ defaults: { ease: 'power3.out' } })
            .fromTo(select('.hero-art'),
              { autoAlpha: 0, filter: 'blur(2px)' },
              { autoAlpha: 1, filter: 'blur(0px)', duration: 0.8, clearProps: 'opacity,visibility,filter' },
              0,
            )
            .fromTo(select('.identity-badge'),
              { autoAlpha: 0, y: 14, scale: 0.97 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.38 },
            )
            .fromTo(select('.hero h1'),
              { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0.55 },
              { clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, duration: 0.52, clearProps: 'clipPath,opacity,visibility' },
              '-=0.12',
            )
            .fromTo(select('.hero-support'),
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, duration: 0.38, clearProps: 'transform,opacity,visibility' },
              '-=0.16',
            )
            .fromTo(select('.hero-actions .button'),
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.08, clearProps: 'transform,opacity,visibility' },
              '-=0.08',
            )

          const reveal = (targets, trigger, options = {}) => {
            const elements = Array.from(targets ?? [])
            const triggerElement = trigger?.[0] ?? trigger
            if (!elements.length || !triggerElement) return

            const direction = options.direction ?? 'vertical'
            const axis = direction === 'horizontal' ? 'x' : 'y'
            const distance = options.distance ?? 100
            const initialOpacity = options.initialOpacity ?? 0
            const blur = options.blur ?? 2
            const rotation = options.rotate ?? 0
            const tilt = options.tilt ?? 0
            const from = {
              autoAlpha: initialOpacity,
              [axis]: distance,
              scale: options.scale ?? 1,
              filter: `blur(${blur}px)`,
              rotation,
            }
            const to = {
              autoAlpha: 1,
              [axis]: 0,
              scale: 1,
              filter: 'blur(0px)',
              rotation: 0,
              duration: options.duration ?? 1.3,
              ease: options.ease ?? 'power3.out',
              stagger: options.stagger ? { each: options.stagger, from: options.staggerFrom ?? 'center' } : undefined,
              clearProps: 'visibility,opacity,transform,filter',
              paused: true,
            }

            if (tilt) {
              const tiltAxis = direction === 'horizontal' ? 'rotationY' : 'rotationX'
              from[tiltAxis] = tilt
              to[tiltAxis] = 0
              from.transformPerspective = 900
              to.transformPerspective = 900
            }

            try {
              gsap.set(elements, from)
              const tween = gsap.fromTo(elements, from, to)
              const start = `top ${(1 - (options.threshold ?? 0.1)) * 100}%`

              ScrollTrigger.create({
                trigger: triggerElement,
                start,
                end: 'bottom top',
                once: false,
                onEnter: () => tween.restart(),
                onEnterBack: () => tween.restart(),
                onLeaveBack: () => tween.pause(0),
              })
            } catch {
              gsap.set(elements, { clearProps: 'visibility,opacity,transform,filter' })
            }
          }

          const revealChildren = (selector, options = {}) => {
            select(selector).forEach((container) => {
              const children = Array.from(container.children).filter((child) => !child.matches('.contact-light-sweep, .contact-sparkle'))
              reveal(children, container, options)
            })
          }

          revealChildren('.work-section .section-heading', { rotate: 0, stagger: 0.08, staggerFrom: 'center' })

          select('.featured-project').forEach((project) => {
            reveal([project], project)

            const preview = project.querySelector('.project-preview')
            if (!preview) return

            gsap.fromTo(preview,
              { clipPath: 'inset(0 100% 0 0 round 24px)' },
              {
                clipPath: 'inset(0 0% 0 0 round 24px)',
                duration: 0.85,
                ease: 'power3.inOut',
                clearProps: 'clipPath',
                scrollTrigger: { trigger: project, start: 'top 76%', once: true },
              },
            )

            const video = preview.querySelector('.project-preview-video')
            if (video) {
              gsap.fromTo(video,
                { x: -30, autoAlpha: 0 },
                {
                  x: 0,
                  autoAlpha: 1,
                  duration: 0.65,
                  ease: 'power3.out',
                  clearProps: 'transform,opacity,visibility',
                  scrollTrigger: { trigger: project, start: 'top 72%', once: true },
                },
              )
            }
          })
          reveal(select('.work-placeholder'), select('.work-placeholder'), { distance: 32, rotate: 1, duration: 0.7 })

          revealChildren('.services-section .section-heading', { rotate: 0, stagger: 0.08, staggerFrom: 'center' })

          gsap.fromTo(select('.service-website .browser-visual'),
            { clipPath: 'inset(0 100% 0 0 round 10px)' },
            {
              clipPath: 'inset(0 0% 0 0 round 10px)',
              duration: 0.72,
              ease: 'power3.inOut',
              clearProps: 'clipPath',
              scrollTrigger: { trigger: select('.service-website')[0], start: 'top 78%', once: true },
            },
          )
          gsap.fromTo(select('.browser-layout > *'),
            { scaleX: 0, transformOrigin: 'left center', autoAlpha: 0.35 },
            {
              scaleX: 1,
              autoAlpha: 1,
              duration: 0.38,
              stagger: 0.09,
              ease: 'power2.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: { trigger: select('.service-website')[0], start: 'top 75%', once: true },
            },
          )
          gsap.fromTo(select('.poster-visual'),
            { clipPath: 'inset(100% 0 0 0)', y: 18, autoAlpha: 0 },
            {
              clipPath: 'inset(0% 0 0 0)',
              y: 0,
              autoAlpha: 1,
              duration: 0.66,
              ease: 'power3.out',
              clearProps: 'clipPath,transform,opacity,visibility',
              scrollTrigger: { trigger: select('.service-design')[0], start: 'top 82%', once: true },
            },
          )
          gsap.fromTo(select('.workflow-visual b'),
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.42,
              stagger: 0.16,
              ease: 'power2.out',
              clearProps: 'transform',
              scrollTrigger: { trigger: select('.service-ai')[0], start: 'top 82%', once: true },
            },
          )
          gsap.fromTo(select('.workflow-visual i'),
            { scale: 0.55, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.42,
              stagger: 0.13,
              ease: 'back.out(1.7)',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: { trigger: select('.service-ai')[0], start: 'top 82%', once: true },
            },
          )
          select('.service-reveal-shell').forEach((card) => reveal([card], card))

          reveal(select('.about-art'), select('.about-art'))
          revealChildren('.about-copy', { distance: 72, rotate: 0, stagger: 0.08, staggerFrom: 'center' })
          gsap.fromTo(select('.about-art-word'),
            { yPercent: conditions.desktop ? 8 : 3, backgroundPosition: '0% 50%' },
            {
              yPercent: conditions.desktop ? -8 : -3,
              backgroundPosition: '100% 50%',
              ease: 'none',
              scrollTrigger: {
                trigger: select('.about-section')[0],
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            },
          )

          const contactPanel = select('.contact-panel')[0]
          if (contactPanel) {
            reveal([contactPanel], contactPanel)
            gsap.fromTo(select('.contact-light-sweep'),
              { xPercent: -115, autoAlpha: 0 },
              {
                xPercent: 615,
                autoAlpha: 0.72,
                duration: 1.05,
                delay: 0.22,
                ease: 'power2.inOut',
                clearProps: 'transform,opacity,visibility',
                scrollTrigger: { trigger: select('.contact-section')[0], start: 'top 70%', once: true },
              },
            )
          }

          const footerMain = select('.footer-main')[0]
          if (footerMain) {
            reveal(Array.from(footerMain.children).filter((child) => !child.matches('nav')), footerMain, {
              distance: 64,
              rotate: 1,
              stagger: 0.08,
              staggerFrom: 'center',
            })
          }
          revealChildren('.footer-main nav', { distance: 36, rotate: 0, stagger: 0.08, staggerFrom: 'center' })

          gsap.fromTo(select('.footer-signature'),
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.9,
              ease: 'power3.inOut',
              clearProps: 'clipPath',
              scrollTrigger: { trigger: select('.footer-signature')[0], start: 'top 88%', once: true },
            },
          )
          reveal(select('.copyright'), select('.copyright'), { distance: 24, blur: 0, rotate: 0, duration: 0.7 })
        }, root)

        return () => ctx.revert()
      },
    )

    return () => media.revert()
  }, [rootRef])
}
