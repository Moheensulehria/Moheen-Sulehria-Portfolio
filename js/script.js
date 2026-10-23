(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let portfolioEmail = 'moheensulehria@gmail.com';
  const toast = message => { const el = $('#toast'); if (!el) return; el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2600); };
  addEventListener('load', () => setTimeout(() => $('#loader')?.classList.add('is-done'), 300));
  setTimeout(() => $('#loader')?.classList.add('is-done'), 2400);

  const themeButton = $('#theme-toggle');
  try { if (localStorage.getItem('moheen-portfolio-theme') === 'light') document.body.classList.replace('theme-dark','theme-light'); } catch (_) {}
  const syncTheme = () => { const light = document.body.classList.contains('theme-light'); themeButton?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme'); if (themeButton) themeButton.textContent = light ? '☾' : '☼'; };
  syncTheme();
  themeButton?.addEventListener('click', () => { const light = document.body.classList.toggle('theme-light'); document.body.classList.toggle('theme-dark', !light); try { localStorage.setItem('moheen-portfolio-theme', light ? 'light' : 'dark'); } catch (_) {} syncTheme(); });

  const menuButton = $('#menu-toggle'), nav = $('#nav-links');
  menuButton?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  $$('#nav-links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false'); }));

  const typed = $('#typed-role'), roles = ['Software Engineer','Web Developer','Problem Solver','Lifelong Learner'];
  if (typed && !reducedMotion) { let r=0,c=roles[0].length,del=true; const type=()=>{const word=roles[r];c+=del?-1:1;typed.textContent=word.slice(0,Math.max(0,c));let delay=del?42:78;if(!del&&c>=word.length){del=true;delay=1450}else if(del&&c<=0){del=false;r=(r+1)%roles.length;delay=300}setTimeout(type,delay)};setTimeout(type,1800); }

  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) { const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)} }),{threshold:.12,rootMargin:'0px 0px -35px 0px'}); revealItems.forEach((el,i)=>{el.style.setProperty('--delay',`${Math.min(i%4,3)*80}ms`);observer.observe(el)}); } else revealItems.forEach(el=>el.classList.add('visible'));

  const progress = $('#progress'); const updateProgress=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(progress)progress.style.transform=`scaleX(${Math.min(1,scrollY/max)})`};addEventListener('scroll',updateProgress,{passive:true});updateProgress();
  if ('IntersectionObserver' in window) { const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)$$('#nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`))}),{rootMargin:'-40% 0px -50% 0px'});$$('main section[id]').forEach(s=>obs.observe(s)); }

  if (!reducedMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) $$('.project-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1100px) rotateY(${x*4}deg) rotateX(${-y*3}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

  const search=$('#project-search'),filters=$$('#project-filters [data-filter]');let activeFilter='all';const filterProjects=()=>{const q=(search?.value||'').trim().toLowerCase();let count=0;$$('#project-grid .project-card').forEach(card=>{const cats=(card.dataset.category||'').split(/\s+/),hay=`${card.dataset.search||''} ${card.textContent}`.toLowerCase(),show=(activeFilter==='all'||cats.includes(activeFilter))&&hay.includes(q);card.hidden=!show;if(show)count++});$('#no-projects').hidden=count!==0};search?.addEventListener('input',filterProjects);filters.forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;filters.forEach(x=>x.classList.toggle('active',x===b));filterProjects()}));

  // Public GitHub repository integration. If the API is unavailable, the portfolio remains usable.
  const loadGitHubRepos = async (username = 'Moheensulehria') => {
    const host = $('#github-repos'); if (!host) return;
    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6&type=public`, {headers:{'Accept':'application/vnd.github+json'}});
      if (!response.ok) throw new Error('GitHub API unavailable');
      const repos = (await response.json()).filter(repo => !repo.fork).slice(0,6);
      if (!repos.length) { host.innerHTML = '<p class="repo-loading">No public repositories found yet.</p>'; return; }
      host.replaceChildren(...repos.map(repo => {
        const card=document.createElement('article'); card.className='repo-card reveal visible';
        const top=document.createElement('div'); top.className='repo-card-top';
        const type=document.createElement('span'); type.textContent='PUBLIC REPOSITORY';
        const star=document.createElement('span'); star.textContent=`☆ ${repo.stargazers_count || 0}`; top.append(type,star);
        const title=document.createElement('h3'); title.textContent=repo.name;
        const desc=document.createElement('p'); desc.textContent=repo.description || 'No description added yet.';
        const meta=document.createElement('div'); meta.className='repo-meta';
        const lang=document.createElement('span'); lang.textContent=repo.language || 'Language not specified';
        const updated=document.createElement('span'); updated.textContent=`Updated ${new Date(repo.updated_at).toLocaleDateString()}`; meta.append(lang,updated);
        const link=document.createElement('a'); link.className='repo-link'; link.href=repo.html_url; link.target='_blank'; link.rel='noopener noreferrer'; link.textContent='View repository ↗';
        card.append(top,title,desc,meta,link); return card;
      }));
    } catch (_) { host.innerHTML = '<p class="repo-loading">GitHub repositories could not be loaded right now. Visit <a href="https://github.com/Moheensulehria" target="_blank" rel="noopener noreferrer">Moheen’s GitHub profile ↗</a>.</p>'; }
  };
  loadGitHubRepos();

  const photo=$('#profile-photo'),placeholder=$('#portrait-placeholder');if(photo){photo.addEventListener('load',()=>{photo.hidden=false;if(placeholder)placeholder.hidden=true});photo.addEventListener('error',()=>{photo.hidden=true;if(placeholder)placeholder.hidden=false});if(photo.complete&&photo.naturalWidth){photo.hidden=false;if(placeholder)placeholder.hidden=true}}
  $('#contact-form')?.addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const d=new FormData(f),subject=encodeURIComponent(`Portfolio enquiry from ${d.get('name')}`),body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\n\nMessage:\n${d.get('message')}`);location.href=`mailto:${portfolioEmail}?subject=${subject}&body=${body}`;toast('Your email app should open with the message prepared.');});
  // Load editable public content from a small JSON file. The page still works with its HTML defaults if fetching fails.
  const safeUrl = (value, allowed) => { try { const u = new URL(value); return allowed.includes(u.protocol) ? u.href : ''; } catch (_) { return ''; } };
  const applyContent = async () => {
    try {
      const response = await fetch(`data/site-content.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const name = String(data.name || 'Moheen Sulehria');
      const parts = name.trim().split(/\s+/);
      const h1 = $('.hero h1');
      if (h1) { h1.textContent = ''; h1.append(document.createTextNode(parts.slice(0,-1).join(' ') || name)); h1.append(document.createElement('br')); const span = document.createElement('span'); span.className='gold-text'; span.textContent=(parts.length>1?parts[parts.length-1]:''); h1.append(span); }
      $$('.brand-name').forEach(el => el.textContent = name.toUpperCase());
      $$('.portrait-bottom span:first-child').forEach(el => el.textContent = name.toUpperCase());
      const footerBrand = $('.footer-brand'); if (footerBrand) { footerBrand.textContent = name.toUpperCase(); const dot = document.createElement('span'); dot.textContent='.'; footerBrand.append(dot); }
      const footerText = $('.site-footer small'); if (footerText) footerText.innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${name}. All rights reserved.`;
      const tagline = $('#hero-tagline'); if (tagline && data.tagline) tagline.textContent = data.tagline;
      const aboutIntro = $('.about-content .large-copy'); if (aboutIntro) { aboutIntro.textContent = ''; aboutIntro.append(document.createTextNode('I’m ')); const aboutName = document.createElement('span'); aboutName.className = 'gold-text'; aboutName.textContent = name; aboutIntro.append(aboutName, document.createTextNode(', a Computer Engineering Technology student who enjoys turning ideas into useful, thoughtful software.')); }
      const portrait = $('#profile-photo'); if (portrait) portrait.alt = `Portrait of ${name}`;
      const education = $('#education-text'); if (education && data.education) education.textContent = data.education;
      const email = safeUrl(`mailto:${String(data.email || '')}`, ['mailto:']);
      if (email) { portfolioEmail = String(data.email || 'moheensulehria@gmail.com'); $$('.contact-details a[href^="mailto:"]').forEach(a => a.href=email); $$('.contact-details a[href^="mailto:"] strong').forEach(el => el.textContent=data.email); }
      const github = safeUrl(data.github || '', ['https:']);
      if (github && new URL(github).hostname === 'github.com') $$('.contact-details a[href*="github.com/"], .site-footer a[href*="github.com/"]').forEach(a => { a.href=github; a.target='_blank'; a.rel='noopener noreferrer'; });
      const linkedin = safeUrl(data.linkedin || '', ['https:']);
      if (linkedin && new URL(linkedin).hostname === 'www.linkedin.com') $$('.contact-details a[href*="linkedin.com/"], .site-footer a[href*="linkedin.com/"]').forEach(a => { a.href=linkedin; a.target='_blank'; a.rel='noopener noreferrer'; });
      const title = $('.project-card h3'); if (title && data.sdlcTitle) title.textContent=data.sdlcTitle;
      const description = $('.project-card-body > p'); if (description && data.sdlcDescription) description.textContent=data.sdlcDescription;
      const skillList = Array.isArray(data.skills) ? data.skills.map(v=>String(v).trim()).filter(Boolean) : [];
      const groups = $$('.skill-group .skill-chips');
      if (groups[0] && skillList.length) { const web=skillList.filter(v=>/html|css|javascript|react|web/i.test(v)); groups[0].replaceChildren(...(web.length?web:skillList).map(v=>{const el=document.createElement('span');el.textContent=v;return el})); }
      if (groups[1] && skillList.length) { const languages=skillList.filter(v=>/python|c#|c\+\+|java|sql|c language/i.test(v)); if(languages.length)groups[1].replaceChildren(...languages.map(v=>{const el=document.createElement('span');el.textContent=v;return el})); }
      document.title = `${name} | ${String(data.title || 'Software Engineer')}`;
      const roleLine = $('.availability'); if (roleLine && data.title) { const dot = roleLine.querySelector('.status-dot'); roleLine.textContent = ` ${String(data.title).toUpperCase()} · OPEN TO OPPORTUNITIES`; if (dot) roleLine.prepend(dot); }
      if (data.github) { const match = data.github.match(/github\.com\/([^/]+)/i); if (match && match[1] && match[1].toLowerCase() !== 'moheensulehria') loadGitHubRepos(match[1]); }
    } catch (error) { console.info('Using built-in portfolio content; editable JSON was not loaded.', error); }
  };
  applyContent();
  document.documentElement.dataset.portfolioReady='true';

  function initScene(){const canvas=$('#scene');if(!canvas||!window.THREE||reducedMotion||!matchMedia('(min-width:761px)').matches){if(canvas)canvas.hidden=true;return}try{const T=window.THREE,renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));const scene=new T.Scene(),camera=new T.PerspectiveCamera(55,1,.1,100);camera.position.z=8;const group=new T.Group();scene.add(group);const gold=new T.MeshBasicMaterial({color:0xd6b35c,wireframe:true,transparent:true,opacity:.55}),pale=new T.MeshBasicMaterial({color:0xf4d887,wireframe:true,transparent:true,opacity:.45});const core=new T.Mesh(new T.IcosahedronGeometry(1.45,1),gold),inner=new T.Mesh(new T.OctahedronGeometry(.72,1),pale);group.add(core,inner);const rings=[0,1].map(i=>{const m=new T.Mesh(new T.TorusGeometry(2.2+i*.35,.008,6,150),new T.MeshBasicMaterial({color:i?0xf4d887:0xd6b35c,transparent:true,opacity:.45}));m.rotation.x=i?1.1:.7;group.add(m);return m});const n=500,p=new Float32Array(n*3);for(let i=0;i<n;i++)p.set([(Math.random()-.5)*22,(Math.random()-.5)*15,(Math.random()-.5)*16],i*3);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(p,3));scene.add(new T.Points(geo,new T.PointsMaterial({color:0xd6b35c,size:.025,transparent:true,opacity:.5})));const resize=()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()};resize();addEventListener('resize',resize,{passive:true});const clock=new T.Clock();const frame=()=>{if(!document.hidden){const t=clock.getElapsedTime();core.rotation.x=t*.11;core.rotation.y=t*.16;inner.rotation.x=-t*.25;inner.rotation.y=t*.3;rings[0].rotation.z=t*.12;rings[1].rotation.z=-t*.09;const s=Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));group.position.x=Math.sin(s*Math.PI*2)*.7;group.position.y=Math.cos(s*Math.PI)*.25;group.rotation.z=Math.sin(t*.12)*.06;renderer.render(scene,camera)}requestAnimationFrame(frame)};frame()}catch(err){canvas.hidden=true;console.warn('3D background unavailable; CSS visuals remain active.',err)}}
  if(document.readyState==='complete')initScene();else addEventListener('load',initScene,{once:true});
})();
