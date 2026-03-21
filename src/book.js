import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Cursor glow
const glow = document.createElement('div')
glow.className = 'cursor-glow'
document.body.appendChild(glow)
gsap.set(glow, { xPercent: -50, yPercent: -50 })
window.addEventListener('mousemove', e => {
  gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power2.out' })
})

// Scroll progress bar
const progressBar = document.getElementById('progressBar')
window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
  progressBar.style.transform = `scaleX(${progress})`
})

// Nav
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

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav-open')
    navLinks.classList.remove('open')
  })
})

// Page entrance
const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
tl.from('.book-back',         { opacity: 0, x: -12, duration: 0.4 })
  .from('.book-terminal-line',{ opacity: 0, x: -12, duration: 0.4 }, '-=0.2')
  .from('.book-hero-cover',   { opacity: 0, x: -20, duration: 0.6 }, '-=0.2')
  .from('.book-hero-info > *',{ opacity: 0, y: 12,  duration: 0.5, stagger: 0.08 }, '-=0.4')

// Scroll reveals
document.querySelectorAll('.book-block').forEach(block => {
  gsap.from(block, {
    opacity: 0, y: 24, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: block, start: 'top 88%' }
  })
})

gsap.from('.book-theme', {
  opacity: 0, y: 16, duration: 0.4, stagger: 0.1, ease: 'power2.out',
  scrollTrigger: { trigger: '.book-themes', start: 'top 88%' }
})
