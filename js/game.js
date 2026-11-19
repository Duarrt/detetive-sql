{
const $ = id => document.getElementById(id);
const KEY = 'detetive-sql-v1', LKEY = 'detetive-sql-lang';
const CHAPTERS = ['pro', 's1'];
const BASE_XP = { pro: 100, s1: 150 };
const DATA = {
  pt: { pro: {seed: window.SEED, cases: window.CASES}, s1: {seed: window.SEED + window.SEED_S1, cases: window.CASES_S1} },
  en: { pro: {seed: window.SEED_EN, cases: window.CASES_EN}, s1: {seed: window.SEED_EN + window.SEED_S1_EN, cases: window.CASES_S1_EN} }
};
const RANK_XP = [0, 200, 500, 850, 1150, 2000];
const MAX_XP = CHAPTERS.reduce((a, ch) => a + DATA.pt[ch].cases.length * BASE_XP[ch], 0);

// ---- state (v2), migrating the v1 shape {cur, done, hints, drafts} ----
const fresh = () => ({ v: 2, cur: {ch: 'pro', i: 0}, ch: {pro: {done:{}, hints:{}}, s1: {done:{}, hints:{}}}, drafts: {}, s1open: false });
function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch(e) {}
  const st = fresh();
  if (!s) return st;
  if (s.v === 2) return Object.assign(st, s, { ch: Object.assign(st.ch, s.ch || {}) });
  st.ch.pro.done = s.done || {}; st.ch.pro.hints = s.hints || {};
  st.cur = { ch: 'pro', i: s.cur || 0 };
  Object.entries(s.drafts || {}).forEach(([k, v]) => {
    const m = k.match(/^(?:(pt|en):)?(\d+)$/);
    if (m) st.drafts[(m[1] || 'pt') + ':pro:' + m[2]] = v;
  });
  return st;
}
let st = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {} };

function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'pt' || q === 'en') return q;
  try { const s = localStorage.getItem(LKEY); if (s === 'pt' || s === 'en') return s; } catch(e) {}
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}
let lang = pickLang(), T = window.I18N[lang];
let SQL = null, db = null, last = null, dbFor = '';

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ch = () => st.cur.ch;
const C = () => DATA[lang][ch()].cases;
const P = (c = ch()) => st.ch[c];
const xp = () => CHAPTERS.reduce((a, c) => a + Object.values(st.ch[c].done).reduce((x, y) => x + y, 0), 0);
const proDone = () => Object.keys(st.ch.pro.done).length >= DATA.pt.pro.cases.length;
const chapterOpen = c => c === 'pro' || st.s1open || proDone();
const unlocked = i => i === 0 || P().done[i-1] !== undefined || P().done[i] !== undefined;
const draftKey = i => `${lang}:${ch()}:${i}`;
const rankName = x => { let n = 0; RANK_XP.forEach((v,i) => { if (x >= v) n = i; }); return T.ranks[n]; };
const pad = n => String(n).padStart(2, '0');

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
function renderChapters() {
  document.body.classList.toggle('ch-s1', ch() === 's1');
  $('chapters').innerHTML = CHAPTERS.map(c => {
    const open = chapterOpen(c), n = Object.keys(st.ch[c].done).length, total = DATA[lang][c].cases.length;
    return `<button type="button" class="chap${c === ch() ? ' on' : ''}${open ? '' : ' lock'}" data-ch="${c}" aria-pressed="${c === ch()}">${esc(T.chapter[c])}<small>${open ? `${n}/${total}` : '🔒'}</small></button>`;
  }).join('');
}
function renderRank() {
  const x = xp(), nx = RANK_XP.find(v => v > x);
  $('rankName').textContent = rankName(x);
  $('xpTxt').textContent = x + ' XP' + (nx !== undefined ? T.xpNext(nx - x) : T.xpMax);
  $('xpFill').style.width = Math.min(100, x / MAX_XP * 100) + '%';
}
function renderTabs() {
  $('tabs').innerHTML = C().map((c,i) => {
    const cls = ['tab', i===st.cur.i?'on':'', P().done[i]!==undefined?'done':'', unlocked(i)?'':'lock'].join(' ');
    const label = ch() === 'pro' ? T.tab(c.fase, esc(c.faseNome), i+1) : T.tabS1(i+1);
    return `<button class="${cls}" data-i="${i}" ${unlocked(i)?'':'aria-disabled="true"'} title="${esc(c.titulo)}">${label}${unlocked(i)?'':' 🔒'}</button>`;
  }).join('');
}
function renderClues() {
  const box = $('clues');
  if (ch() !== 's1') { box.hidden = true; return; }
  const cs = C(), n = Object.keys(P().done).length;
  box.hidden = false;
  box.querySelector('summary').textContent = T.cluesTitle(n, cs.length);
  $('clueList').innerHTML = cs.map((c, i) => P().done[i] !== undefined
    ? `<li class="got"><b>${i+1}.</b> ${esc(c.pista)}</li>`
    : `<li class="nope"><b>${i+1}.</b> ${T.clueLocked}</li>`).join('');
}
function renderCase() {
  const c = C()[st.cur.i];
  const isS1 = ch() === 's1';
  $('caseNo').textContent = (isS1 ? T.s1Short + ' · ' : '') + T.caseNo(String(st.cur.i+1).padStart(3,'0'), C().length);
  $('phase').textContent = isS1 ? T.s1Name : T.phase(c.fase, c.faseNome);
  $('title').textContent = c.titulo;
  $('story').innerHTML = c.historia;
  $('concept').innerHTML = c.conceito;
  $('example').textContent = c.exemplo;
  $('goal').textContent = T.goal + c.objetivo;
  $('stamp').className = 'stamp' + (P().done[st.cur.i]!==undefined ? ' show' : '');
  $('sql').value = st.drafts[draftKey(st.cur.i)] ?? '';
  $('verdict').innerHTML = P().done[st.cur.i]!==undefined ? `<div class="verdict good">${T.solved(P().done[st.cur.i])}${esc(c.fim)}</div>` : '';
  $('result').innerHTML = ''; last = null;
  ensureDb();
  renderHints(); renderChapters(); renderTabs(); renderRank(); renderClues();
}
function renderHints() {
  const c = C()[st.cur.i], n = P().hints[st.cur.i] || 0;
  let h = c.dicas.slice(0, Math.min(n, c.dicas.length)).map((d,i) => `<div class="hint">${T.hint(i+1)}${esc(d)}</div>`).join('');
  if (n > c.dicas.length) h += `<div class="hint"><b>${T.solution}</b><br><pre>${esc(c.solucao)}</pre></div>`;
  $('hintBox').innerHTML = h;
  $('hintBtn').disabled = n >= c.dicas.length;
  $('hintBtn').style.opacity = n >= c.dicas.length ? .4 : 1;
  $('hintBtn').textContent = T.hintBtn;
  $('solBtn').textContent = T.solBtn(Math.round(BASE_XP[ch()] / 10));
  const d = P().done[st.cur.i];
  $('caseValue').innerHTML = d !== undefined ? T.worthDone(d) : T.worth(value());
}
function value() {
  const base = BASE_XP[ch()], h = P().hints[st.cur.i] || 0;
  if (h > C()[st.cur.i].dicas.length) return Math.round(base / 10);
  return Math.max(Math.round(base / 4), base - 30*h);
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
  if (/do not have the same number of result columns/.test(msg)) return T.errUnion;
  return esc(msg);
}
function reset() { if (SQL) { db = new SQL.Database(); db.exec(DATA[lang][ch()].seed); dbFor = lang + ':' + ch(); } }
function ensureDb() { if (SQL && dbFor !== lang + ':' + ch()) { reset(); renderSchema(); } }
function run() {
  const q = $('sql').value.trim();
  st.drafts[draftKey(st.cur.i)] = $('sql').value; save();
  if (!q) { $('verdict').innerHTML = `<div class="verdict info">${T.empty}</div>`; return null; }
  if (!db) { $('verdict').innerHTML = `<div class="verdict info">${T.loading}</div>`; return null; }
  try {
    const r = db.exec(q);
    if (/\b(insert|update|delete|drop|alter|create)\b/i.test(q)) { reset(); $('verdict').innerHTML = `<div class="verdict info">${T.restored}</div>`; }
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
  const c = C()[st.cur.i], exp = db.exec(c.solucao).pop();
  const say = (cls, t) => $('verdict').innerHTML = `<div class="verdict ${cls}">${t}</div>`;
  const mock = T.bad[Math.floor(Math.random()*T.bad.length)];
  if (got.columns.length !== exp.columns.length) return say('bad', `${mock}<br>${T.wrongCols(got.columns.length, exp.columns.length)}`);
  if (got.values.length !== exp.values.length) return say('bad', `${mock}<br>${T.wrongRows(got.values.length, exp.values.length)}`);
  const a = got.values.map(r => r.map(norm).join('¦')), b = exp.values.map(r => r.map(norm).join('¦'));
  const sameSet = JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  const same = c.ordem ? a.every((x,i) => x === b[i]) : sameSet;
  if (!same) return say('bad', c.ordem && sameSet ? T.wrongOrder : `${mock}<br>${T.wrongContent}`);
  const first = P().done[st.cur.i] === undefined;
  const rankBefore = rankName(xp());
  const proWasDone = proDone();
  if (first) {
    P().done[st.cur.i] = value();
    try {
      if (window.goatcounter && goatcounter.count)
        goatcounter.count({path: `${ch() === 's1' ? 't1-' : ''}caso-${pad(st.cur.i+1)}-resolvido-${lang}`, title: c.titulo, event: true});
    } catch(e) {}
  }
  save();
  say('good', `${T.correct}${first ? '+' + P().done[st.cur.i] + ' XP. ' : ''}${esc(c.fim)}`);
  $('stamp').className = 'stamp show';
  renderHints(); renderChapters(); renderTabs(); renderRank(); renderClues();
  if (first) setTimeout(() => {
    const end = st.cur.i === C().length - 1, isS1 = ch() === 's1';
    const unlockedS1 = !isS1 && !proWasDone && proDone();
    $('mTitle').textContent = end ? (isS1 ? T.mSavedS1 : T.mSaved) : T.mClosed;
    $('mText').textContent = c.fim;
    const r = rankName(xp());
    $('mXp').innerHTML = T.mXp(P().done[st.cur.i], xp(), esc(r)) + (rankBefore !== r ? T.promo : '') + (end ? (isS1 ? T.mEndS1 : T.mEnd(C().length)) : '');
    $('mClue').innerHTML = isS1 ? `<p class="evid">${T.newClue}</p><p class="clue-new">${esc(c.pista)}</p>` : '';
    $('mEvid').innerHTML = `<p class="evid">${T.evidence}</p>` + $('result').innerHTML;
    const nextBtn = $('mNext');
    if (!end) { nextBtn.textContent = T.next; nextBtn.dataset.go = 'next'; nextBtn.style.display = ''; }
    else if (unlockedS1 || (!isS1 && chapterOpen('s1'))) { nextBtn.textContent = T.startS1; nextBtn.dataset.go = 's1'; nextBtn.style.display = ''; }
    else nextBtn.style.display = 'none';
    $('modal').classList.add('open'); nextBtn.style.display !== 'none' ? nextBtn.focus() : $('mStay').focus();
  }, 350);
}
function go(i) { if (!unlocked(i)) { $('verdict').innerHTML = `<div class="verdict info">${T.locked}</div>`; return; } st.cur.i = i; save(); renderCase(); }
function setChapter(c) {
  if (!DATA[lang][c]) return;
  if (!chapterOpen(c)) {
    $('verdict').innerHTML = `<div class="verdict info">${T.s1Locked} <button type="button" class="sec small" id="openS1">${T.s1Skip}</button></div>`;
    return;
  }
  st.drafts[draftKey(st.cur.i)] = $('sql').value;
  let i = 0; while (i < DATA[lang][c].cases.length - 1 && st.ch[c].done[i] !== undefined) i++;
  st.cur = {ch: c, i};
  save(); renderCase();
}
function setLang(l) {
  if (l === lang || !DATA[l]) return;
  st.drafts[draftKey(st.cur.i)] = $('sql').value; save();
  lang = l; T = window.I18N[l];
  try { localStorage.setItem(LKEY, l); } catch(e) {}
  try { const u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch(e) {}
  applyStatic(); renderCase();
}

$('langSwitch').addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (b) setLang(b.dataset.lang); });
$('chapters').addEventListener('click', e => { const b = e.target.closest('[data-ch]'); if (b) setChapter(b.dataset.ch); });
$('verdict').addEventListener('click', e => { if (e.target.id === 'openS1') { st.s1open = true; save(); setChapter('s1'); } });
$('tabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) go(+b.dataset.i); });
$('runBtn').addEventListener('click', () => { $('verdict').innerHTML = ''; run(); });
$('checkBtn').addEventListener('click', check);
$('clearBtn').addEventListener('click', () => { $('sql').value = ''; $('result').innerHTML = ''; $('verdict').innerHTML = ''; $('sql').focus(); });
$('sql').addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); $('verdict').innerHTML = ''; run(); }
  if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const t = e.target, s = t.selectionStart; t.setRangeText('  ', s, t.selectionEnd, 'end'); }
});
$('sql').addEventListener('input', () => { st.drafts[draftKey(st.cur.i)] = $('sql').value; save(); });
$('hintBtn').addEventListener('click', () => { P().hints[st.cur.i] = (P().hints[st.cur.i]||0) + 1; save(); renderHints(); });
$('solBtn').addEventListener('click', () => { P().hints[st.cur.i] = C()[st.cur.i].dicas.length + 1; save(); renderHints(); });
$('schema').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) { $('sql').value = `SELECT * FROM ${b.dataset.t} LIMIT 10;`; $('verdict').innerHTML=''; run(); } });
$('mNext').addEventListener('click', () => {
  $('modal').classList.remove('open');
  if ($('mNext').dataset.go === 's1') setChapter('s1'); else go(st.cur.i + 1);
});
$('mStay').addEventListener('click', () => $('modal').classList.remove('open'));
$('modal').addEventListener('keydown', e => { if (e.key === 'Escape') $('modal').classList.remove('open'); });
$('resetBtn').addEventListener('click', () => {
  if ($('resetBtn').dataset.sure) { st = fresh(); save(); delete $('resetBtn').dataset.sure; $('resetBtn').textContent = T.reset; renderCase(); }
  else { $('resetBtn').dataset.sure = 1; $('resetBtn').textContent = T.resetSure; }
});

if (!DATA[lang][st.cur.ch] || !chapterOpen(st.cur.ch)) st.cur = {ch: 'pro', i: 0};
if (st.cur.i >= C().length || !unlocked(st.cur.i)) st.cur.i = 0;
applyStatic();
renderCase();
if (typeof initSqlJs !== 'function') { $('verdict').innerHTML = `<div class="verdict bad">${T.engineFail}</div>`; }
else initSqlJs().then(s => { SQL = s; reset(); renderSchema(); })
  .catch(() => { $('verdict').innerHTML = `<div class="verdict bad">${T.engineFail}</div>`; });
}
