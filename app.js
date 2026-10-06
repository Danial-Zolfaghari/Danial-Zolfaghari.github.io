(() => {
  const body = document.body;
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.mobile-backdrop');
  const close = document.querySelector('.mobile-close');

  const setMenu = (open) => {
    menu?.classList.toggle('open', open);
    backdrop?.classList.toggle('open', open);
    body.classList.toggle('menu-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
  };

  toggle?.addEventListener('click', () => setMenu(true));
  close?.addEventListener('click', () => setMenu(false));
  backdrop?.addEventListener('click', () => setMenu(false));
  document.querySelectorAll('.mobile-links a,.mobile-contact').forEach(el => el.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 12), {passive:true});

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const spy = () => {
    let current = '';
    for (const s of sections) if (s.getBoundingClientRect().top <= 130) current = s.id;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };
  addEventListener('scroll', spy, {passive:true});
  spy();

  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx=0,my=0,rx=0,ry=0;
    body.classList.add('cursor-ready');
    addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; if(dot) dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    const loop=()=>{ rx+=(mx-rx)*.18; ry+=(my-ry)*.18; if(ring) ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); }; loop();
    document.querySelectorAll('a,button').forEach(el=>{
      el.addEventListener('mouseenter',()=>body.classList.add('cursor-link'));
      el.addEventListener('mouseleave',()=>body.classList.remove('cursor-link'));
    });
    addEventListener('mousedown',()=>body.classList.add('cursor-down'));
    addEventListener('mouseup',()=>body.classList.remove('cursor-down'));
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();