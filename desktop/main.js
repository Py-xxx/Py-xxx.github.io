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

// ── Icons ──────────────────────────────────────────────────
const icons  = document.querySelectorAll('.icon')

icons.forEach(icon => {
  const activate = () => {
    // Deselect all
    icons.forEach(i => i.classList.remove('selected'))
    icon.classList.add('selected')

    const graphic = icon.querySelector('.icon-graphic')
    const href    = icon.dataset.href
    const action  = icon.dataset.action
    const external= icon.dataset.external === 'true'

    // Bounce animation
    gsap.timeline()
      .to(graphic, { y: -11, duration: 0.14, ease: 'power2.out' })
      .to(graphic, { y: 0,   duration: 0.5,  ease: 'bounce.out' })

    if (action === 'links') {
      linksCard.classList.contains('open') ? closeLinks() : openLinks()
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
