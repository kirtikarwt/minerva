// Minerva Events interactivity

const q = (s, r=document) => r.querySelector(s)
const qa = (s, r=document) => Array.from(r.querySelectorAll(s))

// Year in footer
q('#year').textContent = new Date().getFullYear()

// Simple search filter
const search = q('#eventSearch')
const cards = qa('.event-card')
function applyFilter() {
  const term = search.value.trim().toLowerCase()
  cards.forEach(card => {
    const text = card.innerText.toLowerCase() + ' ' + (card.dataset.tags||'')
    const matches = text.includes(term)
    
    // Smooth fade animation
    if (matches) {
      card.style.display = ''
      setTimeout(() => {
        card.style.opacity = '1'
        card.style.transform = 'scale(1)'
      }, 10)
    } else {
      card.style.opacity = '0'
      card.style.transform = 'scale(0.9)'
      setTimeout(() => {
        card.style.display = 'none'
      }, 300)
    }
  })
}

search.addEventListener('input', applyFilter)

// Default to "search" term on load
if (!search.value) {
  search.value = 'search'
}
applyFilter()

// Horizontal scroll controls for Upcoming
const upcoming = q('#upcomingGrid')
const prev = q('#upcomingPrev')
const next = q('#upcomingNext')

function scrollByAmount(dir){
  const card = upcoming.querySelector('.event-card')
  const amount = (card?.clientWidth || 320) + 24
  upcoming.scrollBy({ left: dir * amount, behavior: 'smooth' })
}

prev?.addEventListener('click', () => scrollByAmount(-1))
next?.addEventListener('click', () => scrollByAmount(1))

// Horizontal scroll controls for Past Events
const past = q('#pastGrid')
const pastPrev = q('#pastPrev')
const pastNext = q('#pastNext')

function scrollPastByAmount(dir){
  const card = past.querySelector('article')
  const amount = (card?.clientWidth || 360) + 24
  past.scrollBy({ left: dir * amount, behavior: 'smooth' })
}

pastPrev?.addEventListener('click', () => scrollPastByAmount(-1))
pastNext?.addEventListener('click', () => scrollPastByAmount(1))

// Dialog helpers
const dialog = q('#dialog')
const dialogTitle = q('#dialogTitle')
const dialogBody = q('#dialogBody')
const dialogClose = q('#dialogClose')

function openDialog(title, body) {
  dialogTitle.textContent = title
  dialogBody.textContent = body
  dialog.classList.remove('hidden')
  dialog.classList.add('flex')
}

function closeDialog(){ 
  dialog.classList.add('hidden')
  dialog.classList.remove('flex')
}

dialogClose.addEventListener('click', closeDialog)
dialog.addEventListener('click', (e) => { 
  if (e.target === dialog) closeDialog() 
})

// Close dialog on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dialog.classList.contains('flex')) {
    closeDialog()
  }
})

// Bind buttons
qa('[data-action="register"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.closest('article').querySelector('h3').textContent
    openDialog('Register for ' + title, 'This is a placeholder. Connect to your Node.js backend or form handler to complete registration.')
  })
})

qa('[data-action="info"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('article')
    const title = card.querySelector('h3').textContent
    const summary = (card.querySelector('p.mt-3')?.textContent || 'Event details coming soon.').trim()
    openDialog('About • ' + title, summary)
  })
})

qa('[data-action="highlights"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.closest('article').querySelector('h3').textContent
    openDialog('Highlights • ' + title, 'Photo gallery and recap coming soon!')
  })
})

// Add parallax effect to cards on mouse move (optional enhancement)
document.addEventListener('mousemove', (e) => {
  const cards = qa('.elevated-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const xPercent = (x / rect.width - 0.5) * 10
      const yPercent = (y / rect.height - 0.5) * 10
      
      card.style.transform = `perspective(1000px) rotateY(${xPercent}deg) rotateX(${-yPercent}deg) translateZ(10px)`
    }
  })
})

// Reset card transform when mouse leaves
qa('.elevated-card').forEach(card => {
  card.addEventListener('mouseleave', () => {
    card.style.transform = ''
  })
})