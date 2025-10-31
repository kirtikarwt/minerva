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
    card.style.display = text.includes(term) ? '' : 'none'
  })
}
search.addEventListener('input', applyFilter)
// Default to tech-related events on load
if (!search.value) {
  search.value = 'tech'
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
function closeDialog(){ dialog.classList.add('hidden'); dialog.classList.remove('flex') }
dialogClose.addEventListener('click', closeDialog)
dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog() })

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


