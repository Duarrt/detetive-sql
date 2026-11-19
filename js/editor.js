// SQL editor helpers: syntax highlighting behind the textarea and
// automatic UPPERCASE for SQL keywords as they are typed.
window.SqlEditor = (() => {
  const KEYWORDS = new Set(('SELECT FROM WHERE AND OR NOT IN IS NULL AS ON JOIN LEFT RIGHT INNER OUTER FULL CROSS ' +
    'GROUP BY ORDER HAVING LIMIT OFFSET DISTINCT UNION ALL WITH RECURSIVE CASE WHEN THEN ELSE END LIKE GLOB ' +
    'BETWEEN EXISTS ASC DESC INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE DROP ALTER OVER PARTITION ' +
    'ROWS RANGE PRECEDING FOLLOWING UNBOUNDED CURRENT ROW TRUE FALSE ESCAPE COLLATE NATURAL USING EXCEPT INTERSECT').split(' '));
  const FUNCTIONS = new Set(('COUNT SUM AVG MIN MAX TOTAL ROUND ABS LENGTH LOWER UPPER SUBSTR SUBSTRING TRIM LTRIM RTRIM ' +
    'REPLACE INSTR COALESCE IFNULL NULLIF CAST STRFTIME DATE TIME DATETIME JULIANDAY PRINTF GROUP_CONCAT ' +
    'ROW_NUMBER RANK DENSE_RANK LAG LEAD NTILE FIRST_VALUE LAST_VALUE').split(' '));

  const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  // Splits SQL into tokens; unterminated strings and comments run to the end.
  function tokens(src) {
    const re = /(--[^\n]*)|('(?:[^']|'')*'?)|("(?:[^"]|"")*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([\s\S])/g;
    const out = []; let m;
    while ((m = re.exec(src))) {
      if (m[1]) out.push(['cmt', m[1]]);
      else if (m[2]) out.push(['str', m[2]]);
      else if (m[3]) out.push(['id', m[3]]);
      else if (m[4]) out.push(['num', m[4]]);
      else if (m[5]) out.push(['word', m[5]]);
      else out.push(['raw', m[0]]);
    }
    return out;
  }

  function highlight(src) {
    const ts = tokens(src);
    return ts.map(([type, text], i) => {
      if (type === 'word') {
        const up = text.toUpperCase();
        if (KEYWORDS.has(up)) return `<span class="kw">${esc(text)}</span>`;
        const next = ts.slice(i + 1).find(t => t[0] !== 'raw' || t[1].trim());
        if (FUNCTIONS.has(up) && next && next[1] === '(') return `<span class="fn">${esc(text)}</span>`;
        return esc(text);
      }
      if (type === 'str') return `<span class="str">${esc(text)}</span>`;
      if (type === 'num') return `<span class="num">${esc(text)}</span>`;
      if (type === 'cmt') return `<span class="cmt">${esc(text)}</span>`;
      return esc(text);
    }).join('');
  }

  // True if position `pos` of `src` is inside a string literal or a comment.
  function insideLiteral(src, pos) {
    let len = 0;
    for (const [type, text] of tokens(src)) {
      if (pos < len + text.length) return (type === 'str' || type === 'cmt' || type === 'id') && pos > len;
      len += text.length;
    }
    return false;
  }

  // After a separator is typed, uppercase the word right before it if it is a keyword
  // (or a function name when the separator is "(").
  function autoUpper(ta, sep) {
    const caret = ta.selectionStart;
    if (caret !== ta.selectionEnd) return;
    const before = ta.value.slice(0, caret - sep.length);
    const m = before.match(/([A-Za-z_][A-Za-z0-9_]*)$/);
    if (!m) return;
    const word = m[1], up = word.toUpperCase(), start = before.length - word.length;
    if (word === up) return;
    const prev = before[start - 1];
    if (prev === '.' || /[A-Za-z0-9_]/.test(prev || '')) return;
    if (!(KEYWORDS.has(up) || (sep === '(' && FUNCTIONS.has(up)))) return;
    if (insideLiteral(ta.value, start)) return;
    ta.setRangeText(up, start, start + word.length, 'preserve');
    ta.setSelectionRange(caret, caret);
  }

  function attach(ta, code) {
    const pre = code.parentElement;
    const paint = () => { code.innerHTML = highlight(ta.value) + '\n'; pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; };
    ta.addEventListener('input', e => {
      const d = e.data;
      if (e.inputType === 'insertText' && d && /^[\s,;()=<>+*\/-]$/.test(d)) autoUpper(ta, d);
      else if (e.inputType === 'insertLineBreak') autoUpper(ta, '\n');
      paint();
    });
    ta.addEventListener('scroll', () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; });
    new ResizeObserver(paint).observe(ta);
    paint();
    return paint;
  }

  return { attach, highlight };
})();
