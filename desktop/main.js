import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

// ── Helpers ────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))
const $ = id => document.getElementById(id)

// ── Clock ──────────────────────────────────────────────────
function updateClock() {
  const now    = new Date()
  const hh     = now.getHours().toString().padStart(2, '0')
  const mm     = now.getMinutes().toString().padStart(2, '0')
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const timeEl = $('taskbarTime')
  const dateEl = $('taskbarDate')
  if (timeEl) timeEl.textContent = `${hh}:${mm}`
  if (dateEl) dateEl.textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`
}
setInterval(updateClock, 1000)
updateClock()

// ── Battery ────────────────────────────────────────────────
async function initBattery() {
  const fill = $('batteryFill')
  if (!fill) return
  if ('getBattery' in navigator) {
    try {
      const bat = await navigator.getBattery()
      const update = () => fill.setAttribute('width', Math.round(13 * bat.level))
      update()
      bat.addEventListener('levelchange', update)
    } catch (_) {}
  }
}
initBattery()

// ── Particle wallpaper ─────────────────────────────────────
function initWallpaper() {
  const canvas = $('wallpaper')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const COUNT    = 55
  const MAX_DIST = 110

  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r:  Math.random() * 1.2 + 0.4,
  }))

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i]
      for (let j = i + 1; j < COUNT; j++) {
        const q  = particles[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < MAX_DIST) {
          ctx.strokeStyle = `rgba(167,139,250,${0.055 * (1 - d / MAX_DIST)})`
          ctx.lineWidth   = 0.7
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.stroke()
        }
      }

      ctx.fillStyle = 'rgba(167,139,250,0.18)'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()

      p.x += p.vx
      p.y += p.vy
      if (p.x < -5) p.x = canvas.width  + 5
      if (p.x > canvas.width  + 5) p.x = -5
      if (p.y < -5) p.y = canvas.height + 5
      if (p.y > canvas.height + 5) p.y = -5
    }

    requestAnimationFrame(frame)
  }
  frame()
}

// ── Cursor glow ────────────────────────────────────────────
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return
  const glow = document.createElement('div')
  glow.className = 'cursor-glow'
  document.body.appendChild(glow)
  window.addEventListener('mousemove', e => {
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.7, ease: 'power2.out' })
  })
}

// ── Rotating phrases ───────────────────────────────────────
const phrases = [
  'I build software and worlds.',
  'Full-stack engineer. Full-shelf author.',
  'built with intention.',
  'making things that matter.',
  'available for the right project.',
]
let phraseIndex = 0

function rotatePhrases() {
  const el = $('pinText')
  if (!el) return
  gsap.to(el, {
    opacity: 0, y: -5, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      phraseIndex = (phraseIndex + 1) % phrases.length
      el.textContent = phrases[phraseIndex]
      gsap.fromTo(el, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
    },
  })
}
setInterval(rotatePhrases, 5000)

// ── Right-click context menu ───────────────────────────────
const contextMenu = $('contextMenu')

function openContextMenu(x, y) {
  const menuW = 200
  const menuH = 155
  const left  = x + menuW > window.innerWidth  ? x - menuW : x
  const top   = y + menuH > window.innerHeight ? y - menuH : y
  gsap.set(contextMenu, { left, top, scale: 0.95, opacity: 0 })
  contextMenu.classList.add('open')
  gsap.to(contextMenu, { scale: 1, opacity: 1, duration: 0.15, ease: 'power2.out' })
}

function closeContextMenu() {
  gsap.to(contextMenu, {
    opacity: 0, scale: 0.95, duration: 0.12, ease: 'power2.in',
    onComplete: () => contextMenu.classList.remove('open'),
  })
}

document.addEventListener('contextmenu', e => {
  if (e.target.closest('.icon') || e.target.closest('.os-window') || e.target.closest('.taskbar')) return
  e.preventDefault()
  openContextMenu(e.clientX, e.clientY)
})

document.addEventListener('click', e => {
  if (!e.target.closest('.context-menu')) closeContextMenu()
})

document.querySelectorAll('.ctx-item').forEach(item => {
  item.addEventListener('click', () => {
    closeContextMenu()
    setTimeout(() => {
      switch (item.dataset.ctx) {
        case 'portfolio': launchPortfolio(document.querySelector('.icon[data-action="portfolio"]')); break
        case 'github':    window.open('https://github.com/Py-xxx', '_blank', 'noopener'); break
        case 'contact':   toggleWindow('contactWindow'); break
        case 'refresh':   window.location.reload(); break
      }
    }, 150)
  })
})

// ── Window management ──────────────────────────────────────
let zTop = 200
let cascadeOffset = 0

function bringToFront(el) {
  zTop++
  el.style.zIndex = zTop
}

function openWindow(el) {
  if (el.classList.contains('open')) {
    bringToFront(el)
    return
  }
  // Center with cascade
  const vw = window.innerWidth
  const vh = window.innerHeight - 42
  const x  = Math.max(8, (vw - el.offsetWidth)  / 2 + cascadeOffset)
  const y  = Math.max(8, (vh - el.offsetHeight) / 2 + cascadeOffset)
  el.style.left = x + 'px'
  el.style.top  = y + 'px'
  cascadeOffset = (cascadeOffset + 28) % 72

  bringToFront(el)
  gsap.set(el, { x: 0, y: 0, scale: 0.94, opacity: 0 })
  el.classList.add('open')
  gsap.to(el, { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(1.5)' })
}

function closeWindow(el) {
  gsap.to(el, {
    scale: 0.94, opacity: 0, duration: 0.15, ease: 'power2.in',
    onComplete: () => el.classList.remove('open'),
  })
}

// Dot-close buttons
document.querySelectorAll('[data-closes]').forEach(dot => {
  dot.addEventListener('click', e => {
    e.stopPropagation()
    const target = $(dot.dataset.closes)
    if (target) closeWindow(target)
  })
})

// Click window → bring to front
document.querySelectorAll('.os-window').forEach(win => {
  win.addEventListener('mousedown', () => bringToFront(win))
})

// ── Draggable windows ──────────────────────────────────────
document.querySelectorAll('.os-window').forEach(win => {
  Draggable.create(win, {
    trigger: win.querySelector('.win-titlebar'),
    bounds:  document.getElementById('desktop'),
    edgeResistance: 0.65,
    cursor: 'grab',
    activeCursor: 'grabbing',
    onPress() { bringToFront(this.target) },
  })
})

// ── Contact send ───────────────────────────────────────────
$('contactSend')?.addEventListener('click', () => {
  const subject = $('contactSubject')?.value  || ''
  const body    = $('contactMessage')?.value  || ''
  window.open(
    `mailto:berrnathan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    '_self'
  )
})

$('contactCancel')?.addEventListener('click', () => closeWindow($('contactWindow')))

// ── Portfolio transition ───────────────────────────────────
function launchPortfolio(iconEl) {
  const rect = iconEl.getBoundingClientRect()
  const cx   = rect.left + rect.width  / 2
  const cy   = rect.top  + rect.height / 2

  const term = document.createElement('div')
  term.className = 'transition-terminal'
  term.innerHTML = `
    <div class="tt-bar">
      <span class="tt-dots"><span></span><span></span><span></span></span>
      <span class="tt-title">py@portfolio ~ </span>
    </div>
    <div class="tt-body">
      <p class="tt-line"><span class="tt-prompt">❯</span><span class="tt-cmd"> whoami</span></p>
      <p class="tt-line"><span class="tt-prompt">❯</span><span class="tt-cursor">█</span></p>
    </div>
  `
  document.body.appendChild(term)

  const targetW = Math.min(700, window.innerWidth * 0.9)
  const targetH = Math.min(390, window.innerHeight * 0.65)

  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:#0a0a0f;opacity:0;z-index:999;pointer-events:none;'
  document.body.appendChild(overlay)

  gsap.set(term, { left: cx, top: cy, xPercent: -50, yPercent: -50, width: 2, height: 2, opacity: 0 })

  gsap.timeline({ onComplete: () => { window.location.href = '/portfolio' } })
    .to('.icon-grid, .taskbar, .status-widget, .pinned-note, .corner-glow', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
    .to(term, { opacity: 1, width: targetW, height: targetH, left: '50%', top: '50%', duration: 0.55, ease: 'power3.out' }, 0.05)
    .to('.tt-cursor', { opacity: 0, duration: 0.13, repeat: 5, yoyo: true, ease: 'none' }, 0.55)
    .to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.in' }, 0.85)
}

// ── Icon click handler ─────────────────────────────────────
const iconEls = [...document.querySelectorAll('.icon')]

function toggleWindow(id) {
  const win = $(id)
  if (!win) return
  win.classList.contains('open') ? closeWindow(win) : openWindow(win)
}

const iconActions = {
  portfolio: icon => launchPortfolio(icon),
  github:    ()   => toggleWindow('githubWindow'),
  contact:   ()   => toggleWindow('contactWindow'),
  links:     ()   => toggleWindow('linksWindow'),
}

iconEls.forEach(icon => {
  const activate = () => {
    iconEls.forEach(i => i.classList.remove('selected'))
    icon.classList.add('selected')

    const graphic = icon.querySelector('.icon-graphic')
    const action  = icon.dataset.action

    gsap.timeline()
      .to(graphic, { y: -11, duration: 0.14, ease: 'power2.out' })
      .to(graphic, { y: 0,   duration: 0.5,  ease: 'bounce.out' })

    iconActions[action]?.(icon)
  }

  icon.addEventListener('click', activate)
  icon.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate() }
  })
})

// ── Keyboard navigation ────────────────────────────────────
let kbIndex = -1

function kbSelect(idx) {
  iconEls.forEach(el => el.classList.remove('kb-focus'))
  kbIndex = ((idx % iconEls.length) + iconEls.length) % iconEls.length
  iconEls[kbIndex].classList.add('kb-focus')
}

document.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return

  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      kbSelect(kbIndex < 0 ? 0 : kbIndex + 1)
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      kbSelect(kbIndex < 0 ? iconEls.length - 1 : kbIndex - 1)
      break
    case 'Enter':
    case ' ':
      if (kbIndex >= 0) { e.preventDefault(); iconEls[kbIndex].click() }
      break
    case 'Escape': {
      const open = [...document.querySelectorAll('.os-window.open')]
        .sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))
      if (open.length) {
        closeWindow(open[0])
      } else {
        iconEls.forEach(el => el.classList.remove('selected', 'kb-focus'))
        kbIndex = -1
      }
      break
    }
  }
})

// Click desktop → deselect icons, close windows
document.getElementById('desktop').addEventListener('click', e => {
  if (!e.target.closest('.icon') && !e.target.closest('.os-window')) {
    iconEls.forEach(i => i.classList.remove('selected'))
  }
})

// ── Restore from bfcache ───────────────────────────────────
window.addEventListener('pageshow', e => {
  if (e.persisted) {
    document.querySelector('.transition-terminal')?.remove()
    gsap.set('body', { opacity: 1 })
    gsap.set('.icon-grid, .taskbar, .status-widget, .pinned-note, .corner-glow', { opacity: 1 })
  }
})

// ── Desktop entrance animation ─────────────────────────────
function runEntrance() {
  gsap.from(iconEls, {
    opacity: 0, y: 14,
    duration: 0.5, stagger: 0.07,
    ease: 'power3.out', delay: 0.05,
  })
  gsap.from('.taskbar', {
    opacity: 0, y: 8,
    duration: 0.5, ease: 'power2.out',
  })
  gsap.from('.status-widget', {
    opacity: 0, x: 14,
    duration: 0.6, ease: 'power3.out', delay: 0.25,
  })
  gsap.from('.pinned-note', {
    opacity: 0, y: 10,
    duration: 0.6, ease: 'power3.out', delay: 0.4,
  })
}

// ── Boot sequence ──────────────────────────────────────────
async function typeLine(container, text, existingEl) {
  const p = existingEl || document.createElement('p')
  if (container && !existingEl) container.appendChild(p)
  for (let i = 0; i < text.length; i++) {
    p.textContent += text[i]
    await delay(11)
  }
}

async function boot() {
  gsap.set('#desktop', { opacity: 0 })
  initWallpaper()
  initCursorGlow()

  const screen  = $('bootScreen')
  const linesEl = $('bootLines')

  await delay(180)

  const lines = [
    '> checking environment ......... ok',
    '> mounting filesystem .......... ok',
    '> starting session ............. ok',
  ]

  for (const line of lines) {
    await typeLine(linesEl, line)
    await delay(110)
  }

  await delay(120)
  const welcome = document.createElement('p')
  welcome.className = 'boot-welcome'
  linesEl.appendChild(welcome)
  await typeLine(null, 'welcome back.', welcome)

  await delay(380)

  gsap.to(screen, {
    opacity: 0, duration: 0.4, ease: 'power2.in',
    onComplete: () => {
      screen.remove()
      gsap.to('#desktop', {
        opacity: 1, duration: 0.3,
        onComplete: runEntrance,
      })
    },
  })
}

boot()
