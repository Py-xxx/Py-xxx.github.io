import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================
// CURSOR GLOW
// ============================================
const glow = document.createElement('div')
glow.className = 'cursor-glow'
document.body.appendChild(glow)
gsap.set(glow, { xPercent: -50, yPercent: -50 })

window.addEventListener('mousemove', e => {
  gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power2.out' })
})

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('progressBar')
window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
  progressBar.style.transform = `scaleX(${progress})`
})

// ============================================
// NAV — border on scroll + hamburger toggle
// ============================================
const nav = document.getElementById('nav')
const navToggle = document.getElementById('navToggle')
const navLinks = document.getElementById('navLinks')

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40)
})

navToggle.addEventListener('click', () => {
  nav.classList.toggle('nav-open')
  navLinks.classList.toggle('open')
})

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav-open')
    navLinks.classList.remove('open')
  })
})

// ============================================
// HERO — typing animation sequence
// ============================================
const heroName    = document.getElementById('heroName')
const heroTag     = document.getElementById('heroTag')
const heroSub     = document.getElementById('heroSub')
const heroCtas    = document.getElementById('heroCtas')

const NAME    = 'Py.'
const TAGLINE = 'Full-stack engineer. Full-shelf author.'
const SUB     = 'I build software and worlds. Sometimes they\'re the same thing.'

function typeText(el, text, speed = 45) {
  return new Promise(resolve => {
    let i = 0
    const interval = setInterval(() => {
      el.textContent += text[i]
      i++
      if (i >= text.length) {
        clearInterval(interval)
        resolve()
      }
    }, speed)
  })
}

const scrollHint = document.getElementById('scrollHint')

async function runHeroSequence() {
  // Small initial delay
  await new Promise(r => setTimeout(r, 400))

  await typeText(heroName, NAME, 70)
  await new Promise(r => setTimeout(r, 200))

  await typeText(heroTag, TAGLINE, 35)
  await new Promise(r => setTimeout(r, 200))

  await typeText(heroSub, SUB, 25)
  await new Promise(r => setTimeout(r, 300))

  // Fade in CTAs
  gsap.to(heroCtas, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })

  // Fade in scroll hint after CTAs appear
  await new Promise(r => setTimeout(r, 600))
  scrollHint?.classList.add('visible')
}

// Hide scroll hint as soon as the user scrolls
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) scrollHint?.classList.add('hidden')
  else scrollHint?.classList.remove('hidden')
}, { passive: true })

runHeroSequence()

// ============================================
// SCROLL REVEALS
// ============================================
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
    }
  })
})

// Stagger children of these containers on scroll
const staggerTargets = [
  { selector: '.projects-grid',  children: '.project-card' },
  { selector: '.shelf-books',    children: '.book-spine' },
  { selector: '.stack-tags',     children: 'span' },
]

staggerTargets.forEach(({ selector, children }) => {
  const parent = document.querySelector(selector)
  if (!parent) return
  const items = parent.querySelectorAll(children)

  gsap.set(items, { opacity: 0, y: 24 })
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: parent,
      start: 'top 85%',
    }
  })
})

// Section headers
document.querySelectorAll('.section-header').forEach(header => {
  gsap.from(header, {
    opacity: 0,
    x: -20,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: header,
      start: 'top 88%',
    }
  })
})

// Writing intro
const writingIntro = document.querySelector('.writing-intro')
if (writingIntro) {
  gsap.from(writingIntro, {
    opacity: 0,
    y: 16,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: writingIntro,
      start: 'top 88%',
    }
  })
}

// ============================================
// BOOKSHELF — spine click → drawer
// ============================================
const spines     = document.querySelectorAll('.book-spine:not(.book-spine--empty)')
const drawer     = document.getElementById('bookDrawer')
const drawerClose = document.getElementById('drawerClose')
const shelfHint  = document.getElementById('shelfHint')
let activeSpine  = null

function openDrawer(spine) {
  // Deactivate any previously active spine
  if (activeSpine && activeSpine !== spine) activeSpine.classList.remove('active')

  spine.classList.add('active')
  activeSpine = spine

  // Hide the hint permanently once a user interacts
  if (shelfHint) shelfHint.classList.add('hidden')

  gsap.to(drawer, {
    height: 'auto',
    opacity: 1,
    duration: 0.45,
    ease: 'power3.out',
  })
}

function closeDrawer() {
  if (activeSpine) {
    activeSpine.classList.remove('active')
    activeSpine = null
  }
  gsap.to(drawer, {
    height: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
  })
}

spines.forEach(spine => {
  spine.addEventListener('click', () => {
    spine.classList.contains('active') ? closeDrawer() : openDrawer(spine)
  })
  // Keyboard support
  spine.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      spine.classList.contains('active') ? closeDrawer() : openDrawer(spine)
    }
  })
})

drawerClose?.addEventListener('click', closeDrawer)

// Contact heading
const contactHeading = document.querySelector('.contact-heading')
if (contactHeading) {
  gsap.from(contactHeading, {
    opacity: 0,
    y: 20,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: contactHeading,
      start: 'top 88%',
    }
  })
}
