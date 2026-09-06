
const projects = window.PORTFOLIO_PROJECTS || [];
const grid = document.querySelector('#projects-grid');
const filters = document.querySelectorAll('.filter');
const modal = document.querySelector('#project-modal');
const closeModal = modal.querySelector('.modal-close');

function renderProjects(filter='Todos'){
  const visible = projects.filter(p => filter === 'Todos' || p.category === filter);
  grid.innerHTML = visible.map(p => `
    <article class="project-card reveal" data-id="${p.id}" tabindex="0" role="button" aria-label="Abrir projeto ${p.title}">
      <div class="project-image"><img loading="lazy" src="${p.image}" alt="${p.title}"></div>
      <div class="project-copy">
        <div class="project-meta"><span>${p.number}</span><span>${p.category}</span></div>
        <h3>${p.title}</h3>
        <p>${p.subtitle}</p>
        <span class="project-open">Ver detalhes ↗</span>
      </div>
    </article>`).join('');
  bindProjectCards();
  observeReveals();
}

function bindProjectCards(){
  document.querySelectorAll('.project-card').forEach(card => {
    const open = () => showProject(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); }
    });
  });
}

function showProject(id){
  const p = projects.find(x => x.id === id);
  if(!p) return;
  modal.querySelector('.modal-image img').src = p.image;
  modal.querySelector('.modal-image img').alt = p.title;
  modal.querySelector('.modal-number').textContent = p.number;
  modal.querySelector('.modal-category').textContent = p.category;
  modal.querySelector('h3').textContent = p.title;
  modal.querySelector('.modal-subtitle').textContent = p.subtitle;
  modal.querySelector('.modal-description').textContent = p.description;
  modal.querySelector('.modal-skills').innerHTML = p.skills.map(s => `<span>${s}</span>`).join('');
  modal.querySelector('.modal-highlight').textContent = p.highlight;
  modal.showModal();
}

closeModal.addEventListener('click', () => modal.close());
modal.addEventListener('click', e => {
  if(e.target === modal) modal.close();
});

filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(btn.dataset.filter);
}));

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
}));

const progress = document.querySelector('.progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max ? (scrollY/max)*100 : 0}%`;
}, {passive:true});

function observeReveals(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
}
renderProjects();
observeReveals();
