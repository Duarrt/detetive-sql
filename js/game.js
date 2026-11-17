{
const $ = id => document.getElementById(id);
const KEY = 'detetive-sql-v1', LKEY = 'detetive-sql-lang';
const DATA = { pt: {seed: window.SEED, cases: window.CASES}, en: {seed: window.SEED_EN, cases: window.CASES_EN} };
const RANK_XP = [0, 200, 500, 850, 1150];

let st = {cur:0, done:{}, hints:{}, drafts:{}};
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) st = Object.assign(st, s); } catch(e) {}
Object.keys(st.drafts).forEach(k => { if (/^\d+$/.test(k)) { st.drafts['pt:' + k] ??= st.drafts[k]; delete st.drafts[k]; } });
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {} };

function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'pt' || q === 'en') return q;
  try { const s = localStorage.getItem(LKEY); if (s === 'pt' || s === 'en') return s; } catch(e) {}
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}
let lang = pickLang(), T = window.I18N[lang], C = DATA[lang].cases;
let SQL = null, db = null, last = null;

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const xp = () => Object.values(st.done).reduce((a,b) => a+b, 0);
const unlocked = i => i === 0 || st.done[i-1] !== undefined || st.done[i] !== undefined;
const draftKey = i => lang + ':' + i;
const rankName = x => { let n = 0; RANK_XP.forEach((v,i) => { if (x >= v) n = i; }); return T.ranks[n]; };

function applyStatic() {
  document.documentElement.lang = T.htmlLang;
  document.title = T.docTitle;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T[el.dataset.i18n]; });
  $('tabs').setAttribute('aria-label', T.casesNav);
  $('privLink').href = T.privacyHref;
  $('langSwitch').setAttribute('aria-label', T.langLabel);
  document.querySelectorAll('#langSwitch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  delete $('resetBtn').dataset.sure;
}
function renderRank() {
  const x = xp(), nx = RANK_XP.find(v => v > x);
  $('rankName').textContent = rankName(x);
  $('xpTxt').textContent = x + ' XP' + (nx !== undefined ? T.xpNext(nx - x) : T.xpMax);
  $('xpFill').style.width = Math.min(100, x / 1300 * 100) + '%';
}
function renderTabs() {
  $('tabs').innerHTML = C.map((c,i) => {
    const cls = ['tab', i===st.cur?'on':'', st.done[i]!==undefined?'done':'', unlocked(i)?'':'lock'].join(' ');
    return `<button class="${cls}" data-i="${i}" ${unlocked(i)?'':'aria-disabled="true"'} title="${esc(c.titulo)}">${T.tab(c.fase, esc(c.faseNome), i+1)}${unlocked(i)?'':' 🔒'}</button>`;
  }).join('');
}
function renderCase() {
  const c = C[st.cur];
  $('caseNo').textContent = T.caseNo(String(st.cur+1).padStart(3,'0'), C.length);
  $('phase').textContent = T.phase(c.fase, c.faseNome);
  $('title').textContent = c.titulo;
  $('story').innerHTML = c.historia;
  $('concept').innerHTML = c.conceito;
  $('example').textContent = c.exemplo;
  $('goal').textContent = T.goal + c.objetivo;
  $('stamp').className = 'stamp' + (st.done[st.cur]!==undefined ? ' show' : '');
  $('sql').value = st.drafts[draftKey(st.cur)] ?? '';
  $('verdict').innerHTML = st.done[st.cur]!==undefined ? `<div class="verdict good">${T.solved(st.done[st.cur])}${esc(c.fim)}</div>` : '';
  $('result').innerHTML = ''; last = null;
  renderHints(); renderTabs(); renderRank();
}
function renderHints() {
  const c = C[st.cur], n = st.hints[st.cur] || 0;
  let h = c.dicas.slice(0, Math.min(n, c.dicas.length)).map((d,i) => `<div class="hint">${T.hint(i+1)}${esc(d)}</div>`).join('');
  if (n > c.dicas.length) h += `<div class="hint"><b>${T.solution}</b><br><pre>${esc(c.solucao)}</pre></div>`;
  $('hintBox').innerHTML = h;
  $('hintBtn').disabled = n >= c.dicas.length;
  $('hintBtn').style.opacity = n >= c.dicas.length ? .4 : 1;
}
function value() {
  const h = st.hints[st.cur] || 0;
  if (h > C[st.cur].dicas.length) return 10;
  return Math.max(25, 100 - 30*h);
}
function renderSchema() {
  if (!db) return;
  const r = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  $('schema').innerHTML = r[0].values.map(([t]) => {
    const cols = db.exec(`PRAGMA table_info(${t})`)[0].values.map(v => esc(v[1]) + ' <i class="th-type">' + esc((v[2]||'').toLowerCase()) + '</i>');
    return `<div class="tbl"><button data-t="${esc(t)}">${esc(t)}</button><span>${cols.join('<br>')}</span></div>`;
  }).join('');
}
function translate(msg) {
  let m;
  if ((m = msg.match(/no such column: (.+)/))) return T.errCol(esc(m[1]));
  if ((m = msg.match(/no such table: (.+)/))) return T.errTable(esc(m[1]));
  if (/syntax error/.test(msg)) return T.errSyntax(esc(msg));
  if (/ambiguous column/.test(msg)) return T.errAmbig;
  if (/misuse of aggregate/.test(msg)) return T.errAgg;
  if (/incomplete input/.test(msg)) return T.errIncomplete;
  return esc(msg);
}
function run() {
  const q = $('sql').value.trim();
  st.drafts[draftKey(st.cur)] = $('sql').value; save();
  if (!q) { $('verdict').innerHTML = `<div class="verdict info">${T.empty}</div>`; return null; }
  if (!db) { $('verdict').innerHTML = `<div class="verdict info">${T.loading}</div>`; return null; }
  try {
    const r = db.exec(q);
    if (/\b(insert|update|delete|drop|alter|create|replace)\b/i.test(q)) { reset(); $('verdict').innerHTML = `<div class="verdict info">${T.restored}</div>`; }
    if (!r.length) { last = {columns:[], values:[]}; $('result').innerHTML = `<div class="count">${T.noRows}</div>`; return last; }
    last = r[r.length-1];
    $('result').innerHTML = `<div class="res"><table><thead><tr>${last.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${last.values.slice(0,200).map(row=>`<tr>${row.map(v=>`<td class="${typeof v==='number'?'n':''}">${v===null?'<i>NULL</i>':esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="count">${T.rows(last.values.length, last.values.length > 200)}</div>`;
    return last;
  } catch(e) {
    reset();
    $('verdict').innerHTML = `<div class="verdict bad">${translate(e.message)}</div>`; $('result').innerHTML = ''; last = null; return null;
  }
}
const norm = v => v === null ? 'NULL' : typeof v === 'number' ? String(Math.round(v*100)/100) : String(v);
function check() {
  $('verdict').innerHTML = '';
  const got = run(); if (!got) return;
  const c = C[st.cur], exp = db.exec(c.solucao).pop();
  const say = (cls, t) => $('verdict').innerHTML = `<div class="verdict ${cls}">${t}</div>`;
  const mock = T.bad[Math.floor(Math.random()*T.bad.length)];
  if (got.columns.length !== exp.columns.length) return say('bad', `${mock}<br>${T.wrongCols(got.columns.length, exp.columns.length)}`);
  if (got.values.length !== exp.values.length) return say('bad', `${mock}<br>${T.wrongRows(got.values.length, exp.values.length)}`);
  const a = got.values.map(r => r.map(norm).join('¦')), b = exp.values.map(r => r.map(norm).join('¦'));
  const sameSet = JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  const same = c.ordem ? a.every((x,i) => x === b[i]) : sameSet;
  if (!same) return say('bad', c.ordem && sameSet ? T.wrongOrder : `${mock}<br>${T.wrongContent}`);
  const first = st.done[st.cur] === undefined;
  if (first) st.done[st.cur] = value();
  save();
  say('good', `${T.correct}${first ? '+' + st.done[st.cur] + ' XP. ' : ''}${esc(c.fim)}`);
  $('stamp').className = 'stamp show';
  const rankBefore = $('rankName').textContent;
  renderTabs(); renderRank();
  if (first) setTimeout(() => {
    const end = st.cur === C.length - 1;
    $('mTitle').textContent = end ? T.mSaved : T.mClosed;
    $('mText').textContent = c.fim;
    $('mXp').innerHTML = T.mXp(st.done[st.cur], xp(), esc($('rankName').textContent)) + (rankBefore !== $('rankName').textContent ? T.promo : '') + (end ? T.mEnd(C.length) : '');
    $('mEvid').innerHTML = `<p class="evid">${T.evidence}</p>` + $('result').innerHTML;
    $('mNext').style.display = end ? 'none' : '';
    $('modal').classList.add('open'); $('mNext').focus();
  }, 350);
}
function reset() { if (SQL) { db = new SQL.Database(); db.exec(DATA[lang].seed); } }
function go(i) { if (!unlocked(i)) { $('verdict').innerHTML = `<div class="verdict info">${T.locked}</div>`; return; } st.cur = i; save(); renderCase(); }
function setLang(l) {
  if (l === lang || !DATA[l]) return;
  st.drafts[draftKey(st.cur)] = $('sql').value; save();
  lang = l; T = window.I18N[l]; C = DATA[l].cases;
  try { localStorage.setItem(LKEY, l); } catch(e) {}
  try { const u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch(e) {}
  applyStatic(); reset(); renderSchema(); renderCase();
}

$('langSwitch').addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (b) setLang(b.dataset.lang); });
$('tabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) go(+b.dataset.i); });
$('runBtn').addEventListener('click', () => { $('verdict').innerHTML = ''; run(); });
$('checkBtn').addEventListener('click', check);
$('clearBtn').addEventListener('click', () => { $('sql').value = ''; $('result').innerHTML = ''; $('verdict').innerHTML = ''; $('sql').focus(); });
$('sql').addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); $('verdict').innerHTML = ''; run(); }
  if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const t = e.target, s = t.selectionStart; t.setRangeText('  ', s, t.selectionEnd, 'end'); }
});
$('sql').addEventListener('input', () => { st.drafts[draftKey(st.cur)] = $('sql').value; save(); });
$('hintBtn').addEventListener('click', () => { st.hints[st.cur] = (st.hints[st.cur]||0) + 1; save(); renderHints(); });
$('solBtn').addEventListener('click', () => { st.hints[st.cur] = C[st.cur].dicas.length + 1; save(); renderHints(); });
$('schema').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) { $('sql').value = `SELECT * FROM ${b.dataset.t} LIMIT 10;`; $('verdict').innerHTML=''; run(); } });
$('mNext').addEventListener('click', () => { $('modal').classList.remove('open'); go(st.cur + 1); });
$('mStay').addEventListener('click', () => $('modal').classList.remove('open'));
$('modal').addEventListener('keydown', e => { if (e.key === 'Escape') $('modal').classList.remove('open'); });
$('resetBtn').addEventListener('click', () => {
  if ($('resetBtn').dataset.sure) { st = {cur:0,done:{},hints:{},drafts:{}}; save(); delete $('resetBtn').dataset.sure; $('resetBtn').textContent = T.reset; renderCase(); }
  else { $('resetBtn').dataset.sure = 1; $('resetBtn').textContent = T.resetSure; }
});

if (st.cur >= C.length || !unlocked(st.cur)) st.cur = 0;
applyStatic();
renderCase();
if (typeof initSqlJs !== 'function') { $('verdict').innerHTML = `<div class="verdict bad">${T.engineFail}</div>`; }
else initSqlJs().then(s => { SQL = s; reset(); renderSchema(); })
  .catch(() => { $('verdict').innerHTML = `<div class="verdict bad">${T.engineFail}</div>`; });
}
