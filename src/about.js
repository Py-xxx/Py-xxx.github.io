import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Nav — border on scroll + hamburger toggle
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

// Page header entrance
const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

tl.from('.about-page-header .terminal-line', { opacity: 0, x: -12, duration: 0.5 })
  .from('.about-page-title',  { opacity: 0, y: 16, duration: 0.6 }, '-=0.2')
  .from('.about-page-sub',    { opacity: 0, y: 12, duration: 0.5 }, '-=0.3')

// Scroll reveal for each block
document.querySelectorAll('.about-block').forEach(block => {
  gsap.from(block, {
    opacity: 0,
    y: 24,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: block, start: 'top 88%' }
  })
})

// Stagger identity grid items
gsap.from('.identity-grid > div', {
  opacity: 0,
  y: 12,
  duration: 0.4,
  stagger: 0.08,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.identity-grid', start: 'top 88%' }
})

// Stagger traits
gsap.from('.trait', {
  opacity: 0,
  x: -16,
  duration: 0.4,
  stagger: 0.1,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.traits-list', start: 'top 88%' }
})

// CTA
gsap.from('.about-cta', {
  opacity: 0,
  y: 20,
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.about-cta', start: 'top 90%' }
})
