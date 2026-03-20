import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
}

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
  { selector: '.books-grid',     children: '.book-card' },
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
