(() => {
  'use strict';
  const form = document.querySelector('#content-form');
  const status = document.querySelector('#form-status');
  const publishStatus = document.querySelector('#publish-status');
  const tokenInput = document.querySelector('#github-token');
  const initial = {
    name:'Moheen Sulehria', title:'Software Engineer', tagline:'Every type of work related to me will be done with excellency.',
    education:'BS Computer Engineering Technology', email:'moheensulehria@gmail.com', github:'https://github.com/Moheensulehria',
    linkedin:'https://www.linkedin.com/in/moheen-sulehria-480338405/', skills:['HTML','CSS','JavaScript','React','C#','C++','Python'],
    sdlcTitle:'Software Development Life Cycle (SDLC)',
    sdlcDescription:'An AI-assisted project workflow concept intended to help coordinate work across a project lifecycle from one place. The goal is to reduce repetitive steps and support teams from planning through delivery.', lastUpdated:new Date().toISOString().slice(0,10)
  };
  let content = {...initial};
  const setStatus = (el, message, error=false) => { el.textContent = message; el.style.color = error ? '#ff9b8d' : '#f4d887'; };
  function fillForm(data) {
    content = {...initial, ...data};
    for (const [key, value] of Object.entries(content)) {
      const field = form.elements.namedItem(key);
      if (field) field.value = Array.isArray(value) ? value.join(', ') : value ?? '';
    }
  }
  function readForm() {
    const data = new FormData(form), result = {};
    for (const [key, value] of data.entries()) result[key] = String(value).trim();
    result.skills = result.skills.split(',').map(s => s.trim()).filter(Boolean);
    result.lastUpdated = new Date().toISOString().slice(0,10);
    return result;
  }
  async function loadSaved() {
    try {
      const response = await fetch(`data/site-content.json?cacheBust=${Date.now()}`, {cache:'no-store'});
      if (!response.ok) throw new Error('Could not load content file');
      fillForm(await response.json());
      setStatus(status, 'Loaded the currently deployed content file.');
    } catch (err) { fillForm(initial); setStatus(status, 'Loaded built-in defaults. If opened as file://, run the site through a local server to load JSON.', true); }
  }
  form.addEventListener('submit', event => { event.preventDefault(); content = readForm(); setStatus(status, 'Draft is ready in this page. Download a JSON backup or publish it to GitHub to make it live.'); });
  document.querySelector('#reload-content').addEventListener('click', loadSaved);
  document.querySelector('#download-content').addEventListener('click', () => {
    content = readForm();
    const blob = new Blob([JSON.stringify(content, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'site-content.json'; a.click(); URL.revokeObjectURL(url);
    setStatus(status, 'JSON backup downloaded.');
  });
  document.querySelector('#publish-github').addEventListener('click', async () => {
    const owner = document.querySelector('#repo-owner').value.trim();
    const repo = document.querySelector('#repo-name').value.trim();
    const branch = document.querySelector('#repo-branch').value.trim() || 'main';
    const token = tokenInput.value.trim();
    if (!form.reportValidity()) return;
    if (!owner || !repo || !token || !document.querySelector('#understand-token').checked) {
      setStatus(publishStatus, 'Enter owner, repository, token, and confirm the token warning.', true); return;
    }
    content = readForm();
    setStatus(publishStatus, 'Connecting to GitHub…');
    try {
      const headers = {'Accept':'application/vnd.github+json','Authorization':`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'};
      const path = 'data/site-content.json';
      const api = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`;
      const current = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, {headers});
      let sha;
      if (current.ok) { const old = await current.json(); sha = old.sha; }
      else if (current.status !== 404) { const err = await current.json().catch(()=>({})); throw new Error(err.message || `GitHub read failed (${current.status})`); }
      const body = {message:`Update portfolio content (${content.lastUpdated})`, content:btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2) + '\n'))), branch};
      if (sha) body.sha = sha;
      const response = await fetch(api, {method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});
      const result = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(result.message || `GitHub publish failed (${response.status})`);
      setStatus(publishStatus, 'Published content JSON to GitHub. GitHub Pages should update after its deployment completes.');
      tokenInput.value = '';
    } catch (error) { setStatus(publishStatus, `${error.message}. Check repository name, branch, token permissions, and Pages setup.`, true); }
    finally { tokenInput.value = ''; }
  });
  loadSaved();
})();
