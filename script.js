'use strict';
const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.querySelectorAll('a').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
  closeMenu();
}));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Reveal individual cards once; retain native scrolling and reduced-motion support.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      cardObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.cards, .work-grid, .tools').forEach(group => {
    [...group.children].forEach((card, index) => {
      card.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
      card.classList.add('reveal-item');
      cardObserver.observe(card);
    });
  });
}
// Restrict pointer highlights to precise pointers; no scroll handlers or cursor capture.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.services article, .journey article').forEach(card => {
    let frame = 0;
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--shine-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--shine-y', `${event.clientY - bounds.top}px`);
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--shine-x');
      card.style.removeProperty('--shine-y');
    });
  });
}
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('reveal-ready');
    observer.observe(section);
  });
}
const projects = {
  "lembongan": {
    "key": "lembongan",
    "title": "Legend Diving Lembongan",
    "year": "2025",
    "stack": "WordPress · Avada · WPML",
    "url": "https://divinglembongan.com",
    "description": "A multilingual diving website focused on performance and visual consistency.",
    "tasks": [
      "Multilingual website implementation with Avada and WPML",
      "Performance improvements",
      "Consistent visual presentation"
    ],
    "art": "diving",
    "headline": "Explore below<br><i>the surface.</i>"
  },
  "penida": {
    "key": "penida",
    "title": "Legend Diving Penida",
    "year": "2025",
    "stack": "WordPress · Avada · WPML",
    "url": "https://divingpenida.com/",
    "description": "A multilingual diving website designed for clear navigation and responsive layouts.",
    "tasks": [
      "Avada and WPML implementation",
      "Clear navigation",
      "Responsive page layouts"
    ],
    "art": "diving",
    "headline": "Discover<br><i>Nusa Penida.</i>"
  },
  "flex": {
    "key": "flex",
    "title": "Flex and Flow",
    "year": "2024",
    "stack": "WordPress · Elementor · WP Engine theme",
    "url": "https://flexandflow.id/",
    "description": "A company profile website featuring custom service layouts and optimised load time.",
    "tasks": [
      "Elementor page development",
      "Custom service layouts",
      "Load-time optimisation"
    ],
    "art": "gallery",
    "headline": "Find your<br><i>own rhythm.</i>"
  },
  "teramo": {
    "key": "teramo",
    "title": "Teramo Catering",
    "year": "2024",
    "stack": "WordPress · Elementor · Astra",
    "url": "https://www.teramocatering.com.au/",
    "description": "A company profile website with a modern interface and clear presentation of catering services.",
    "tasks": [
      "Elementor and Astra customisation",
      "Modern interface implementation",
      "Clear service presentation"
    ],
    "art": "villa",
    "headline": "Good food.<br><i>Great company.</i>"
  },
  "spa": {
    "key": "spa",
    "title": "SPA Bali Moon",
    "year": "2024",
    "stack": "WordPress · Bricks Builder",
    "url": "https://www.spabalimoon.com/",
    "description": "A spa business website focused on consistent layouts and a responsive mobile experience.",
    "tasks": [
      "Bricks Builder development",
      "Consistent page layouts",
      "Responsive mobile implementation"
    ],
    "art": "gallery",
    "headline": "A moment<br><i>to unwind.</i>"
  }
};
const dialog = document.querySelector('#project-dialog');
const collectionDialog = document.querySelector('#collection-dialog');
const collectionRail = document.querySelector('.collection-rail');
const collections = [
  {title:'Diving',description:'Dive centres & underwater experiences',cover:'lembongan',keys:['lembongan','penida']},
  {title:'Spa & Wellness',description:'Wellbeing, bodywork & spa experiences',cover:'spa',keys:['flex','spa']},
  {title:'Food & Catering',description:'Catering & event services',cover:'teramo',keys:['teramo']}
];
collections.forEach(collection => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'collection-card';
  button.setAttribute('aria-haspopup','dialog');
  button.innerHTML = `<img src="assets/projects/${collection.cover}.jpg" alt="${projects[collection.cover].title} website preview" width="1265" height="712" loading="lazy"><span class="collection-body"><strong>${collection.title}</strong><small>${collection.description}</small><span class="collection-explore">Explore ${collection.keys.length} ${collection.keys.length === 1 ? 'project' : 'projects'} <span aria-hidden="true">↗</span></span></span>`;
  button.addEventListener('click', () => {
    document.querySelector('#collection-title').textContent = collection.title;
    collectionDialog.querySelectorAll('.work').forEach(card => {
      card.hidden = !collection.keys.includes(card.querySelector('[data-project]').dataset.project);
    });
    collectionDialog.showModal();
    collectionDialog.scrollTop = 0;
  });
  collectionRail.append(button);
});
document.querySelector('.collection-close').addEventListener('click', () => collectionDialog.close());
function moveCollection(direction) {
  const end = collectionRail.scrollWidth - collectionRail.clientWidth;
  const distance = collectionRail.querySelector('.collection-card').getBoundingClientRect().width + parseFloat(getComputedStyle(collectionRail).gap);
  let left = collectionRail.scrollLeft + direction * distance;
  if (direction > 0 && collectionRail.scrollLeft >= end - 2) left = 0;
  if (direction < 0 && collectionRail.scrollLeft <= 2) left = end;
  collectionRail.scrollTo({left,behavior:reducedMotion.matches ? 'instant' : 'smooth'});
}
document.querySelector('#collection-prev').addEventListener('click', () => moveCollection(-1));
document.querySelector('#collection-next').addEventListener('click', () => moveCollection(1));
dialog.setAttribute('aria-labelledby', 'project-title');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.querySelector('#project-title').textContent = project.title;
  document.querySelector('#project-stack').textContent = project.year + ' · ' + project.stack;
  document.querySelector('#project-live').href = project.url;
  document.querySelector('#project-description').textContent = project.description;
  const list = document.querySelector('#project-tasks');
  list.replaceChildren(...project.tasks.map(task => {
    const item = document.createElement('li');
    item.textContent = task;
    return item;
  }));
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
