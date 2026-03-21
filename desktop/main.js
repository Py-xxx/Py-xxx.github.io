import gsap from 'gsap'

// ── Clock ──────────────────────────────────────────────────
function updateClock() {
  const now   = new Date()
  const hh    = now.getHours().toString().padStart(2, '0')
  const mm    = now.getMinutes().toString().padStart(2, '0')
  const days  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const timeEl = document.getElementById('taskbarTime')
  const dateEl = document.getElementById('taskbarDate')
  if (timeEl) timeEl.textContent = `${hh}:${mm}`
  if (dateEl) dateEl.textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`
}
setInterval(updateClock, 1000)
updateClock()

// ── Cursor glow ────────────────────────────────────────────
const isTouchDevice = window.matchMedia('(hover: none)').matches
if (!isTouchDevice) {
  const glow = document.createElement('div')
  glow.className = 'cursor-glow'
  document.body.appendChild(glow)

  window.addEventListener('mousemove', e => {
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.7, ease: 'power2.out' })
  })
}

// ── Links card ────────────────────────────────────────────
const linksCard  = document.getElementById('linksCard')
const linksClose = document.querySelector('.dot-close')

function openLinks() {
  linksCard.classList.add('open')
  linksCard.setAttribute('aria-hidden', 'false')
}

function closeLinks() {
  linksCard.classList.remove('open')
  linksCard.setAttribute('aria-hidden', 'true')
}

linksClose?.addEventListener('click', e => {
  e.stopPropagation()
  closeLinks()
})

// ── Portfolio transition ───────────────────────────────────
function launchPortfolio(iconEl) {
  const rect = iconEl.getBoundingClientRect()
  const cx = rect.left + rect.width  / 2
  const cy = rect.top  + rect.height / 2

  const term = document.createElement('div')
  term.className = 'transition-terminal'
  term.innerHTML = `
    <div class="tt-bar">
      <div class="tt-dots"><span></span><span></span><span></span></div>
      <span class="tt-title">portfolio — py@portfolio</span>
    </div>
    <div class="tt-body">
      <span class="tt-prompt">py@portfolio ~ $&nbsp;</span><span class="tt-cursor">▋</span>
    </div>
  `
  document.body.appendChild(term)

  const targetW = Math.min(700, window.innerWidth  * 0.9)
  const targetH = Math.min(440, window.innerHeight * 0.65)

  // Start at icon position, collapsed
  gsap.set(term, { left: cx, top: cy, xPercent: -50, yPercent: -50, width: 2, height: 2, opacity: 0 })

  gsap.timeline({
    onComplete: () => {
      gsap.to('body', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => { window.location.href = '/portfolio' },
      })
    },
  })
    .to('.icon-grid, .taskbar', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
    .to(term, { opacity: 1, width: targetW, height: targetH, left: '50%', top: '50%', duration: 0.55, ease: 'power3.out' }, 0.05)
    .to('.tt-cursor', { opacity: 0, duration: 0.13, repeat: 5, yoyo: true, ease: 'none' }, 0.55)
    .to({}, { duration: 0.1 })
}

// ── Icons ──────────────────────────────────────────────────
const icons  = document.querySelectorAll('.icon')

icons.forEach(icon => {
  const activate = () => {
    icons.forEach(i => i.classList.remove('selected'))
    icon.classList.add('selected')

    const graphic  = icon.querySelector('.icon-graphic')
    const href     = icon.dataset.href
    const action   = icon.dataset.action
    const external = icon.dataset.external === 'true'

    // Bounce animation
    gsap.timeline()
      .to(graphic, { y: -11, duration: 0.14, ease: 'power2.out' })
      .to(graphic, { y: 0,   duration: 0.5,  ease: 'bounce.out' })

    if (action === 'links') {
      linksCard.classList.contains('open') ? closeLinks() : openLinks()
      return
    }

    // Portfolio gets the terminal transition
    if (href === '/portfolio') {
      launchPortfolio(icon)
      return
    }

    if (href) {
      setTimeout(() => {
        if (external || href.startsWith('mailto:') || href.startsWith('http')) {
          window.open(href, '_blank', 'noopener')
        } else {
          window.location.href = href
        }
      }, 420)
    }
  }

  icon.addEventListener('click', activate)
  icon.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate()
    }
  })
})

// ── Click outside → deselect & close card ─────────────────
document.getElementById('desktop').addEventListener('click', e => {
  if (!e.target.closest('.icon') && !e.target.closest('.links-card')) {
    icons.forEach(i => i.classList.remove('selected'))
    closeLinks()
  }
})

// ── Entrance animation ─────────────────────────────────────
gsap.from('.icon', {
  opacity: 0,
  y: 12,
  duration: 0.5,
  stagger: 0.07,
  ease: 'power3.out',
  delay: 0.15,
})

gsap.from('.taskbar', {
  opacity: 0,
  y: 8,
  duration: 0.5,
  ease: 'power2.out',
  delay: 0.1,
})
