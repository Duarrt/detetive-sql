{
const $ = id => document.getElementById(id);
const C = window.CASES, KEY = 'detetive-sql-v1';
const RANKS = [[0,'Estagiária do Arquivo Morto'],[200,'Detetive Júnior'],[500,'Investigadora'],[850,'Inspetora'],[1150,'Delegada-Chefe']];
const BAD = ['O banco de dados te olhou com desprezo.','Errado, mas com confiança. Gosto disso. Ainda está errado.','Até o galo que canta às 4h acertaria essa. Tenta de novo.','A Dona Lúcia viu tudo e está rindo da janela.','Quase. Assim como o wi-fi do vizinho: quase seu.'];
let st = {cur:0, done:{}, hints:{}, drafts:{}};
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) st = Object.assign(st, s); } catch(e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {} };
let db = null, last = null;

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const xp = () => Object.values(st.done).reduce((a,b) => a+b, 0);
const unlocked = i => i === 0 || st.done[i-1] !== undefined || st.done[i] !== undefined;

function renderRank() {
  const x = xp(); let r = RANKS[0];
  for (const k of RANKS) if (x >= k[0]) r = k;
  const nx = RANKS.find(k => k[0] > x);
  $('rankName').textContent = r[1];
  $('xpTxt').textContent = x + ' XP' + (nx ? ' · próxima patente em ' + (nx[0]-x) : ' · patente máxima');
  $('xpFill').style.width = Math.min(100, x / 1300 * 100) + '%';
}
function renderTabs() {
  $('tabs').innerHTML = C.map((c,i) => {
    const cls = ['tab', i===st.cur?'on':'', st.done[i]!==undefined?'done':'', unlocked(i)?'':'lock'].join(' ');
    return `<button class="${cls}" data-i="${i}" ${unlocked(i)?'':'aria-disabled="true"'} title="${esc(c.titulo)}"><small>Fase ${c.fase} · ${esc(c.faseNome)}</small>Caso ${i+1}${unlocked(i)?'':' 🔒'}</button>`;
  }).join('');
}
function renderCase() {
  const c = C[st.cur];
  $('caseNo').textContent = 'CASO Nº ' + String(st.cur+1).padStart(3,'0') + ' de ' + C.length;
  $('phase').textContent = 'Fase ' + c.fase + ' — ' + c.faseNome;
  $('title').textContent = c.titulo;
  $('story').innerHTML = c.historia;
  $('concept').innerHTML = c.conceito;
  $('example').textContent = c.exemplo;
  $('goal').textContent = 'Objetivo: ' + c.objetivo;
  $('stamp').className = 'stamp' + (st.done[st.cur]!==undefined ? ' show' : '');
  $('sql').value = st.drafts[st.cur] ?? '';
  $('verdict').innerHTML = st.done[st.cur]!==undefined ? `<div class="verdict good">Caso resolvido (+${st.done[st.cur]} XP). ${esc(c.fim)}</div>` : '';
  $('result').innerHTML = ''; last = null;
  renderHints(); renderTabs(); renderRank();
}
function renderHints() {
  const c = C[st.cur], n = st.hints[st.cur] || 0;
  let h = c.dicas.slice(0, Math.min(n, c.dicas.length)).map((d,i) => `<div class="hint">Dica ${i+1}: ${esc(d)}</div>`).join('');
  if (n > c.dicas.length) h += `<div class="hint"><b>Solução:</b><br><pre>${esc(c.solucao)}</pre></div>`;
  $('hintBox').innerHTML = h;
  $('hintBtn').disabled = n >= c.dicas.length;
  $('hintBtn').style.opacity = n >= c.dicas.length ? .4 : 1;
}
function value() {
  const n = C[st.cur], h = st.hints[st.cur] || 0;
  if (h > n.dicas.length) return 10;
  return Math.max(25, 100 - 30*h);
}
function renderSchema() {
  const r = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  $('schema').innerHTML = r[0].values.map(([t]) => {
    const cols = db.exec(`PRAGMA table_info(${t})`)[0].values.map(v => v[1] + ' <i class="th-type">' + (v[2]||'').toLowerCase() + '</i>');
    return `<div class="tbl"><button data-t="${t}">${t}</button><span>${cols.join('<br>')}</span></div>`;
  }).join('');
}
function translate(msg) {
  let m;
  if ((m = msg.match(/no such column: (.+)/))) return `A coluna <b>${esc(m[1])}</b> não existe. Confira o nome no arquivo de evidências (sem acento: <code>profissao</code>, <code>descricao</code>).`;
  if ((m = msg.match(/no such table: (.+)/))) return `A tabela <b>${esc(m[1])}</b> não existe. Na Vila Pacata só temos as do arquivo de evidências. Inventar tabela é coisa de político.`;
  if (/syntax error/.test(msg)) return `Erro de sintaxe (${esc(msg)}). Procure vírgula sobrando, aspa sem fechar ou palavra trocada. Texto vai entre aspas <b>simples</b>.`;
  if (/ambiguous column/.test(msg)) return `Coluna ambígua: ela existe em mais de uma tabela. Use o apelido, tipo <code>m.id</code> ou <code>c.morador_id</code>.`;
  if (/misuse of aggregate/.test(msg)) return `Agregação no lugar errado. Condição com SUM/COUNT vai no <b>HAVING</b>, não no WHERE.`;
  if (/incomplete input/.test(msg)) return `A consulta terminou no meio. Faltou fechar parêntese, aspas ou um END?`;
  return esc(msg);
}
function run() {
  const q = $('sql').value.trim();
  st.drafts[st.cur] = $('sql').value; save();
  if (!q) { $('verdict').innerHTML = '<div class="verdict info">Terminal vazio. Silêncio também é uma resposta, mas não aqui.</div>'; return null; }
  if (!db) { $('verdict').innerHTML = '<div class="verdict info">O banco ainda está carregando. Respira.</div>'; return null; }
  try {
    const r = db.exec(q);
    const wrote = /\b(insert|update|delete|drop|alter|create|replace)\b/i.test(q);
    if (wrote) { reset(); $('verdict').innerHTML = '<div class="verdict info">Você mexeu nos dados. Para não destruir provas, a Vila foi restaurada ao estado original depois do comando.</div>'; }
    if (!r.length) { last = {columns:[], values:[]}; $('result').innerHTML = '<div class="count">Comando executado, nenhuma linha retornada.</div>'; return last; }
    last = r[r.length-1];
    $('result').innerHTML = `<div class="res"><table><thead><tr>${last.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${last.values.slice(0,200).map(row=>`<tr>${row.map(v=>`<td class="${typeof v==='number'?'n':''}">${v===null?'<i>NULL</i>':esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="count">${last.values.length} linha(s)${last.values.length>200?' — mostrando 200':''}</div>`;
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
  const mock = BAD[Math.floor(Math.random()*BAD.length)];
  if (got.columns.length !== exp.columns.length) return say('bad', `${mock}<br>Você trouxe <b>${got.columns.length}</b> coluna(s); o caso pede <b>${exp.columns.length}</b>.`);
  if (got.values.length !== exp.values.length) return say('bad', `${mock}<br>Você trouxe <b>${got.values.length}</b> linha(s); a resposta certa tem <b>${exp.values.length}</b>. Revise os filtros.`);
  const a = got.values.map(r => r.map(norm).join('¦')), b = exp.values.map(r => r.map(norm).join('¦'));
  const same = c.ordem ? a.every((x,i) => x === b[i]) : JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  if (!same) {
    const sorted = !c.ordem ? false : JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
    return say('bad', sorted ? 'As linhas estão certas, mas a <b>ordem</b> não. O delegado é metódico. E chato.' : `${mock}<br>Mesmo tamanho, conteúdo diferente. Confira valores e a ordem das colunas.`);
  }
  const first = st.done[st.cur] === undefined;
  if (first) st.done[st.cur] = value();
  save();
  say('good', `Correto! ${first ? '+' + st.done[st.cur] + ' XP. ' : ''}${esc(c.fim)}`);
  $('stamp').className = 'stamp show';
  const rankBefore = $('rankName').textContent;
  renderTabs(); renderRank();
  if (first) setTimeout(() => {
    const end = st.cur === C.length - 1;
    $('mTitle').textContent = end ? 'Vila Pacata está salva' : 'Caso encerrado!';
    $('mText').textContent = c.fim;
    $('mXp').innerHTML = `<b>+${st.done[st.cur]} XP</b> · total ${xp()} XP · patente: ${esc($('rankName').textContent)}` + (rankBefore !== $('rankName').textContent ? ' — <b>promoção!</b>' : '') + (end ? `<br>Você fechou os ${C.length} casos. O Delegado Bastos quase sorriu. Quase.` : '');
    $('mEvid').innerHTML = `<p class="evid">Evidência que você entregou</p>` + $('result').innerHTML;
    $('mNext').style.display = end ? 'none' : '';
    $('modal').classList.add('open'); $('mNext').focus();
  }, 350);
}
function reset() { db = new initSqlJs.SQL.Database(); db.exec(window.SEED); }
function go(i) { if (!unlocked(i)) { $('verdict').innerHTML = '<div class="verdict info">Caso trancado. Feche o anterior primeiro — burocracia é sagrada.</div>'; return; } st.cur = i; save(); renderCase(); }

$('tabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) go(+b.dataset.i); });
$('runBtn').addEventListener('click', () => { $('verdict').innerHTML = ''; run(); });
$('checkBtn').addEventListener('click', check);
$('clearBtn').addEventListener('click', () => { $('sql').value = ''; $('result').innerHTML = ''; $('verdict').innerHTML = ''; $('sql').focus(); });
$('sql').addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); $('verdict').innerHTML = ''; run(); }
  if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const t = e.target, s = t.selectionStart; t.setRangeText('  ', s, t.selectionEnd, 'end'); }
});
$('sql').addEventListener('input', () => { st.drafts[st.cur] = $('sql').value; save(); });
$('hintBtn').addEventListener('click', () => { st.hints[st.cur] = (st.hints[st.cur]||0) + 1; save(); renderHints(); });
$('solBtn').addEventListener('click', () => { st.hints[st.cur] = C[st.cur].dicas.length + 1; save(); renderHints(); });
$('schema').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) { $('sql').value = `SELECT * FROM ${b.dataset.t} LIMIT 10;`; $('verdict').innerHTML=''; run(); } });
$('mNext').addEventListener('click', () => { $('modal').classList.remove('open'); go(st.cur + 1); });
$('mStay').addEventListener('click', () => $('modal').classList.remove('open'));
$('modal').addEventListener('keydown', e => { if (e.key === 'Escape') $('modal').classList.remove('open'); });
$('resetBtn').addEventListener('click', () => { if ($('resetBtn').dataset.sure) { st = {cur:0,done:{},hints:{},drafts:{}}; save(); delete $('resetBtn').dataset.sure; $('resetBtn').textContent='Zerar progresso'; renderCase(); } else { $('resetBtn').dataset.sure = 1; $('resetBtn').textContent = 'Clique de novo para confirmar'; } });

if (st.cur >= C.length || !unlocked(st.cur)) st.cur = 0;
renderCase();
if (typeof initSqlJs !== 'function') { $('verdict').innerHTML = '<div class="verdict bad">Não consegui carregar o motor SQL. Recarregue a página.</div>'; }
else initSqlJs().then(SQL => {
  initSqlJs.SQL = SQL; reset(); renderSchema();
}).catch(() => { $('verdict').innerHTML = '<div class="verdict bad">Não consegui carregar o motor SQL. Recarregue a página.</div>'; });
}
